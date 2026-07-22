import { useState } from 'react';
import { WS_SERVICE_URL } from '@src/common/constants';
import { ConnectionState } from '@src/lib/SocketIOClient/logic/constants';
import { useSocketIO } from '@src/lib/SocketIOClient/useSocketIO';
import { useStreaming } from './hooks/useStreaming';

export function useSocketIOPageLogic() {
  const [url, setUrl] = useState(WS_SERVICE_URL);
  const [eventName, setEventName] = useState('');
  const [payloadText, setPayloadText] = useState('');

  const { connectionState, connectionError, eventLog, connect, disconnect, emit, clearLog } = useSocketIO();

  const isConnected = connectionState === ConnectionState.Connected;
  const isConnecting = connectionState === ConnectionState.Connecting;

  const handleEmit = () => {
    const trimmedEventName = eventName.trim();

    if (!trimmedEventName) return;

    let data: unknown;

    if (payloadText.trim()) {
      try {
        data = JSON.parse(payloadText);
      } catch {
        data = payloadText;
      }
    }

    emit(trimmedEventName, data);
  };

  const [topic, setTopic] = useState('');
  const { startStreamingTo, stopStreaming, isStreaming } = useStreaming({ emit });

  return {
    // Connection:
    url,
    setUrl,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    connectionState,
    connectionError,
    // Emit Event:
    eventName,
    setEventName,
    handleEmit,
    payloadText,
    setPayloadText,
    // Data Streaming:
    topic,
    setTopic,
    startStreamingTo,
    stopStreaming,
    isStreaming,
    // Event Log:
    clearLog,
    eventLog,
  };
}
