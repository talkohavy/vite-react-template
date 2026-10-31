import { describe, expect, it } from 'vite-plus/test';
import { describeReach } from './describeReach';

describe('describeReach', () => {
  it('should explain why nothing was received when no node got it', () => {
    const actualResult = describeReach({ receivingNodesCount: 0, nobodyListening: 'the user has no open stream' });

    expect(actualResult).toBe('reached no server node (the user has no open stream)');
  });

  it('should use the singular for one node', () => {
    const actualResult = describeReach({ receivingNodesCount: 1, nobodyListening: 'unused' });

    expect(actualResult).toBe('reached 1 server node');
  });

  it('should use the plural for several nodes', () => {
    const actualResult = describeReach({ receivingNodesCount: 3, nobodyListening: 'unused' });

    expect(actualResult).toBe('reached 3 server nodes');
  });
});
