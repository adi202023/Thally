// Thally — Proposals Service
import { db } from '@/lib/db';
import { getKnowledgeEngine } from '@/lib/providers';

export async function getProposal(id: string) {
  return db.documentationProposal.findUnique({
    where: { id },
    include: {
      task: {
        include: {
          productChange: { include: { commit: true } },
          assignee: true,
        },
      },
      reviews: { include: { reviewer: true }, orderBy: { reviewedAt: 'desc' } },
      previews: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
}

export async function generateProposal(taskId: string) {
  const task = await db.documentationTask.findUnique({
    where: { id: taskId },
    include: {
      productChange: { include: { impactReports: { take: 1 }, commit: true } },
    },
  });

  if (!task) throw new Error('Task not found');

  const engine = getKnowledgeEngine();
  const report = task.productChange.impactReports[0];

  // Get the current doc page content
  const pageSlug = JSON.parse(task.affectedPages as string)[0] ?? 'smart-sync';
  const currentPage = await db.documentationPage.findFirst({
    where: { slug: pageSlug },
  });

  const result = await engine.generateProposal({
    changeTitle: task.productChange.title,
    changeSummary: report?.changeSummary ?? task.description,
    userImpact: report?.userImpact ?? '',
    currentContent: currentPage?.content ?? '',
    evidenceSummary: 'Based on commit analysis and repository evidence.',
    pageTitle: currentPage?.title ?? pageSlug,
    pageSlug,
  });

  const proposal = await db.documentationProposal.create({
    data: {
      taskId,
      pageSlug,
      pageTitle: currentPage?.title ?? pageSlug,
      currentContent: currentPage?.content ?? '',
      proposedContent: result.proposedContent,
      changeSummary: result.changeSummary,
      status: 'pending',
      analysisMode: result.mode,
    },
  });

  await db.documentationTask.update({ where: { id: taskId }, data: { status: 'in_review' } });

  await db.auditEvent.create({
    data: {
      productChangeId: task.productChangeId,
      eventType: 'proposal_generated',
      summary: `Documentation proposal generated for ${pageSlug} page`,
      detail: JSON.stringify({ proposalId: proposal.id, mode: result.mode }),
    },
  });

  return proposal;
}

export async function editProposal(id: string, newContent: string, actorId: string) {
  const proposal = await db.documentationProposal.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!proposal) throw new Error('Proposal not found');

  await db.documentationProposal.update({
    where: { id },
    data: { proposedContent: newContent, status: 'editing', updatedAt: new Date() },
  });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      actorId,
      eventType: 'proposal_edited',
      summary: 'Proposal edited by maintainer',
      detail: JSON.stringify({ proposalId: id }),
    },
  });
}

export async function approveProposal(id: string, actorId: string, comment?: string) {
  const proposal = await db.documentationProposal.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!proposal) throw new Error('Proposal not found');

  await db.review.create({
    data: {
      proposalId: id,
      reviewerId: actorId,
      decision: 'approved',
      comment,
    },
  });

  await db.documentationProposal.update({ where: { id }, data: { status: 'approved' } });
  await db.documentationTask.update({
    where: { id: proposal.taskId },
    data: { status: 'in_review' },
  });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      actorId,
      eventType: 'proposal_approved',
      summary: 'Proposal approved',
    },
  });
}

export async function rejectProposal(id: string, actorId: string, reason: string) {
  const proposal = await db.documentationProposal.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!proposal) throw new Error('Proposal not found');

  await db.review.create({
    data: { proposalId: id, reviewerId: actorId, decision: 'rejected', comment: reason },
  });

  await db.documentationProposal.update({ where: { id }, data: { status: 'rejected' } });

  await db.auditEvent.create({
    data: {
      productChangeId: proposal.task.productChangeId,
      actorId,
      eventType: 'proposal_rejected',
      summary: `Proposal rejected: ${reason}`,
    },
  });
}
