import type { LayoutEdge } from '../../logic/layout';

export type ArchProps = {
  edge: LayoutEdge;
};

/**
 * A single curved connection (an "arch") between a parent commit and its child,
 * drawn as a cubic Bezier path.
 */
export default function Arch(props: ArchProps) {
  const { edge } = props;

  return (
    <path
      d={edge.path}
      fill='none'
      stroke={edge.color}
      strokeWidth={4}
      strokeLinecap='round'
      className='opacity-80'
    />
  );
}
