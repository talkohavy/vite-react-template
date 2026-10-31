import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import Panel from '../Panel';

type SendToUserPanelProps = {
  /**
   * The initial target. Remount the panel (with a `key`) to reset it when the user changes.
   */
  myUserId: string | null;
  isSending: boolean;
  error: string | null;
  sendToUser: (props: { userId: string; text: string }) => void;
};

export default function SendToUserPanel(props: SendToUserPanelProps) {
  const { myUserId, isSending, error, sendToUser } = props;

  const [userId, setUserId] = useState(myUserId ?? '');
  const [text, setText] = useState('Hello, user!');

  const isDisabled = !myUserId || isSending;
  const trimmedUserId = userId.trim();
  const trimmedText = text.trim();
  const canSend = !isDisabled && trimmedUserId !== '' && trimmedText !== '';

  function onSendClick() {
    sendToUser({ userId: trimmedUserId, text: trimmedText });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSend) onSendClick();
  }

  return (
    <Panel
      title='Send to a user'
      description={
        <>
          Reaches every open stream of the user: every tab, every device. Your own user id is{' '}
          <span className='font-mono font-semibold text-gray-700 dark:text-gray-300'>{myUserId ?? '-'}</span>; log in as
          someone else in another browser to message them.
        </>
      }
    >
      <div onKeyDown={handleKeyDown} className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='sm:w-40'>
          <label htmlFor='sse-send-user-id' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            User id
          </label>

          <Input id='sse-send-user-id' initialValue={userId} onChange={setUserId} disabled={isDisabled} />
        </div>

        <div className='min-w-0 flex-1'>
          <label
            htmlFor='sse-send-user-text'
            className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Message
          </label>

          <Input id='sse-send-user-text' initialValue={text} onChange={setText} disabled={isDisabled} />
        </div>

        <Button onClick={onSendClick} disabled={!canSend} className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'>
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>

      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </Panel>
  );
}
