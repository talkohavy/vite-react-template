import { useEffect } from 'react';
import { isPushNotificationsFeatureEnabled } from '@src/common/utils/isPushNotificationsFeatureEnabled';

export default function PushNotificationsPage() {
  useEffect(() => {
    async function requestNotificationPermission() {
      if (isPushNotificationsFeatureEnabled()) {
        console.log('props is:');

        const permissionStatus = await Notification.requestPermission();
        console.log('Notification permission status:', permissionStatus);

        // permission === 'default'
        if (permissionStatus === 'denied') {
          console.log('You suck!');
          return;
        }

        if (permissionStatus === 'granted') {
          new Notification('Push Notifications Enabled', {
            body: 'You have successfully enabled push notifications.',
          });
        }
      }
    }

    requestNotificationPermission();
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <h1>Hello World</h1>
    </div>
  );
}
