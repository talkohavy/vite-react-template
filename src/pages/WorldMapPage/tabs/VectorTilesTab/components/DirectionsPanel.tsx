import clsx from 'clsx';
import { TRAVEL_MODE_NAMES, TRAVEL_MODES } from '../logic/directions/constants';
import { formatDistance, formatDuration } from '../logic/directions/formatRoute';
import TravelModeIcon from './TravelModeIcon';
import type { useDirections } from '../logic/directions/useDirections';

type DirectionsPanelProps = ReturnType<typeof useDirections>;

function getSummary(props: Pick<DirectionsPanelProps, 'routes' | 'selectedRouteIndex' | 'isLoading' | 'errorMessage'>) {
  const { routes, selectedRouteIndex, isLoading, errorMessage } = props;

  if (errorMessage) return errorMessage;

  if (isLoading) return 'Finding a route…';

  const selectedRoute = routes[selectedRouteIndex];

  if (!selectedRoute) return '';

  const distance = formatDistance(selectedRoute.distance);
  const duration = formatDuration(selectedRoute.duration);

  return `${distance}, ${duration}`;
}

export default function DirectionsPanel(props: DirectionsPanelProps) {
  const { travelMode, changeTravelMode, routes, selectedRouteIndex, selectRoute, errorMessage, startFromMyLocation } =
    props;

  const summary = getSummary(props);

  return (
    <div className='absolute bottom-8 left-1/2 -translate-x-1/2 w-[min(30rem,calc(100%-1.5rem))] rounded-lg bg-white text-sm text-gray-800 shadow-lg'>
      <div className='flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2.5 min-h-12'>
        <div className='flex items-center gap-2'>
          <span>Routes:</span>
          {routes.map((_, routeIndex) => (
            <button
              key={routeIndex}
              type='button'
              aria-label={`Route ${routeIndex + 1}`}
              aria-pressed={routeIndex === selectedRouteIndex}
              onClick={() => selectRoute(routeIndex)}
              className={clsx(
                'size-7 rounded-full text-xs font-semibold',
                routeIndex === selectedRouteIndex
                  ? 'bg-sky-700 text-white'
                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200',
              )}
            >
              {routeIndex + 1}
            </button>
          ))}
        </div>

        <span aria-live='polite' className={clsx('tabular-nums', errorMessage && 'text-red-700')}>
          {summary}
        </span>
      </div>

      <div className='flex' role='group' aria-label='Way of travel'>
        {TRAVEL_MODE_NAMES.map((travelModeName) => (
          <button
            key={travelModeName}
            type='button'
            aria-pressed={travelModeName === travelMode}
            onClick={() => changeTravelMode(travelModeName)}
            className={clsx(
              'flex flex-1 flex-col items-center gap-0.5 border-b-[3px] py-2 text-xs',
              travelModeName === travelMode
                ? 'border-sky-700 text-sky-800'
                : 'border-transparent text-gray-600 hover:text-sky-800',
            )}
          >
            <TravelModeIcon travelMode={travelModeName} className='size-6' />
            {TRAVEL_MODES[travelModeName].label}
          </button>
        ))}

        <button
          type='button'
          onClick={startFromMyLocation}
          className='flex flex-1 flex-col items-center gap-0.5 border-b-[3px] border-transparent py-2 text-xs text-gray-600 hover:text-sky-800'
        >
          <TravelModeIcon travelMode='locate' className='size-6' />
          From me
        </button>
      </div>
    </div>
  );
}
