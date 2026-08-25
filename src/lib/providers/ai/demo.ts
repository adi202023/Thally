// Thally — Demo Knowledge Engine
// Deterministic analysis engine. Works without any AI API key.
// Results are clearly labeled as "Demo Knowledge Analysis" in the UI.
// Replace with OpenAIKnowledgeEngine for production.

import type {
  KnowledgeEngine,
  KnowledgeEngineInput,
  KnowledgeEngineResult,
  DocumentationProposalInput,
  DocumentationProposalResult,
  AgentQueryInput,
  AgentQueryResult,
} from './types';

export class DemoKnowledgeEngine implements KnowledgeEngine {
  async analyzeChange(input: KnowledgeEngineInput): Promise<KnowledgeEngineResult> {
    const start = Date.now();

    // Deterministic analysis based on commit message and changed files
    const commitLower = input.productChange.commitMessage.toLowerCase();
    const titleLower = input.productChange.title.toLowerCase();
    const isFeature = input.productChange.changeType === 'feature';
    const isSmartSync = commitLower.includes('sync') || titleLower.includes('sync');
    const hasApiChange = input.productChange.changedFiles.some(
      (f) => f.includes('api') || f.includes('route')
    );
    const hasPermissionChange = input.productChange.changedFiles.some(
      (f) => f.includes('auth') || f.includes('permission') || f.includes('scope')
    );
    const hasUIChange = input.productChange.changedFiles.some(
      (f) => f.includes('.tsx') || f.includes('.jsx') || f.includes('component')
    );
    const hasTestChange = input.productChange.changedFiles.some(
      (f) => f.includes('.test.') || f.includes('.spec.')
    );

    const affectedAreas = input.knowledgeAreas.map((area) => {
      const slug = area.slug;

      if (slug === 'smart-sync' && isSmartSync) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'Smart Sync is an entirely new knowledge area. No existing documentation exists. This is the highest priority gap.',
          recommendedChanges: ['Create a dedicated Smart Sync page with setup instructions, frequency options, source selection, and permissions.'],
        };
      }

      if (slug === 'project-settings' && hasUIChange) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'Smart Sync is configured in Project Settings. A new settings panel was added (SmartSyncPanel.tsx). Current settings documentation does not mention it.',
          recommendedChanges: ['Add a Smart Sync section to the Project Settings documentation.'],
        };
      }

      if (slug === 'getting-started' && isFeature) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'Getting Started is the first page new users read. A significant new capability (Smart Sync) should be surfaced here.',
          recommendedChanges: ['Add a brief mention of Smart Sync with a link to the dedicated page.'],
        };
      }

      if (slug === 'permissions' && hasPermissionChange) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'Smart Sync requires a new permission scope (project:write). This must be documented for administrators and users.',
          recommendedChanges: ['Document the project:write scope requirement for Smart Sync in the Permissions page.'],
        };
      }

      if (slug === 'api-reference' && hasApiChange) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'A new POST /api/v1/sync endpoint was introduced. Developers integrating via API need this documented.',
          recommendedChanges: ['Add the POST /v1/sync endpoint documentation including request schema, required scopes, and rate limits.'],
        };
      }

      if (slug === 'changelog' && isFeature) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'definitely' as const,
          confidence: 'high' as const,
          reasoning: 'A significant new feature was shipped. The changelog must be updated so users tracking product updates are aware.',
          recommendedChanges: ['Add a v1.1.0 changelog entry describing Smart Sync.'],
        };
      }

      if (slug === 'faq') {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'possibly' as const,
          confidence: 'medium' as const,
          reasoning: 'Users may ask whether Smart Sync syncs all documentation or only selected sources. A clarifying FAQ entry could prevent confusion, but it is not strictly required.',
          recommendedChanges: ['Consider adding an FAQ entry clarifying that only selected documentation sources are synchronized.'],
        };
      }

      if (slug === 'troubleshooting' && hasAPIChange(input.productChange.changedFiles)) {
        return {
          knowledgeAreaId: area.id,
          affectedStatus: 'possibly' as const,
          confidence: 'low' as const,
          reasoning: 'Smart Sync may introduce new failure modes (rate limiting, auth failures) that could appear in troubleshooting requests.',
          recommendedChanges: ['Consider adding a Smart Sync troubleshooting section if users report issues.'],
        };
      }

      // Unaffected areas
      return {
        knowledgeAreaId: area.id,
        affectedStatus: 'unaffected' as const,
        confidence: 'high' as const,
        reasoning: getUnaffectedReasoning(slug, isSmartSync),
        recommendedChanges: [],
      };
    });

    return {
      mode: 'demo',
      affectedAreas,
      changeSummary: `This commit introduces Smart Sync, a new user-configurable documentation synchronization feature. Users can select specific documentation sources to synchronize and configure a frequency (manual, hourly, daily, weekly). The feature requires the project:write permission scope and introduces a new POST /api/v1/sync API endpoint.`,
      userImpact: `Users with project:write access gain the ability to configure automatic documentation synchronization. They explicitly select which documentation areas to sync — not all documentation is synchronized automatically. Users with Viewer or Editor roles cannot access Smart Sync.`,
      risks: [
        'Documentation claiming Smart Sync synchronizes "all" documentation would be inaccurate — only selected sources are synced',
        'Missing the permission requirement (project:write) could mislead users who cannot access the feature',
        'Not documenting the rate limit (100 syncs/day) could cause confusion when limits are hit',
        'FAQ may contain information implying broader synchronization than the feature actually provides',
      ],
      recommendedActions: [
        'Create a dedicated Smart Sync documentation page',
        'Update Project Settings to include Smart Sync section',
        'Update Permissions to document project:write requirement',
        'Update API Reference with POST /v1/sync endpoint',
        'Update Changelog with v1.1.0 release note',
        'Update Getting Started to reference Smart Sync',
        'Consider an FAQ entry clarifying source-specific sync behavior',
      ],
      overallConfidence: 'high',
      analysisLatencyMs: Date.now() - start + 1200, // Realistic latency simulation
    };
  }

  async generateProposal(input: DocumentationProposalInput): Promise<DocumentationProposalResult> {
    // The demo proposal intentionally contains an overstated claim
    // ("all project documentation") for the human-in-the-loop demo
    const content = `# ${input.pageTitle}

Smart Sync automatically synchronizes **all project documentation** with your connected product repository, keeping everything up to date without manual intervention.

## How It Works

Thally monitors your repository for changes. When a meaningful product change is detected, Smart Sync automatically updates documentation across the board.

## Enabling Smart Sync

1. Open **Project Settings**
2. Select **Smart Sync**
3. Set a synchronization frequency
4. Click **Enable Smart Sync**

## Sync Frequency

| Frequency | Description |
|---|---|
| Manual | Sync only when you trigger it |
| Hourly | Sync every hour |
| Daily | Sync once per day |
| Weekly | Sync once per week |

## Status

The Smart Sync status indicator shows whether the last sync succeeded.

## Permissions

Smart Sync requires the \`project:write\` scope.`;

    return {
      proposedContent: content,
      changeSummary: 'New Smart Sync documentation page generated from commit analysis.',
      mode: 'demo',
    };
  }

  async queryKnowledge(input: AgentQueryInput): Promise<AgentQueryResult> {
    if (input.chunks.length === 0) {
      return {
        answer: "I don't have enough information to answer that question. The relevant documentation may not have been published yet.",
        citations: [],
        mode: 'demo',
        hasAnswer: false,
      };
    }

    const queryLower = input.query.toLowerCase();
    const isSmartSyncQuery =
      queryLower.includes('smart sync') ||
      queryLower.includes('smartsync') ||
      queryLower.includes('sync') ||
      queryLower.includes('synchronize') ||
      queryLower.includes('enable');

    if (isSmartSyncQuery) {
      const smartSyncChunks = input.chunks.filter((c) => c.pageSlug === 'smart-sync');
      const settingsChunks = input.chunks.filter((c) => c.pageSlug === 'permissions');

      if (smartSyncChunks.length > 0) {
        return {
          answer: `Smart Sync lets you automatically synchronize **the documentation sources you select** with your connected product repository.

**To enable Smart Sync:**
1. Open Project Settings
2. Select Smart Sync
3. Choose the documentation sources you want to synchronize
4. Select a synchronization frequency (Manual, Hourly, Daily, or Weekly)
5. Click Enable Smart Sync

**Note:** Smart Sync requires the \`project:write\` scope. Users with Viewer or Editor roles cannot enable Smart Sync.`,
          citations: [
            {
              pageSlug: 'smart-sync',
              pageTitle: 'Smart Sync',
              excerpt: 'Smart Sync lets you automatically synchronize the documentation sources you select with your connected product repository.',
            },
            ...(settingsChunks.length > 0
              ? [
                  {
                    pageSlug: 'permissions',
                    pageTitle: 'Permissions',
                    excerpt: 'Smart Sync requires the project:write scope.',
                  },
                ]
              : []),
          ],
          mode: 'demo',
          hasAnswer: true,
        };
      }
    }

    // Generic answer from available chunks
    const relevantChunks = input.chunks.slice(0, 2);
    return {
      answer: `Based on the available documentation: ${relevantChunks.map((c) => c.content).join(' ')}`,
      citations: relevantChunks.map((c) => ({
        pageSlug: c.pageSlug,
        pageTitle: c.pageTitle,
        excerpt: c.content.slice(0, 100),
      })),
      mode: 'demo',
      hasAnswer: true,
    };
  }
}

function hasAPIChange(files: string[]): boolean {
  return files.some((f) => f.includes('api') || f.includes('route'));
}

function getUnaffectedReasoning(slug: string, _isFeature: boolean): string {
  const reasons: Record<string, string> = {
    billing: 'Smart Sync is available on all plans in this release. Billing documentation does not need to change.',
    teams: 'Smart Sync permissions are project-scoped, not team-scoped. Team management documentation is unaffected.',
    security: 'Smart Sync uses the existing authentication infrastructure. No new security concepts require Security Overview updates.',
  };
  return reasons[slug] || 'This knowledge area is not affected by the Smart Sync feature introduction.';
}
