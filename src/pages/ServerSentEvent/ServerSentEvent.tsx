import LoginPanel from '../WebSocketPage/content/LoginPanel';
import ConnectionPanel from './content/ConnectionPanel';
import EventLogPanel from './content/EventLogPanel';
import SendToTopicPanel from './content/SendToTopicPanel';
import SendToUserPanel from './content/SendToUserPanel';
import TopicsPanel from './content/TopicsPanel';
import { useCurrentUser } from './logic/hooks/useCurrentUser';
import { useEventLog } from './logic/hooks/useEventLog';
import { useSendMessages } from './logic/hooks/useSendMessages';
import { useTopics } from './logic/hooks/useTopics';

export default function ServerSentEvent() {
  const { user, email, setEmail, password, setPassword, isPending, error, login, logout } = useCurrentUser();

  const { log, socketId, addLogEntry, clearLog } = useEventLog();

  const userId = user?.id ?? null;
  const isLoggedIn = userId !== null;

  const topics = useTopics({ userId, addLogEntry });

  const { sendToTopic, isSendingToTopic, sendToTopicError, sendToUser, isSendingToUser, sendToUserError } =
    useSendMessages({ addLogEntry });

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='mx-auto flex max-w-3xl flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Server-Sent Events</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            One stream per tab, through{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>ServerSentEventsProvider</span> +{' '}
            <span className='font-medium text-gray-700 dark:text-gray-300'>useServerSentEvents()</span>. The server
            delivers events to a user (all of their streams) or to a topic (all of its members' streams).
          </p>
        </header>

        <LoginPanel
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoggedIn={isLoggedIn}
          loggedInAs={`${user?.email} (user id ${userId})`}
          isLoginLoading={isPending}
          loginError={error}
          onLoginSubmit={login}
          onLogoutClick={logout}
        />

        <ConnectionPanel isLoggedIn={isLoggedIn} socketId={socketId} />

        <TopicsPanel
          isLoggedIn={isLoggedIn}
          topics={topics.topics}
          isPending={topics.isPending}
          error={topics.error}
          refreshTopics={topics.refreshTopics}
          joinTopic={topics.joinTopic}
          leaveTopic={topics.leaveTopic}
        />

        <SendToTopicPanel
          isLoggedIn={isLoggedIn}
          isSending={isSendingToTopic}
          error={sendToTopicError}
          sendToTopic={sendToTopic}
        />

        <SendToUserPanel
          key={userId}
          myUserId={userId}
          isSending={isSendingToUser}
          error={sendToUserError}
          sendToUser={sendToUser}
        />

        <EventLogPanel log={log} clearLog={clearLog} />
      </div>
    </div>
  );
}
