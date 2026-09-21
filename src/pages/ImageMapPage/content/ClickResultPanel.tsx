import clsx from 'clsx';
import { formatCoords } from '../logic/utils/formatCoords';
import type { ImageMapArea } from '../logic/constants';

/**
 * Mirrors the tutorial's "Image Map and JavaScript" section: instead of
 * `onclick="alert(...)"` we render the same information in the page, since a
 * real `href` on the `<area>` would navigate the whole SPA away.
 */
export default function ClickResultPanel(props: { area: ImageMapArea | null }) {
  const { area } = props;

  if (!area) {
    return (
      <p className='text-sm text-gray-500 dark:text-gray-400'>
        Click - or focus with Tab and press Enter on - the computer, the coffee cup, or the croissant.
      </p>
    );
  }

  return (
    <div className='flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700'>
      <span className={clsx('mt-1 size-3 shrink-0 rounded-full', area.accentClassName)} />
      <div>
        <p className='font-semibold text-gray-800 dark:text-gray-100'>
          You clicked: {area.label}{' '}
          <span className='text-gray-400 dark:text-gray-500'>(shape=&quot;{area.shape}&quot;)</span>
        </p>
        <p className='text-gray-600 dark:text-gray-400'>{area.description}</p>
        <p className='mt-1 font-mono text-xs text-gray-500 dark:text-gray-500'>
          coords=&quot;{formatCoords({ coords: area.coords })}&quot;
        </p>
      </div>
    </div>
  );
}
