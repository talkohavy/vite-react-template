import clsx from 'clsx';
import type { ChildItemProps } from '../../types';

const base = 'relative flex justify-center items-center h-8 w-32 rounded-t-md';
const lightModeNormal = 'text-gray-700 bg-gray-200';
const lightModeFocused =
  'group-has-[input:focus:not(:checked)]/radioWrapper:border group-has-[input:focus:not(:checked)]/radioWrapper:border-blue-400';
const lightModeChecked =
  'group-has-[input:checked]/radioWrapper:text-white group-has-[input:checked]/radioWrapper:bg-gray-500';
const lightModeHovered =
  'group-has-[input:hover:not(:disabled):not(:checked)]/radioWrapper:bg-gray-400 group-has-[input:hover:not(:disabled):not(:checked)]/radioWrapper:text-white';
const lightModeDisabled =
  'group-has-[input:disabled]/radioWrapper:bg-gray-400 group-has-[input:disabled]/radioWrapper:opacity-40';
const darkModeNormal = 'dark:text-gray-100 dark:bg-gray-500 dark:group-has-[input:checked]/radioWrapper:bg-blue-800';

export default function SingleRadioTab(props: ChildItemProps) {
  const { label } = props;

  return (
    <div
      className={clsx(
        base,
        lightModeNormal,
        darkModeNormal,
        lightModeHovered,
        lightModeFocused,
        lightModeChecked,
        lightModeDisabled,
      )}
    >
      <p className='truncate'>{label}</p>
    </div>
  );
}
