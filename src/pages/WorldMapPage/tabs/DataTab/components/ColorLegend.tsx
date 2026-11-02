import clsx from 'clsx';
import { COLOR_RAMP } from '../logic/constants';
import { formatCompactNumber } from '../logic/formatMetricValue';
import type { ColorLegend as ColorLegendData } from '../logic/buildColorScale';

const GRADIENT = `linear-gradient(to right, ${COLOR_RAMP.join(', ')})`;
const NO_DATA_HATCH = 'repeating-linear-gradient(45deg, #9ca3af 0 2px, transparent 2px 5px)';

type ColorLegendProps = {
  legend: ColorLegendData;
};

export default function ColorLegend(props: ColorLegendProps) {
  const { legend } = props;

  return (
    <div className='flex flex-wrap items-start gap-6 text-xs tabular-nums'>
      {legend.kind === 'continuous' ? (
        <div className='flex flex-col gap-1 w-full max-w-96 px-3'>
          <div className='h-3' style={{ backgroundImage: GRADIENT }} />
          <div className='relative h-4'>
            {legend.ticks.map(({ value, offset }, index) => (
              <span
                key={value}
                className={clsx('absolute -translate-x-1/2', index % 2 === 1 && 'hidden sm:inline')}
                style={{ left: `${offset * 100}%` }}
              >
                {formatCompactNumber({ value })}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex w-full max-w-96'>
          {legend.classes.map(({ color, lowerBound }) => (
            <div key={color} className='flex flex-col gap-1 flex-1'>
              <div className='h-3' style={{ backgroundColor: color }} />
              <span>{formatCompactNumber({ value: lowerBound })}</span>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-center gap-2'>
        <div className='w-6 h-3 border border-gray-400' style={{ backgroundImage: NO_DATA_HATCH }} />
        No data
      </div>
    </div>
  );
}
