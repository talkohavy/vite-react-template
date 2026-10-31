import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import Panel from '../Panel';

type TopicsPanelProps = {
  isLoggedIn: boolean;
  topics: Array<string>;
  isPending: boolean;
  error: string | null;
  refreshTopics: () => void;
  joinTopic: (topic: string) => void;
  leaveTopic: (topic: string) => void;
};

export default function TopicsPanel(props: TopicsPanelProps) {
  const { isLoggedIn, topics, isPending, error, refreshTopics, joinTopic, leaveTopic } = props;

  const [topicToJoin, setTopicToJoin] = useState('chat:1');

  const isDisabled = !isLoggedIn || isPending;
  const trimmedTopic = topicToJoin.trim();

  function onJoinClick() {
    joinTopic(trimmedTopic);
  }

  return (
    <Panel
      title='My topics'
      description="A topic is a room. Membership belongs to the user, not the tab, so it's shared by all of the user's streams, and kept across reconnects."
      actions={
        <Button onClick={refreshTopics} disabled={isDisabled} className='text-sm'>
          Refresh
        </Button>
      }
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='min-w-0 flex-1'>
          <label
            htmlFor='sse-topic-to-join'
            className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Topic
          </label>

          <Input
            id='sse-topic-to-join'
            initialValue={topicToJoin}
            onChange={setTopicToJoin}
            placeholder='e.g. chat:1'
            disabled={isDisabled}
          />
        </div>

        <Button
          onClick={onJoinClick}
          disabled={isDisabled || !trimmedTopic}
          className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
        >
          Join
        </Button>
      </div>

      {topics.length === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>Not in any topic yet.</p>
      ) : (
        <ul className='flex flex-wrap gap-2'>
          {topics.map((topic) => (
            <li
              key={topic}
              className='inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 py-1 pl-3 pr-1 font-mono text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
            >
              #{topic}
              <Button
                onClick={() => leaveTopic(topic)}
                disabled={isDisabled}
                className='rounded-full px-2 py-0.5 text-xs disabled:opacity-50'
              >
                Leave
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </Panel>
  );
}
