import clsx from 'clsx';
import Button from '@src/components/controls/Button';
import { useScrollToBottomOnHeightChange } from '@src/hooks/useScrollToBottomOnHeightChange';
import { formatTime } from '../../logic/utils/formatTime';
import Panel from '../Panel';
import { STYLE_BY_KIND } from './logic/constants';
import type { EventLogEntry } from '../../types';

type EventLogPanelProps = {
  log: Array<EventLogEntry>;
  clearLog: () => void;
};

export default function EventLogPanel(props: EventLogPanelProps) {
  const { log, clearLog } = props;

  const { scrollRootRef } = useScrollToBottomOnHeightChange();

  return (
    <Panel
      title='Event log'
      description="What this tab's stream received (←), and the requests it made (→)."
      actions={
        log.length > 0 && (
          <Button onClick={clearLog} className='text-sm'>
            Clear log
          </Button>
        )
      }
    >
      <div
        ref={scrollRootRef}
        className='max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'
      >
        <div className='flex flex-col gap-2'>
          {log.length === 0 ? (
            <p className='py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
              Connect to start receiving events.
            </p>
          ) : (
            log.map((entry) => {
              const { id, kind, time, title, text } = entry;
              const { label, className, labelClassName } = STYLE_BY_KIND[kind];

              return (
                <div key={id} className={clsx('rounded-lg border px-3 py-2 font-mono text-sm', className)}>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-gray-500 dark:text-gray-400'>{formatTime(time)}</span>
                    <span className={clsx('font-semibold', labelClassName)}>{label}</span>
                    <span className='text-gray-700 dark:text-gray-300'>{title}</span>
                  </div>

                  {text && (
                    <p className='mt-1 whitespace-pre-wrap wrap-break-word text-gray-700 dark:text-gray-300'>{text}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Panel>
  );
}
