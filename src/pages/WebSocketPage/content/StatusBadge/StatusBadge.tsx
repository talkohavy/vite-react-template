import clsx from 'clsx';
import { CONFIG_BY_CONNECTION_STATE } from './logic/constants';
import type { WsConnectionStateValues } from '../../logic/constants';

type StatusBadgeProps = {
  state: WsConnectionStateValues | 'connection_acknowledged';
};

export default function StatusBadge(props: StatusBadgeProps) {
  const { state } = props;
  const { label, className, dotClassName } = CONFIG_BY_CONNECTION_STATE[state];

  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium', className)}>
      <span className={clsx('size-2 rounded-full', dotClassName)} />
      {label}
    </span>
  );
}
