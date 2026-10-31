import clsx from 'clsx';
import { POSITION_CLASSES, type PositionValues } from '../../logic/constants';

type NotSupportedProps = {
  position: PositionValues;
};

export default function NotSupported(props: NotSupportedProps) {
  const { position } = props;

  return (
    <div
      className={clsx(
        'fixed z-9999 rounded-lg border border-white/10 bg-black/80 px-3 py-2 font-mono text-xs text-gray-400 shadow-lg backdrop-blur-sm',
        POSITION_CLASSES[position],
      )}
    >
      <span className='font-semibold text-white'>MEM</span> — not supported in this browser
    </div>
  );
}
