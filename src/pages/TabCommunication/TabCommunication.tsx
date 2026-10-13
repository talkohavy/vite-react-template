import { useEffect, useState } from 'react';
import { MessageType } from './constants';
import type { Message } from './types';

function sendDisconnectedMessageWrapper(bc: BroadcastChannel) {
  return () => {
    const message = {
      type: MessageType.Close,
      data: 'tab disconnected...',
    };
    bc.postMessage(message);
  };
}

export default function TabCommunication() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function handleMessage(event: MessageEvent<Message>) {
      const { data } = event;
      console.log(data);

      if (data.type === MessageType.Open) {
        setCount((prevCount) => prevCount + 1);
      }
      if (data.type === MessageType.Close) {
        setCount((prevCount) => Math.max(prevCount - 1, 0));
      }
    }

    const bc = new BroadcastChannel('luckylove');

    const sendDisconnectedMessage = sendDisconnectedMessageWrapper(bc);

    const message = {
      type: MessageType.Open,
      data: 'New listening disconnected!',
    };

    bc.postMessage(message);

    bc.addEventListener('message', handleMessage);

    window.addEventListener('beforeunload', sendDisconnectedMessage);

    return () => {
      sendDisconnectedMessage();
      bc.removeEventListener('message', handleMessage);
      window.removeEventListener('beforeunload', sendDisconnectedMessage);
      bc.close();
    };
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Listening to messages from other tabs</div>

      <div>Open tabs: {count}</div>
    </div>
  );
}
