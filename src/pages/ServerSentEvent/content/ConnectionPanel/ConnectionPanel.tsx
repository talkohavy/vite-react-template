import clsx from 'clsx';
import Button from '@src/components/controls/Button';
import { useServerSentEvents } from '@src/providers/ServerSentEventsProvider';
import Panel from '../Panel';
import { CONFIG_BY_STATUS } from './logic/constants';

type ConnectionPanelProps = {
  isLoggedIn: boolean;
  socketId: string | null;
};

export default function ConnectionPanel(props: ConnectionPanelProps) {
  const { isLoggedIn, socketId } = props;

  const { connectionStatus, isConnected, isConnecting, isReconnecting, connect, disconnect } = useServerSentEvents();

  const isConnectionActive = isConnected || isConnecting || isReconnecting;
  const { label, className, dotClassName } = CONFIG_BY_STATUS[connectionStatus];

  return (
    <Panel
      title='Connection'
      description="This tab's own stream. Open the page in a second tab to get a second stream of the same user."
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <span
          className={clsx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium', className)}
        >
          <span className={clsx('size-2 rounded-full', dotClassName)} />
          {label}
        </span>

        <div className='flex flex-col items-end gap-1'>
          <div className='flex gap-2'>
            <Button
              onClick={connect}
              disabled={!isLoggedIn || isConnectionActive}
              className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
            >
              Connect
            </Button>

            <Button
              onClick={disconnect}
              disabled={!isConnectionActive}
              className='bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 disabled:hover:bg-gray-600'
            >
              Disconnect
            </Button>
          </div>

          {!isLoggedIn && <span className='text-xs text-amber-600 dark:text-amber-400'>Log in first to connect</span>}
        </div>
      </div>

      <p className='font-mono text-sm text-gray-600 dark:text-gray-400'>socketId: {socketId ?? '-'}</p>
    </Panel>
  );
}
