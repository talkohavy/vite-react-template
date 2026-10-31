import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import Panel from '../Panel';

type SendToTopicPanelProps = {
  isLoggedIn: boolean;
  isSending: boolean;
  error: string | null;
  sendToTopic: (props: { topic: string; text: string }) => void;
};

export default function SendToTopicPanel(props: SendToTopicPanelProps) {
  const { isLoggedIn, isSending, error, sendToTopic } = props;

  const [topic, setTopic] = useState('chat:1');
  const [text, setText] = useState('Hello, topic!');

  const isDisabled = !isLoggedIn || isSending;
  const trimmedTopic = topic.trim();
  const trimmedText = text.trim();
  const canSend = !isDisabled && trimmedTopic !== '' && trimmedText !== '';

  function onSendClick() {
    sendToTopic({ topic: trimmedTopic, text: trimmedText });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSend) onSendClick();
  }

  return (
    <Panel
      title='Send to a topic'
      description="Reaches every open stream in the topic, of any user. Only members may send: try a topic you're not in."
    >
      <div onKeyDown={handleKeyDown} className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='sm:w-40'>
          <label htmlFor='sse-send-topic' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Topic
          </label>

          <Input id='sse-send-topic' initialValue={topic} onChange={setTopic} disabled={isDisabled} />
        </div>

        <div className='min-w-0 flex-1'>
          <label
            htmlFor='sse-send-topic-text'
            className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Message
          </label>

          <Input id='sse-send-topic-text' initialValue={text} onChange={setText} disabled={isDisabled} />
        </div>

        <Button onClick={onSendClick} disabled={!canSend} className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'>
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>

      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </Panel>
  );
}
