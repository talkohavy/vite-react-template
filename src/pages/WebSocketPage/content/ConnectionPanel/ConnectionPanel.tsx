import { WS_SERVICE_URL } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import RetryCounter from '../RetryCounter';
import StatusBadge from '../StatusBadge';
import type { WsConnectionStateValues } from '../../logic/constants';

type ConnectionPanelProps = {
  url: string;
  setUrl: (url: string) => void;
  retryCount: number;
  onConnectClick: () => void;
  disconnect: () => void;
  connectionStatus: WsConnectionStateValues | 'connection_acknowledged';
  connectionError: Error | null;
  isLoggedIn: boolean;
  isConnectButtonDisabled: boolean;
  isDisconnectButtonDisabled: boolean;
};

export default function ConnectionPanel(props: ConnectionPanelProps) {
  const {
    url,
    setUrl,
    retryCount,
    onConnectClick,
    disconnect,
    connectionStatus,
    connectionError,
    isLoggedIn,
    isConnectButtonDisabled,
    isDisconnectButtonDisabled,
  } = props;

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Connection</h2>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3'>
        <div className='min-w-0 flex-1'>
          <label htmlFor='ws-server-url' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            WebSocket URL
          </label>

          <Input
            initialValue={url}
            onChange={setUrl}
            placeholder={WS_SERVICE_URL}
            disabled={isConnectButtonDisabled}
            className='block w-full dark:bg-gray-800 dark:border-gray-600'
          />
        </div>

        <div className='flex shrink-0 flex-col items-end gap-1'>
          <div className='flex gap-2'>
            <Button
              onClick={onConnectClick}
              disabled={isConnectButtonDisabled}
              className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
            >
              Connect
            </Button>

            <Button
              onClick={disconnect}
              disabled={isDisconnectButtonDisabled}
              className='bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 disabled:hover:bg-gray-600'
            >
              Disconnect
            </Button>
          </div>

          {!isLoggedIn && <span className='text-xs text-amber-600 dark:text-amber-400'>Log in first to connect</span>}
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <StatusBadge state={connectionStatus} />

          {retryCount > 0 && <RetryCounter retryCount={retryCount} maxRetries={5} />}
        </div>

        {connectionError && (
          <span className='text-sm text-red-600 dark:text-red-400' title={connectionError.message}>
            {connectionError.message}
          </span>
        )}
      </div>
    </section>
  );
}
