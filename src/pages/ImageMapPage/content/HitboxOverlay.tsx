import clsx from 'clsx';
import { formatCoords } from '../logic/utils/formatCoords';
import type { ImageMapArea } from '../logic/constants';

/**
 * Draws a dashed outline for every `<area>` on top of the image, so the
 * relationship between `shape` + `coords` and the actual clickable region is
 * visible instead of invisible (which is how image maps normally behave).
 */
export default function HitboxOverlay(props: {
  activeAreaId: string | null;
  areas: Array<ImageMapArea>;
  height: number;
  width: number;
}) {
  const { activeAreaId, areas, height, width } = props;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className='pointer-events-none absolute inset-0 size-full'
      aria-hidden='true'
    >
      {areas.map((area) => {
        const isActive = area.id === activeAreaId;
        const outlineClassName = clsx(
          'stroke-2 [stroke-dasharray:6_4] transition-colors',
          isActive ? 'fill-white/40 stroke-white' : 'fill-white/0 stroke-white/70',
        );

        if (area.shape === 'rect') {
          const [x1, y1, x2, y2] = area.coords;
          return <rect key={area.id} x={x1} y={y1} width={x2 - x1} height={y2 - y1} className={outlineClassName} />;
        }

        if (area.shape === 'circle') {
          const [cx, cy, r] = area.coords;
          return <circle key={area.id} cx={cx} cy={cy} r={r} className={outlineClassName} />;
        }

        return <polygon key={area.id} points={formatCoords({ coords: area.coords })} className={outlineClassName} />;
      })}
    </svg>
  );
}
