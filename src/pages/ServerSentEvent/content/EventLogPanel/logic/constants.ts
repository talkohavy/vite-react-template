import { EventLogEntryKinds, type EventLogEntryKindValues } from '../../../logic/constants';

type EntryStyle = { label: string; className: string; labelClassName: string };

export const STYLE_BY_KIND: Record<EventLogEntryKindValues, EntryStyle> = {
  [EventLogEntryKinds.Status]: {
    label: 'status',
    className: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/60',
    labelClassName: 'text-gray-600 dark:text-gray-300',
  },
  [EventLogEntryKinds.Connected]: {
    label: '← connected',
    className: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
    labelClassName: 'text-emerald-700 dark:text-emerald-400',
  },
  [EventLogEntryKinds.TopicMessage]: {
    label: '← topic-message',
    className: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40',
    labelClassName: 'text-blue-700 dark:text-blue-400',
  },
  [EventLogEntryKinds.UserMessage]: {
    label: '← user-message',
    className: 'border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950/40',
    labelClassName: 'text-violet-700 dark:text-violet-400',
  },
  [EventLogEntryKinds.Sent]: {
    label: '→ request',
    className: 'border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/40',
    labelClassName: 'text-sky-700 dark:text-sky-400',
  },
};
