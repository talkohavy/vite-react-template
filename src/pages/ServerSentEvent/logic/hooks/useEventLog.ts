import { useEffect, useEffectEvent, useState } from 'react';
import { SSEEventNames } from '@src/common/constants';
import { uuid } from '@src/common/utils/uuid';
import { SseConnectionStatus } from '@src/lib/SseClient';
import { useServerSentEvents } from '@src/providers/ServerSentEventsProvider';
import { EventLogEntryKinds, MAX_LOG_ENTRIES, STATUS_DESCRIPTIONS } from '../constants';
import type {
  AddLogEntryProps,
  ConnectedEventData,
  EventLogEntry,
  TopicMessageEventData,
  UserMessageEventData,
} from '../../types';
import type { SseConnectionStatusValues } from '@src/lib/SseClient';

/**
 * Logs every status change and every event this tab's stream receives.
 */
export function useEventLog() {
  const { subscribe, subscribeToStatus } = useServerSentEvents();

  const [log, setLog] = useState<Array<EventLogEntry>>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  function addLogEntry(props: AddLogEntryProps) {
    const entry: EventLogEntry = { ...props, id: uuid(), time: new Date() };

    setLog((prevLog) => [...prevLog, entry].slice(-MAX_LOG_ENTRIES));
  }

  function clearLog() {
    setLog([]);
  }

  const onStatusChange = useEffectEvent((status: SseConnectionStatusValues) => {
    if (status !== SseConnectionStatus.Open) setSocketId(null);

    addLogEntry({ kind: EventLogEntryKinds.Status, title: `Status: ${status}`, text: STATUS_DESCRIPTIONS[status] });
  });

  const onConnected = useEffectEvent((data: ConnectedEventData) => {
    setSocketId(data.socketId);

    addLogEntry({ kind: EventLogEntryKinds.Connected, title: 'connected', text: `socketId: ${data.socketId}` });
  });

  const onTopicMessage = useEffectEvent((data: TopicMessageEventData) => {
    const { topic, text, fromUserId, sentAt } = data;

    const latencyMs = Date.now() - sentAt;

    addLogEntry({
      kind: EventLogEntryKinds.TopicMessage,
      title: `#${topic} · from user ${fromUserId} · ${latencyMs}ms after sending`,
      text,
    });
  });

  const onUserMessage = useEffectEvent((data: UserMessageEventData) => {
    const { text, fromUserId, sentAt } = data;

    const latencyMs = Date.now() - sentAt;

    addLogEntry({
      kind: EventLogEntryKinds.UserMessage,
      title: `to me · from user ${fromUserId} · ${latencyMs}ms after sending`,
      text,
    });
  });

  useEffect(() => {
    const unsubscribe = subscribeToStatus((status) => onStatusChange(status));

    return unsubscribe;
  }, [subscribeToStatus]);

  useEffect(() => {
    const unsubscribers = [
      subscribe<ConnectedEventData>({ eventName: SSEEventNames.Connected, listener: (data) => onConnected(data) }),
      subscribe<TopicMessageEventData>({
        eventName: SSEEventNames.TopicMessage,
        listener: (data) => onTopicMessage(data),
      }),
      subscribe<UserMessageEventData>({
        eventName: SSEEventNames.UserMessage,
        listener: (data) => onUserMessage(data),
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscribe]);

  return { log, socketId, addLogEntry, clearLog };
}
