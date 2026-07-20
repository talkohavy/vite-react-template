import GitRepo from '../logic/GitRepo';
import type { GitModel } from '../logic/types';

export type Example = {
  id: string;
  label: string;
  description: string;
  model: GitModel;
};

/**
 * 1. A plain linear history on `main`. No branches, no merges.
 */
function buildLinear(): GitModel {
  const repo = new GitRepo({ seed: 'linear' });
  repo.commit().commit().commit().commit();
  const model = repo.build();

  return model;
}

/**
 * 2. `main` and a `feature` branch that both advance but never merge.
 */
function buildSingleBranch(): GitModel {
  const repo = new GitRepo({ seed: 'single-branch' });
  repo.commit().commit();
  repo.branchAndCheckout('feature');
  repo.commit().commit();
  repo.checkout('main');
  repo.commit();
  repo.checkout('feature');
  const model = repo.build();

  return model;
}

/**
 * 3. A `feature` branch that is created, worked on, then merged back into `main`.
 */
function buildFeatureMerge(): GitModel {
  const repo = new GitRepo({ seed: 'feature-merge' });
  repo.commit().commit();
  repo.branchAndCheckout('feature');
  repo.commit().commit();
  repo.checkout('main');
  repo.commit();
  repo.merge('feature');
  const model = repo.build();

  return model;
}

/**
 * 4. Two independent side branches (`feature`, `hotfix`) both merged into `main`.
 */
function buildTwoBranches(): GitModel {
  const repo = new GitRepo({ seed: 'two-branches' });
  repo.commit().commit();
  repo.branchAndCheckout('feature');
  repo.commit().commit();
  repo.checkout('main');
  repo.branchAndCheckout('hotfix');
  repo.commit();
  repo.checkout('main');
  repo.merge('hotfix');
  repo.merge('feature');
  const model = repo.build();

  return model;
}

/**
 * 5. Complex flow: a branch off a branch (`feature-a` off `develop`), a parallel
 * `hotfix`, and several merges converging back into `main`.
 */
function buildComplex(): GitModel {
  const repo = new GitRepo({ seed: 'complex' });
  repo.commit().commit();
  repo.branchAndCheckout('develop');
  repo.commit();
  repo.branchAndCheckout('feature-a');
  repo.commit().commit();
  repo.checkout('develop');
  repo.commit();
  repo.checkout('main');
  repo.branchAndCheckout('hotfix');
  repo.commit();
  repo.checkout('develop');
  repo.merge('feature-a');
  repo.commit();
  repo.checkout('main');
  repo.merge('hotfix');
  repo.merge('develop');
  repo.checkout('develop');
  const model = repo.build();

  return model;
}

export const EXAMPLES: Example[] = [
  {
    id: 'linear',
    label: '1. Linear history',
    description: 'A single branch with a straight line of commits.',
    model: buildLinear(),
  },
  {
    id: 'single-branch',
    label: '2. Branch, no merge',
    description: 'A feature branch diverges from main and never merges back.',
    model: buildSingleBranch(),
  },
  {
    id: 'feature-merge',
    label: '3. Feature merge',
    description: 'A feature branch is created, worked on, then merged into main.',
    model: buildFeatureMerge(),
  },
  {
    id: 'two-branches',
    label: '4. Two branches merged',
    description: 'A feature and a hotfix branch both merge back into main.',
    model: buildTwoBranches(),
  },
  {
    id: 'complex',
    label: '5. Complex flow',
    description: 'A branch off a branch, a parallel hotfix, and multiple merges.',
    model: buildComplex(),
  },
];
