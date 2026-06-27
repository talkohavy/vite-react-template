import Examples from '../SocketIOPage/content/Examples';
import ConnectionPanel from './content/ConnectionPanel';
import LoginPanel from './content/LoginPanel';
import MessageLogPanel from './content/MessageLogPanel';
import SendMessagePanel from './content/SendMessagePanel';
import { useWebsocketManagerConnectionLogic } from './logic/useWebsocketManagerConnectionLogic';

export default function WebsocketManagerConnectionTab() {
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
    url,
    setUrl,
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
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
  } = useWebsocketManagerConnectionLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='mx-auto flex max-w-2xl flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>WebSocket Client</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Same UI as the Hook tab, but connection state and messaging use{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>WebSocketProvider</span> +{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>useWebSocket()</span> (React context).
          </p>
        </header>

        <LoginPanel
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoggedIn={isLoggedIn}
          loggedInAs={loggedInAs}
          isLoginLoading={isLoginLoading}
          loginError={loginError}
          onLoginSubmit={onLoginSubmit}
          onLogoutClick={onLogoutClick}
        />

        <ConnectionPanel
          url={url}
          setUrl={setUrl}
          retryCount={retryCount}
          onConnectClick={onConnectClick}
          disconnect={disconnect}
          connectionStatus={connectionStatus}
          connectionError={connectionError}
          isLoggedIn={isLoggedIn}
          isConnectButtonDisabled={isConnectButtonDisabled}
          isDisconnectButtonDisabled={isDisconnectButtonDisabled}
        />

        <SendMessagePanel
          messageToSend={messageToSend}
          setMessageToSend={setMessageToSend}
          send={send}
          isSendButtonDisabled={isSendButtonDisabled}
        />

        <MessageLogPanel clearLog={clearLog} log={log} isConnected={isConnected} />

        <Examples />
      </div>
    </div>
  );
}
