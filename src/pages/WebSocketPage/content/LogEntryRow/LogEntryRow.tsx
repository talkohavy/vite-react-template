import clsx from 'clsx';
import { MessageState } from '../../logic/constants';
import { formatTime } from '../../logic/utils/formatTime';
import type { MessageLogEntry } from '../../types';

type LogEntryRowProps = {
  entry: MessageLogEntry;
};

export default function LogEntryRow(props: LogEntryRowProps) {
  const { entry } = props;
  const { direction, time, data } = entry;

  const isSent = direction === MessageState.Sent;

  return (
    <div
      className={clsx(
        'rounded-lg border px-3 py-2 font-mono text-sm',
        isSent
          ? 'border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/40'
          : 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
      )}
    >
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-gray-500 dark:text-gray-400'>{formatTime(time)}</span>

        <span
          className={clsx(
            'font-semibold',
            isSent ? 'text-sky-700 dark:text-sky-400' : 'text-emerald-700 dark:text-emerald-400',
          )}
        >
          {isSent ? `→ ${MessageState.Sent}` : `← ${MessageState.Received}`}
        </span>
      </div>

      <pre className='mt-1.5 overflow-x-auto whitespace-pre-wrap wrap-break-word text-gray-700 dark:text-gray-300'>
        {data}
      </pre>
    </div>
  );
}
