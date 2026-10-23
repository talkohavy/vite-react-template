import { useEffect, useState } from 'react';
import { API_GATEWAY_URL, API_URLS, SSEEventNames } from '@src/common/constants';
import { getTime } from './logic/getTime';

export default function ServerSentEvent() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${API_GATEWAY_URL}${API_URLS.sse}`, { withCredentials: true });

    eventSource.addEventListener(SSEEventNames.Message, (event) => {
      console.log('event is:', event);

      const eventData = JSON.parse(event.data);

      setValue(eventData.time);
    });

    eventSource.addEventListener(SSEEventNames.Connected, (event) => {
      console.log('event is:', event);
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className='w-full p-4'>
      <div>hello world</div>
      <div className='text-3xl font-bold'>{value && getTime(value)}</div>
    </div>
  );
}
