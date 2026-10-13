import { useEffect } from 'react';
import { SocketIOTopics } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';

type StreamEventsPanelProps = {
  topic: string;
  setTopic: (topic: string) => void;
  isConnected: boolean;
  startStreamingTo: (topic: string) => void;
  stopStreaming: () => void;
  isStreaming: boolean;
};

export default function StreamEventsPanel(props: StreamEventsPanelProps) {
  const { topic, setTopic, isConnected, startStreamingTo, stopStreaming, isStreaming } = props;

  const isStartStreamingDisabled = !(isConnected && topic.trim() && !isStreaming);

  const handleStartStreaming = () => {
    startStreamingTo(topic);
  };

  useEffect(() => {
    return () => {
      if (isStreaming) stopStreaming();
    };
  }, [isStreaming, stopStreaming]);

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        Case 2: Stream events
      </h2>

      <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
        <div>
          <label
            htmlFor='socket-event-name'
            className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Topic name
          </label>

          <Input
            initialValue={topic}
            onChange={setTopic}
            placeholder={`e.g. ${SocketIOTopics.EventStream}`}
            disabled={!isConnected}
            className='block w-full dark:bg-gray-800 dark:border-gray-600'
          />
        </div>

        <div className='flex items-end gap-2'>
          <Button onClick={handleStartStreaming} disabled={isStartStreamingDisabled} className='w-full sm:w-auto'>
            Start streaming
          </Button>

          <Button onClick={stopStreaming} disabled={!isStreaming} className='w-full sm:w-auto'>
            Stop streaming
          </Button>
        </div>
      </div>
    </section>
  );
}
