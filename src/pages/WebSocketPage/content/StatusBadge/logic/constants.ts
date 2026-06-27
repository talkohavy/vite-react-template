import { WsConnectionState, type WsConnectionStateValues } from '../../../logic/constants';

export const CONFIG_BY_CONNECTION_STATE: Record<
  WsConnectionStateValues | 'connection_acknowledged',
  { label: string; className: string; dotClassName: string }
> = {
  [WsConnectionState.Idle]: {
    label: 'Disconnected',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotClassName: 'bg-gray-500',
  },
  [WsConnectionState.Connecting]: {
    label: 'Connecting...',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [WsConnectionState.Open]: {
    label: 'Connected',
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dotClassName: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse',
  },
  connection_acknowledged: {
    label: 'Connection Acknowledged',
    className: 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
    dotClassName: 'bg-green-600 dark:bg-green-400 animate-pulse',
  },

  [WsConnectionState.Reconnecting]: {
    label: 'Reconnecting...',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [WsConnectionState.Closing]: {
    label: 'Closing...',
    className: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  [WsConnectionState.Closed]: {
    label: 'Disconnected',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    dotClassName: 'bg-gray-500',
  },
};
