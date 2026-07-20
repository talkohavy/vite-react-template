export type Commit = {
  hash: string;
  /**
   * Parent hashes. A normal commit has 1 parent (0 for the very first commit).
   * A merge commit has 2 parents: `[mainlineParent, mergedInParent]`.
   */
  parents: string[];
  branch: string;
  /**
   * Global insertion order. 0 is the oldest commit (rendered at the bottom).
   */
  order: number;
};

export type BranchInfo = {
  name: string;
  /**
   * Hash of the branch's newest commit.
   */
  tip: string;
  /**
   * Horizontal lane index. 0 is the left-most (usually `main`).
   */
  lane: number;
  color: string;
};

export type GitModel = {
  commits: Commit[];
  branches: BranchInfo[];
  /**
   * Name of the branch currently checked out (HEAD).
   */
  head: string;
};
