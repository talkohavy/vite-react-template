import { SseConnectionStatus, type SseConnectionStatusValues } from '@src/lib/SseClient';

type StatusBadgeConfig = { label: string; className: string; dotClassName: string };

const IDLE_CONFIG: StatusBadgeConfig = {
  label: 'Disconnected',
  className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  dotClassName: 'bg-gray-500',
};

const PENDING_CLASSES = {
  className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
  dotClassName: 'bg-amber-500 animate-pulse',
};

export const CONFIG_BY_STATUS: Record<SseConnectionStatusValues, StatusBadgeConfig> = {
  [SseConnectionStatus.Idle]: IDLE_CONFIG,
  [SseConnectionStatus.Connecting]: { label: 'Connecting...', ...PENDING_CLASSES },
  [SseConnectionStatus.Open]: {
    label: 'Connected',
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dotClassName: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse',
  },
  [SseConnectionStatus.Reconnecting]: { label: 'Reconnecting...', ...PENDING_CLASSES },
  [SseConnectionStatus.Closed]: { ...IDLE_CONFIG, label: 'Closed' },
};
