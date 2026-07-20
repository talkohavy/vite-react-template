import type { LayoutLabel } from '../../logic/layout';

export type BranchLabelProps = {
  label: LayoutLabel;
};

const CHAR_WIDTH = 9;
const HORIZONTAL_PADDING = 14;
const PILL_HEIGHT = 34;

/**
 * A rounded pill sitting next to a branch tip. The currently checked-out branch
 * (HEAD) is prefixed with `*`.
 */
export default function BranchLabel(props: BranchLabelProps) {
  const { label } = props;

  const text = label.isHead ? `* ${label.name}` : label.name;
  const pillWidth = text.length * CHAR_WIDTH + HORIZONTAL_PADDING * 2;

  return (
    <g transform={`translate(${label.x}, ${label.y})`}>
      <rect
        x={0}
        y={-PILL_HEIGHT / 2}
        width={pillWidth}
        height={PILL_HEIGHT}
        rx={PILL_HEIGHT / 2}
        fill={label.color}
        className={label.isHead ? 'stroke-gray-900 dark:stroke-white' : ''}
        strokeWidth={label.isHead ? 2 : 0}
      />
      <text
        x={HORIZONTAL_PADDING}
        y={0}
        dominantBaseline='central'
        fontSize={15}
        className='font-mono font-bold fill-white select-none'
      >
        {text}
      </text>
    </g>
  );
}
