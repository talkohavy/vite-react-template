import type { GitModel } from './types';

/**
 * Decides the left-to-right order of branch lanes so arches cross as little as
 * possible.
 *
 * Two ideas drive it:
 *   1. Keep every branch adjacent to the branch it forked from (its "base"), so
 *      a branch-off and its later merge stay next to their parent lane instead
 *      of jumping over unrelated lanes.
 *   2. Among siblings that forked from the same base, place the one that merges
 *      back earliest on the inner lane (closest to the base).
 *
 * We walk the branch tree depth-first from the trunk: push a branch, then its
 * children (sorted by merge-back time). For well-nested git histories this
 * removes crossings entirely; for the rest it minimizes them. It is a cheap,
 * deterministic pass - no crossing-minimization search (NP-hard in general).
 *
 * An explicit `override` (the manual swap mechanism) always wins: names listed
 * there are placed first, in that exact order; any branch not mentioned is
 * appended using the heuristic.
 */
export function orderBranches(props: { model: GitModel; override?: string[] }): string[] {
  const { model, override } = props;
  const { commits, branches } = model;

  const branchOfHash = new Map<string, string>();
  commits.forEach((commit) => {
    branchOfHash.set(commit.hash, commit.branch);
  });

  const firstOrder = new Map<string, number>();
  const lastOrder = new Map<string, number>();
  const earliestParentHash = new Map<string, string | undefined>();

  commits.forEach((commit) => {
    const currentFirst = firstOrder.get(commit.branch);
    if (currentFirst === undefined || commit.order < currentFirst) {
      firstOrder.set(commit.branch, commit.order);
      earliestParentHash.set(commit.branch, commit.parents[0]);
    }

    const currentLast = lastOrder.get(commit.branch);
    if (currentLast === undefined || commit.order > currentLast) {
      lastOrder.set(commit.branch, commit.order);
    }
  });

  // A cross-branch parent link (a branch-off or a merge) keeps the parent's
  // branch "alive" until the child commit, so extend its interval to that order.
  commits.forEach((commit) => {
    commit.parents.forEach((parentHash) => {
      const parentBranch = branchOfHash.get(parentHash);

      if (parentBranch && parentBranch !== commit.branch) {
        const currentLast = lastOrder.get(parentBranch);

        if (currentLast === undefined || commit.order > currentLast) {
          lastOrder.set(parentBranch, commit.order);
        }
      }
    });
  });

  const creationLane = new Map<string, number>();
  branches.forEach((branch) => {
    creationLane.set(branch.name, branch.lane);
  });

  const allNames = branches.map((branch) => branch.name);

  function heuristicCompare(nameA: string, nameB: string): number {
    const lastA = lastOrder.get(nameA) ?? 0;
    const lastB = lastOrder.get(nameB) ?? 0;

    if (lastA !== lastB) {
      return lastA - lastB;
    }

    const firstA = firstOrder.get(nameA) ?? 0;
    const firstB = firstOrder.get(nameB) ?? 0;

    if (firstA !== firstB) {
      return firstA - firstB;
    }

    const laneA = creationLane.get(nameA) ?? 0;
    const laneB = creationLane.get(nameB) ?? 0;

    return laneA - laneB;
  }

  if (override && override.length > 0) {
    const validOverride = override.filter((name) => creationLane.has(name));
    const seen = new Set(validOverride);
    const remaining = allNames.filter((name) => !seen.has(name));
    remaining.sort(heuristicCompare);
    const ordered = [...validOverride, ...remaining];

    return ordered;
  }

  // The base branch of each branch = the branch its earliest commit forked from.
  // Branches with no base (their root commit has no parent) are trunk roots.
  const childrenOf = new Map<string, string[]>();
  const roots: string[] = [];

  allNames.forEach((name) => {
    const parentHash = earliestParentHash.get(name);
    const baseBranch = parentHash ? branchOfHash.get(parentHash) : undefined;

    if (baseBranch && baseBranch !== name) {
      const siblings = childrenOf.get(baseBranch) ?? [];
      siblings.push(name);
      childrenOf.set(baseBranch, siblings);
    } else {
      roots.push(name);
    }
  });

  function rootCompare(nameA: string, nameB: string): number {
    const firstA = firstOrder.get(nameA) ?? 0;
    const firstB = firstOrder.get(nameB) ?? 0;

    if (firstA !== firstB) {
      return firstA - firstB;
    }

    return heuristicCompare(nameA, nameB);
  }

  childrenOf.forEach((siblings) => {
    siblings.sort(heuristicCompare);
  });
  roots.sort(rootCompare);

  const ordered: string[] = [];
  const visited = new Set<string>();

  function visit(name: string): void {
    if (visited.has(name)) {
      return;
    }

    visited.add(name);
    ordered.push(name);
    const children = childrenOf.get(name) ?? [];
    children.forEach(visit);
  }

  roots.forEach(visit);
  // Safety net: append any branch not reachable from a root (e.g. odd cycles).
  allNames.forEach(visit);

  return ordered;
}
