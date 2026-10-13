import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { ConnectionState, type ConnectionStateValues } from './logic/constants';
import { nextId } from './logic/utils/nextId';
import { SocketIOClient } from './SocketIOClient';
import type { EventLogEntry } from './types';

export function useSocketIO() {
  const clientRef = useRef<SocketIOClient | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Disconnected);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);

  const cleanupClient = () => {
    const client = clientRef.current;

    if (!client) return;

    const socket = client.getSocket();

    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.offAny();
    client.disconnect();
    clientRef.current = null;
  };

  const cleanupClientOnUnmount = useEffectEvent(cleanupClient);

  function disconnect() {
    cleanupClient();
    setConnectionState(ConnectionState.Disconnected);
    setConnectionError(null);
  }

  function connect(url: string) {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) return;

    cleanupClient();

    const client = new SocketIOClient(trimmedUrl);
    clientRef.current = client;

    const socket = client.getSocket();

    setConnectionState(ConnectionState.Connecting);
    setConnectionError(null);

    socket.on('connect', () => {
      setConnectionState(ConnectionState.Connected);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      setConnectionState(ConnectionState.Disconnected);
    });

    socket.on('connect_error', (err: Error) => {
      setConnectionState('error');
      setConnectionError(err);
    });

    const onAnyHandler = (eventName: string, ...args: unknown[]) => {
      setEventLog((prev) => [
        ...prev,
        { id: nextId(), type: 'received', event: eventName, payload: args, time: new Date() },
      ]);
    };
    socket.onAny(onAnyHandler);

    client.connect();
  }

  function emit(event: string, data?: unknown) {
    const client = clientRef.current;

    if (!client?.isConnected()) return;

    client.getSocket().emit(event, data);

    setEventLog((prev) => [...prev, { id: nextId(), type: 'sent', event, payload: data, time: new Date() }]);
  }

  function clearLog() {
    setEventLog([]);
  }

  function getClient() {
    return clientRef.current;
  }

  function getSocket() {
    return clientRef.current?.getSocket() ?? null;
  }

  useEffect(() => {
    return () => {
      cleanupClientOnUnmount();
    };
  }, []);

  return {
    connectionState,
    connectionError,
    getClient,
    getSocket,
    eventLog,
    connect,
    disconnect,
    emit,
    clearLog,
  };
}
