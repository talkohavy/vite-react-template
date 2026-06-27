import clsx from 'clsx';
import Button from '@src/components/controls/Button';
import Textarea from '@src/components/controls/Textarea';
import styles from './SendMessagePanel.module.scss';

type SendMessagePanelProps = {
  messageToSend: string;
  setMessageToSend: (value: string) => void;
  send: () => void;
  isSendButtonDisabled: boolean;
};

export default function SendMessagePanel(props: SendMessagePanelProps) {
  const { messageToSend, setMessageToSend, send, isSendButtonDisabled } = props;

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        Send "message" event
      </h2>

      <p className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
        (the only supported event in websocket protocol for incoming data is "message")
      </p>

      <div className='flex flex-col gap-3'>
        <Textarea
          value={messageToSend}
          setValue={(e) => setMessageToSend(e.target.value)}
          placeholder='Type a message in JSON format'
          rows={7}
          resize='vertical'
          className={clsx(
            styles.sendMessageTextarea,
            'block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800',
          )}
        />

        <Button onClick={send} disabled={isSendButtonDisabled} className='w-full sm:w-auto'>
          Send
        </Button>
      </div>
    </section>
  );
}
