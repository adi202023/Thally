// Thally — Mock Repository Provider
// Used in Demo Mode. Returns realistic data without external credentials.
// Replace with GitHubRepositoryProvider for production.

import type {
  RepositoryProvider,
  RepositoryCommit,
  RepositoryBranch,
  RepositoryDiff,
  RepositoryFile,
  PullRequest,
} from './types';

export class MockRepositoryProvider implements RepositoryProvider {
  private owner: string;
  private repo: string;

  constructor(options: { owner: string; repo: string }) {
    this.owner = options.owner;
    this.repo = options.repo;
  }

  async getRepository() {
    return {
      name: `${this.owner}/${this.repo}`,
      defaultBranch: 'main',
      private: false,
    };
  }

  async getBranches(): Promise<RepositoryBranch[]> {
    return [
      { name: 'main', sha: 'a3f8c2d1e9b4f72a8c3e5d1b2a7f9c8e4b3d6a1f', isDefault: true },
      { name: 'docs/smart-sync-update', sha: 'b8e9d3f2a1c5e7b9d4f6a8c2e1b7d3f5a9c1e4b7', isDefault: false },
      { name: 'feat/smart-sync', sha: 'a3f8c2d1e9b4f72a8c3e5d1b2a7f9c8e4b3d6a1f', isDefault: false },
    ];
  }

  async getCommit(sha: string): Promise<RepositoryCommit> {
    const commits = await this.getCommits();
    const found = commits.find((c) => c.sha === sha || c.shortSha === sha);
    if (found) return found;
    return commits[0];
  }

  async getCommits(_branch?: string, limit = 10): Promise<RepositoryCommit[]> {
    const commits: RepositoryCommit[] = [
      {
        sha: 'a3f8c2d1e9b4f72a8c3e5d1b2a7f9c8e4b3d6a1f',
        shortSha: 'a3f8c2d',
        message: 'feat(sync): introduce Smart Sync for connected documentation\n\nAdds the Smart Sync feature that lets users automatically synchronize\nselected documentation sources with their connected product repository.',
        author: 'Alex Chen',
        authorEmail: 'alex@thally.dev',
        authoredAt: new Date('2026-08-18T14:23:00Z'),
        additions: 847,
        deletions: 12,
        filesChanged: 18,
      },
      {
        sha: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
        shortSha: 'c1d2e3f',
        message: 'fix(auth): handle expired tokens gracefully',
        author: 'Jordan Kim',
        authorEmail: 'jordan@thally.dev',
        authoredAt: new Date('2026-08-17T10:15:00Z'),
        additions: 23,
        deletions: 8,
        filesChanged: 3,
      },
      {
        sha: 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
        shortSha: 'd2e3f4a',
        message: 'chore: update dependencies',
        author: 'Alex Chen',
        authorEmail: 'alex@thally.dev',
        authoredAt: new Date('2026-08-16T09:00:00Z'),
        additions: 145,
        deletions: 120,
        filesChanged: 5,
      },
    ];
    return commits.slice(0, limit);
  }

  async getDiff(_base: string, _head: string): Promise<RepositoryDiff> {
    return {
      additions: 847,
      deletions: 12,
      files: [
        { path: 'src/models/SmartSyncSettings.ts', status: 'added', additions: 42, deletions: 0 },
        { path: 'src/api/v1/sync/route.ts', status: 'added', additions: 89, deletions: 0 },
        { path: 'src/api/v1/sync/route.test.ts', status: 'added', additions: 67, deletions: 0 },
        { path: 'src/settings/SmartSyncPanel.tsx', status: 'added', additions: 124, deletions: 0 },
        { path: 'src/settings/SmartSyncPanel.test.tsx', status: 'added', additions: 58, deletions: 0 },
        { path: 'src/components/SyncStatusIndicator.tsx', status: 'added', additions: 45, deletions: 0 },
        { path: 'src/components/FrequencySelector.tsx', status: 'added', additions: 38, deletions: 0 },
        { path: 'src/components/SourceSelector.tsx', status: 'added', additions: 72, deletions: 0 },
        { path: 'tests/smartSync.test.ts', status: 'added', additions: 67, deletions: 0 },
        { path: 'prisma/migrations/20260818_smart_sync/migration.sql', status: 'added', additions: 32, deletions: 0 },
        { path: 'src/lib/auth/scopes.ts', status: 'modified', additions: 8, deletions: 2 },
        { path: 'src/lib/rateLimiter.ts', status: 'modified', additions: 15, deletions: 5 },
        { path: 'CHANGELOG.md', status: 'modified', additions: 12, deletions: 0 },
        { path: 'README.md', status: 'modified', additions: 8, deletions: 2 },
        { path: 'package.json', status: 'modified', additions: 2, deletions: 1 },
        { path: 'src/types/index.ts', status: 'modified', additions: 18, deletions: 0 },
        { path: 'src/lib/audit/events.ts', status: 'modified', additions: 6, deletions: 2 },
        { path: 'src/lib/permissions/index.ts', status: 'modified', additions: 12, deletions: 0 },
      ],
    };
  }

  async getFiles(paths: string[], _ref?: string): Promise<RepositoryFile[]> {
    // Return mock file content for demo
    return paths.map((path) => ({
      path,
      content: `// Mock content for ${path}\n// In connected mode, this would return real file content from the repository.`,
      size: 100,
      encoding: 'utf-8' as const,
    }));
  }

  async createBranch(name: string, _fromSha: string): Promise<RepositoryBranch> {
    return {
      name,
      sha: 'b8e9d3f2a1c5e7b9d4f6a8c2e1b7d3f5a9c1e4b7',
      isDefault: false,
    };
  }

  async commitChanges(
    branch: string,
    _files: { path: string; content: string }[],
    message: string
  ): Promise<RepositoryCommit> {
    return {
      sha: 'b8e9d3f2a1c5e7b9d4f6a8c2e1b7d3f5a9c1e4b7',
      shortSha: 'b8e9d3f',
      message,
      author: 'Thally Bot',
      authorEmail: 'bot@thally.dev',
      authoredAt: new Date(),
      additions: 50,
      deletions: 10,
      filesChanged: 1,
    };
  }

  async createPullRequest(
    head: string,
    base: string,
    title: string,
    body: string
  ): Promise<PullRequest> {
    return {
      id: 'pr-demo-001',
      number: 42,
      title,
      body,
      state: 'open',
      headBranch: head,
      baseBranch: base,
      url: `https://github.com/${this.owner}/${this.repo}/pull/42`,
    };
  }

  async mergePullRequest(_prId: string): Promise<{ merged: boolean; sha: string }> {
    return {
      merged: true,
      sha: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
    };
  }

  async getPullRequestStatus(_prId: string): Promise<PullRequest> {
    return {
      id: 'pr-demo-001',
      number: 42,
      title: 'docs: add Smart Sync documentation',
      body: 'Generated by Thally after detecting feat(sync): introduce Smart Sync.',
      state: 'merged',
      headBranch: 'docs/smart-sync-update',
      baseBranch: 'main',
      url: `https://github.com/${this.owner}/${this.repo}/pull/42`,
    };
  }
}
