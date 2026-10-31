import clsx from 'clsx';
import { formatTime } from '../../logic/utils/formatTime';
import { payloadPreview } from '../../logic/utils/payloadPreview';
import type { EventLogEntry } from '@src/lib/SocketIOClient';

type LogEntryRowProps = {
  entry: EventLogEntry;
};

export default function LogEntryRow(props: LogEntryRowProps) {
  const { entry } = props;
  const { payload, time, event } = entry;

  const isSent = entry.type === 'sent';

  const payloadStr = Array.isArray(payload)
    ? payload.map((p) => payloadPreview(p)).join(', ')
    : payloadPreview(payload);
  const formattedTime = formatTime(time);

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
        <span className='text-gray-500 dark:text-gray-400'>{formattedTime}</span>

        <span
          className={clsx(
            'font-semibold',
            isSent ? 'text-sky-700 dark:text-sky-400' : 'text-emerald-700 dark:text-emerald-400',
          )}
        >
          {isSent ? '→' : '←'} {event}
        </span>
      </div>

      {payloadStr !== '—' && (
        <pre className='mt-1.5 overflow-x-auto whitespace-pre-wrap wrap-break-word text-gray-700 dark:text-gray-300'>
          {payloadStr}
        </pre>
      )}
    </div>
  );
}
