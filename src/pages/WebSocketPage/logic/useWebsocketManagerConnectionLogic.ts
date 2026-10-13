import { useEffect, useEffectEvent, useState } from 'react';
import { WS_SERVICE_URL } from '@src/common/constants';
import { useWebSocket, WsConnectionStatus } from '@src/providers/WebSocketProvider';
import { MessageState, type MessageStateValues } from './constants';
import { useUserAuthentication } from './hooks/useUserAuthentication';
import { nextId } from './utils/nextId';
import type { MessageLogEntry } from '../types';

export function useWebsocketManagerConnectionLogic() {
  const {
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    isConnectionAcknowledged,
    connect,
    disconnect,
    send: sendRaw,
    subscribeMessages,
  } = useWebSocket();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoggedIn,
    loggedInAs,
    isLoginLoading,
    loginError,
    onLoginSubmit,
    onLogoutClick,
  } = useUserAuthentication();

  const [url, setUrl] = useState(WS_SERVICE_URL);

  const onConnectionOpen = () => {
    console.log('I am connected');
  };

  const onConnectClick = () => {
    connect(url, { onConnectionOpen });
  };

  const [messageToSend, setMessageToSend] = useState('');
  const [log, setLog] = useState<MessageLogEntry[]>([]);

  const addLogEntry = (direction: MessageStateValues, data: string) => {
    setLog((prev) => [...prev, { id: nextId(), time: new Date(), direction, data }]);
  };

  const onMessage = useEffectEvent((data: any) => {
    if (data.type === WsConnectionStatus.ConnectionAcknowledged) {
      console.log('connection_acknowledged received!');
    }

    addLogEntry(MessageState.Received, JSON.stringify(data, null, 2));
  });

  useEffect(() => {
    return subscribeMessages((data) => onMessage(data));
  }, [subscribeMessages]);

  const send = () => {
    const trimmed = messageToSend.trim();

    if (!trimmed) return;

    sendRaw(trimmed);
    addLogEntry(MessageState.Sent, trimmed);
    setMessageToSend('');
  };

  const clearLog = () => setLog([]);

  const isConnectButtonDisabled = isConnecting || isReconnecting || isConnected || isConnectionAcknowledged;
  const isDisconnectButtonDisabled = !isConnected && !isConnectionAcknowledged && !isConnecting && !isReconnecting;
  const isSendButtonDisabled = !((isConnected || isConnectionAcknowledged) && messageToSend.trim());

  return {
    // auth
    email,
    setEmail,
    password,
    setPassword,
    isLoggedIn,
    loggedInAs,
    isLoginLoading,
    loginError,
    onLoginSubmit,
    onLogoutClick,
    // connection
    url,
    setUrl,
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    isConnectionAcknowledged,
    onConnectClick,
    disconnect,
    send,
    clearLog,
    log,
    messageToSend,
    setMessageToSend,
    isConnectButtonDisabled,
    isDisconnectButtonDisabled,
    isSendButtonDisabled,
  };
}
