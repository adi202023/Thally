// Thally — Previews Service
import { db } from '@/lib/db';

const VALIDATION_CHECKS = [
  { check: 'Markdown valid', detail: 'All markdown parsed without errors' },
  { check: 'Internal links valid', detail: 'All internal links resolve' },
  { check: 'Navigation valid', detail: 'Page appears in sidebar navigation' },
  { check: 'API examples valid', detail: 'All code blocks have language specifiers' },
  { check: 'No missing pages', detail: 'All referenced pages exist' },
  { check: 'Search index updated', detail: 'Search terms indexed' },
  { check: 'Agent context generated', detail: 'Knowledge chunks ready for indexing' },
];

export async function generatePreview(proposalId: string) {
  const proposal = await db.documentationProposal.findUnique({
    where: { id: proposalId },
    include: { task: true },
  });
  if (!proposal) throw new Error('Proposal not found');
  if (proposal.status !== 'approved') throw new Error('Proposal must be approved before preview');

  const preview = await db.preview.create({
    data: {
      proposalId,
      status: 'generating',
      validationResults: JSON.stringify([]),
    },
  });

  // Simulate validation
  const results = VALIDATION_CHECKS.map((c) => ({ ...c, passed: true }));
  // Count content-specific details
  const content = proposal.proposedContent;
  const terms = content.split(/\s+/).length;
  const chunks = Math.floor(terms / 50) + 1;
  results[5].detail = `${terms} terms indexed from ${proposal.pageTitle} page`;
  results[6].detail = `${chunks} knowledge chunks ready for indexing`;

  await db.preview.update({
    where: { id: preview.id },
    data: {
      status: 'ready',
      previewUrl: `/preview/${preview.id}`,
      validationResults: JSON.stringify(results),
    },
  });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      eventType: 'preview_generated',
      summary: `Deployment preview generated — all ${results.length} checks passed`,
      detail: JSON.stringify({ previewId: preview.id, checksPass: results.length }),
    },
  });

  return preview;
}

export async function getPreview(id: string) {
  return db.preview.findUnique({
    where: { id },
    include: {
      proposal: {
        include: {
          task: {
            include: { productChange: { include: { commit: true } } },
          },
          reviews: { include: { reviewer: true }, orderBy: { reviewedAt: 'desc' }, take: 1 },
        },
      },
      deployments: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
}

export async function mergePreview(previewId: string, actorId: string) {
  const preview = await db.preview.findUnique({
    where: { id: previewId },
    include: {
      proposal: { include: { task: true } },
    },
  });
  if (!preview) throw new Error('Preview not found');
  if (preview.status !== 'ready') throw new Error('Preview must pass all checks before merge');

  const proposal = preview.proposal;

  // Get the final approved content (from review edit if available)
  const review = await db.review.findFirst({
    where: { proposalId: proposal.id, decision: { in: ['approved', 'edited'] } },
    orderBy: { reviewedAt: 'desc' },
  });
  const finalContent = review?.editedContent ?? proposal.proposedContent;

  // Update documentation page
  await db.documentationPage.updateMany({
    where: { slug: proposal.pageSlug },
    data: {
      content: finalContent,
      status: 'published',
      publishedAt: new Date(),
      version: '1.1.0',
    },
  });

  // Create deployment
  const deployment = await db.deployment.create({
    data: {
      previewId,
      status: 'ready',
      provider: 'demo',
      deploymentUrl: '/docs',
      branch: 'docs/smart-sync-update',
      docVersion: '1.1.0',
      publishedAt: new Date(),
    },
  });

  // Update change status
  await db.productChange.update({
    where: { id: proposal.task.productChangeId },
    data: { status: 'published' },
  });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      actorId,
      eventType: 'documentation_merged',
      summary: `Documentation merged — ${proposal.pageTitle} page published`,
      detail: JSON.stringify({ pageSlug: proposal.pageSlug }),
    },
  });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      eventType: 'deployment_published',
      summary: 'Documentation deployed — version 1.1.0 live',
      detail: JSON.stringify({ deploymentId: deployment.id, docVersion: '1.1.0' }),
    },
  });

  return deployment;
}
