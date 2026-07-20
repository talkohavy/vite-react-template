import { useMemo } from 'react';
import { computeLayout } from '../../logic/layout';
import Arch from '../Arch';
import BranchLabel from '../BranchLabel';
import CommitNode from '../CommitNode';
import type { GitModel } from '../../logic/types';

export type GitGraphProps = {
  model: GitModel;
  onCommitClick?: (hash: string) => void;
};

/**
 * The assembler (part 3): turns a `GitModel` into a full vertical tree.
 *
 * The SVG is sized to the whole graph and rendered in layers - arches behind,
 * then commit nodes, then branch labels on top. Oldest commit is at the bottom,
 * newest at the top.
 */
export default function GitGraph(props: GitGraphProps) {
  const { model, onCommitClick } = props;

  const layout = useMemo(() => computeLayout({ model }), [model]);

  return (
    <svg
      width={layout.width}
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className='block'
      role='img'
      aria-label='Git commit graph'
    >
      <g>
        {layout.edges.map((edge) => (
          <Arch key={edge.id} edge={edge} />
        ))}
      </g>
      <g>
        {layout.nodes.map((node) => (
          <CommitNode key={node.hash} node={node} onClick={onCommitClick} />
        ))}
      </g>
      <g>
        {layout.labels.map((label) => (
          <BranchLabel key={label.name} label={label} />
        ))}
      </g>
    </svg>
  );
}
