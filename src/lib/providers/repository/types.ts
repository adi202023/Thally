// Thally — Repository Provider Type Definitions
// All repository operations go through this interface.
// Swap implementations without touching any UI code.

export interface RepositoryFile {
  path: string;
  content: string;
  size: number;
  encoding: 'utf-8' | 'base64';
}

export interface RepositoryCommit {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  authorEmail: string;
  authoredAt: Date;
  additions: number;
  deletions: number;
  filesChanged: number;
  diff?: string;
}

export interface RepositoryBranch {
  name: string;
  sha: string;
  isDefault: boolean;
}

export interface RepositoryDiff {
  files: DiffFile[];
  additions: number;
  deletions: number;
}

export interface DiffFile {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  patch?: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  headBranch: string;
  baseBranch: string;
  url: string;
}

export interface RepositoryProviderOptions {
  owner: string;
  repo: string;
  token?: string;
}

/**
 * Abstract repository provider interface.
 * Implement this for GitHub, GitLab, Bitbucket, or any other provider.
 */
export interface RepositoryProvider {
  getRepository(): Promise<{ name: string; defaultBranch: string; private: boolean }>;
  getBranches(): Promise<RepositoryBranch[]>;
  getCommit(sha: string): Promise<RepositoryCommit>;
  getCommits(branch?: string, limit?: number): Promise<RepositoryCommit[]>;
  getDiff(base: string, head: string): Promise<RepositoryDiff>;
  getFiles(paths: string[], ref?: string): Promise<RepositoryFile[]>;
  createBranch(name: string, fromSha: string): Promise<RepositoryBranch>;
  commitChanges(branch: string, files: { path: string; content: string }[], message: string): Promise<RepositoryCommit>;
  createPullRequest(head: string, base: string, title: string, body: string): Promise<PullRequest>;
  mergePullRequest(prId: string): Promise<{ merged: boolean; sha: string }>;
  getPullRequestStatus(prId: string): Promise<PullRequest>;
}
