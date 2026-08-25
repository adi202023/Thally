// Thally — GitHub Repository Provider (Stub)
// Replace MockRepositoryProvider with this when GITHUB_TOKEN is set.
// TODO: Implement using @octokit/rest

import type { RepositoryProvider, RepositoryBranch, RepositoryCommit, RepositoryDiff, RepositoryFile, PullRequest } from './types';

export class GitHubRepositoryProvider implements RepositoryProvider {
  constructor(private options: { owner: string; repo: string; token: string }) {
    // TODO: Initialize Octokit with token
  }

  async getRepository(): Promise<{ name: string; defaultBranch: string; private: boolean }> {
    throw new Error('GitHubRepositoryProvider not yet implemented. Set DEMO_MODE=false and provide GITHUB_TOKEN.');
  }

  async getBranches(): Promise<RepositoryBranch[]> {
    throw new Error('Not implemented');
  }

  async getCommit(_sha: string): Promise<RepositoryCommit> {
    throw new Error('Not implemented');
  }

  async getCommits(): Promise<RepositoryCommit[]> {
    throw new Error('Not implemented');
  }

  async getDiff(): Promise<RepositoryDiff> {
    throw new Error('Not implemented');
  }

  async getFiles(): Promise<RepositoryFile[]> {
    throw new Error('Not implemented');
  }

  async createBranch(): Promise<RepositoryBranch> {
    throw new Error('Not implemented');
  }

  async commitChanges(): Promise<RepositoryCommit> {
    throw new Error('Not implemented');
  }

  async createPullRequest(): Promise<PullRequest> {
    throw new Error('Not implemented');
  }

  async mergePullRequest(): Promise<{ merged: boolean; sha: string }> {
    throw new Error('Not implemented');
  }

  async getPullRequestStatus(): Promise<PullRequest> {
    throw new Error('Not implemented');
  }
}
