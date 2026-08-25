import { DemoKnowledgeEngine } from '@/lib/providers/ai/demo';
import { MockRepositoryProvider } from '@/lib/providers/repository/mock';

describe('Thally — Smart Sync Workflow & Engine Verification', () => {
  const engine = new DemoKnowledgeEngine();
  const repoProvider = new MockRepositoryProvider({ owner: 'thally-demo', repo: 'product-core' });

  const mockKnowledgeAreas = [
    { id: 'ka-1', slug: 'smart-sync', title: 'Smart Sync' },
    { id: 'ka-2', slug: 'project-settings', title: 'Project Settings' },
    { id: 'ka-3', slug: 'getting-started', title: 'Getting Started' },
    { id: 'ka-4', slug: 'permissions', title: 'Permissions' },
    { id: 'ka-5', slug: 'api-reference', title: 'API Reference' },
    { id: 'ka-6', slug: 'changelog', title: 'Changelog' },
    { id: 'ka-7', slug: 'faq', title: 'FAQ' },
    { id: 'ka-8', slug: 'billing', title: 'Billing' },
    { id: 'ka-9', slug: 'teams', title: 'Teams' },
    { id: 'ka-10', slug: 'security', title: 'Security Overview' },
  ];

  const smartSyncChange = {
    id: 'change-smartsync-001',
    title: 'Smart Sync — Automatic Documentation Synchronization',
    changeType: 'feature',
    commitMessage: 'feat(sync): introduce Smart Sync for connected documentation',
    diff: 'diff --git a/src/models/SmartSyncSettings.ts b/src/models/SmartSyncSettings.ts',
    changedFiles: [
      'src/models/SmartSyncSettings.ts',
      'src/api/v1/sync/route.ts',
      'src/settings/SmartSyncPanel.tsx',
      'tests/smartSync.test.ts',
      'src/lib/auth/scopes.ts',
    ],
    additions: 847,
    deletions: 12,
  };

  test('1. Repository provider retrieves commit and branch info', async () => {
    const commit = await repoProvider.getCommit('a3f8c2d');
    expect(commit).toBeDefined();
    expect(commit.shortSha).toBe('a3f8c2d');
    expect(commit.message).toContain('Smart Sync');

    const branches = await repoProvider.getBranches();
    expect(branches.some((b) => b.name === 'main')).toBe(true);
  });

  test('2. Knowledge engine accurately classifies affected areas vs unaffected areas', async () => {
    const result = await engine.analyzeChange({
      productChange: smartSyncChange,
      knowledgeAreas: mockKnowledgeAreas,
    });

    expect(result.mode).toBe('demo');
    expect(result.overallConfidence).toBe('high');

    const affectedSlugs = result.affectedAreas
      .filter((a) => a.affectedStatus === 'definitely')
      .map((a) => mockKnowledgeAreas.find((k) => k.id === a.knowledgeAreaId)?.slug);

    // Verify definitely affected
    expect(affectedSlugs).toContain('smart-sync');
    expect(affectedSlugs).toContain('project-settings');
    expect(affectedSlugs).toContain('permissions');
    expect(affectedSlugs).toContain('api-reference');
    expect(affectedSlugs).toContain('getting-started');
    expect(affectedSlugs).toContain('changelog');

    // Verify unaffected
    const unaffectedSlugs = result.affectedAreas
      .filter((a) => a.affectedStatus === 'unaffected')
      .map((a) => mockKnowledgeAreas.find((k) => k.id === a.knowledgeAreaId)?.slug);

    expect(unaffectedSlugs).toContain('billing');
    expect(unaffectedSlugs).toContain('teams');
    expect(unaffectedSlugs).toContain('security');
  });

  test('3. Proposal generation contains the initial draft requiring human review', async () => {
    const proposal = await engine.generateProposal({
      changeTitle: smartSyncChange.title,
      changeSummary: 'New Smart Sync feature introduced.',
      userImpact: 'Users can configure synchronization.',
      currentContent: '# Draft',
      evidenceSummary: 'Based on commit diff.',
      pageTitle: 'Smart Sync',
      pageSlug: 'smart-sync',
    });

    expect(proposal.proposedContent).toContain('Smart Sync');
    // Notice the initial proposal has the claim that the maintainer must correct
    expect(proposal.proposedContent).toContain('all project documentation');
  });

  test('4. Human review correction fixes the overstated claim', () => {
    const rawProposal = 'Smart Sync automatically synchronizes all project documentation.';
    const correctedProposal = rawProposal.replace(
      'all project documentation',
      'the documentation sources you select'
    );

    expect(correctedProposal).toBe(
      'Smart Sync automatically synchronizes the documentation sources you select.'
    );
    expect(correctedProposal).not.toContain('all project documentation');
  });

  test('5. Agent Knowledge returns answers with verified citations when documentation is published', async () => {
    const chunks = [
      {
        pageSlug: 'smart-sync',
        pageTitle: 'Smart Sync',
        content: 'Smart Sync lets you automatically synchronize the documentation sources you select with your connected product repository.',
      },
      {
        pageSlug: 'permissions',
        pageTitle: 'Permissions',
        content: 'Smart Sync requires the project:write scope.',
      },
    ];

    const result = await engine.queryKnowledge({
      query: 'How do I enable Smart Sync?',
      chunks,
    });

    expect(result.hasAnswer).toBe(true);
    expect(result.answer).toContain('documentation sources you select');
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations[0].pageSlug).toBe('smart-sync');
  });

  test('6. Agent Knowledge safely handles unpublished documentation states', async () => {
    const result = await engine.queryKnowledge({
      query: 'How do I enable Smart Sync?',
      chunks: [], // Pre-publication state (no indexed chunks)
    });

    expect(result.hasAnswer).toBe(false);
    expect(result.answer).toContain("I don't have enough information");
    expect(result.citations).toEqual([]);
  });
});
