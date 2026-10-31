import type { EventLogEntryKindValues } from './logic/constants';

export type DemoUser = {
  id: string;
  email: string;
};

export type EventLogEntry = {
  id: string;
  kind: EventLogEntryKindValues;
  time: Date;
  title: string;
  text?: string;
};

export type AddLogEntryProps = Omit<EventLogEntry, 'id' | 'time'>;

export type AddLogEntry = (props: AddLogEntryProps) => void;

export type ConnectedEventData = {
  socketId: string;
};

export type TopicMessageEventData = {
  topic: string;
  text: string;
  fromUserId: string;
  /**
   * ms since the epoch.
   */
  sentAt: number;
};

export type UserMessageEventData = {
  text: string;
  fromUserId: string;
  /**
   * ms since the epoch.
   */
  sentAt: number;
};
