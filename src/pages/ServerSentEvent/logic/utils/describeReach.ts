type DescribeReachProps = {
  receivingNodesCount: number;
  /**
   * Why no node received it, e.g. "the user has no open stream".
   */
  nobodyListening: string;
};

/**
 * Delivery is live-only: an event that reached no server node is gone, it isn't stored for later.
 */
export function describeReach(props: DescribeReachProps): string {
  const { receivingNodesCount, nobodyListening } = props;

  if (receivingNodesCount === 0) return `reached no server node (${nobodyListening})`;

  const nodesLabel = receivingNodesCount === 1 ? 'node' : 'nodes';
  const reach = `reached ${receivingNodesCount} server ${nodesLabel}`;

  return reach;
}
