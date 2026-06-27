import Button from '@src/components/controls/Button';
import { useScrollToBottomOnHeightChange } from '@src/hooks/useScrollToBottomOnHeightChange';
import LogEntryRow from '../LogEntryRow';
import type { MessageLogEntry } from '../../types';

type MessageLogPanelProps = {
  clearLog: () => void;
  log: MessageLogEntry[];
  isConnected: boolean;
};

export default function MessageLogPanel(props: MessageLogPanelProps) {
  const { clearLog, log, isConnected } = props;

  const { scrollRootRef } = useScrollToBottomOnHeightChange();

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Message log</h2>

        {log.length > 0 && (
          <Button onClick={clearLog} className='text-sm'>
            Clear log
          </Button>
        )}
      </div>

      <div
        ref={scrollRootRef}
        className='max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'
      >
        <div className='flex flex-col gap-2'>
          {log.length === 0 ? (
            <p className='py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
              {isConnected
                ? 'Messages you send and receive will appear here.'
                : 'Connect to start sending and receiving messages.'}
            </p>
          ) : (
            log.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </section>
  );
}
