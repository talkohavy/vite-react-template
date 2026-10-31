import { useEffect, useState } from 'react';
import { SSEEventNames } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import { useServerSentEvents } from '@src/providers/ServerSentEventsProvider';
import { getTime } from './logic/getTime';

type TimeEventData = { time: string };

export default function ServerSentEvent() {
  const [value, setValue] = useState<string | null>(null);

  const { connectionStatus, isConnected, isConnecting, isReconnecting, connect, disconnect, subscribe } =
    useServerSentEvents();

  useEffect(() => {
    function onTime(data: TimeEventData) {
      setValue(data.time);
    }

    const unsubscribe = subscribe<TimeEventData>({ eventName: SSEEventNames.Message, listener: onTime });

    return unsubscribe;
  }, [subscribe]);

  const isConnectionActive = isConnected || isConnecting || isReconnecting;

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <div className='flex items-center gap-2'>
        <Button
          onClick={connect}
          disabled={isConnectionActive}
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

        <span className='text-sm text-gray-600 dark:text-gray-400'>Status: {connectionStatus}</span>
      </div>

      <div className='text-3xl font-bold'>{value && getTime(value)}</div>
    </div>
  );
}
