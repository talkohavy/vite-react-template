import { useEffect, useState } from 'react';
import { EventLogEntryKinds } from '../constants';
import { requestJoinTopic, requestLeaveTopic, requestMyTopics } from '../utils/sseDemoApi';
import { useRequestState } from './useRequestState';
import type { AddLogEntry } from '../../types';

type UseTopicsProps = {
  userId: string | null;
  addLogEntry: AddLogEntry;
};

export function useTopics(props: UseTopicsProps) {
  const { userId, addLogEntry } = props;

  const [topics, setTopics] = useState<Array<string>>([]);

  const { isPending, error, run } = useRequestState();

  useEffect(() => {
    if (!userId) return;

    let isCancelled = false;

    async function loadTopics() {
      try {
        const myTopics = await requestMyTopics();

        if (!isCancelled) setTopics(myTopics);
      } catch {
        // The Refresh button shows the error, if it persists.
      }
    }

    loadTopics();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  async function reloadTopics() {
    const myTopics = await requestMyTopics();

    setTopics(myTopics);
  }

  async function refreshTopics() {
    await run(reloadTopics);
  }

  async function joinTopic(topic: string) {
    await run(async () => {
      await requestJoinTopic(topic);

      addLogEntry({
        kind: EventLogEntryKinds.Sent,
        title: `Joined #${topic}`,
        text: "The user's open streams, in every tab, now receive this topic. No reconnect needed.",
      });

      await reloadTopics();
    });
  }

  async function leaveTopic(topic: string) {
    await run(async () => {
      await requestLeaveTopic(topic);

      addLogEntry({
        kind: EventLogEntryKinds.Sent,
        title: `Left #${topic}`,
        text: "The user's open streams, in every tab, stop receiving this topic.",
      });

      await reloadTopics();
    });
  }

  const visibleTopics = userId ? topics : [];

  return { topics: visibleTopics, isPending, error, refreshTopics, joinTopic, leaveTopic };
}
