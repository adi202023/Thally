// Thally — Changes Service
import { db } from '@/lib/db';
import { getKnowledgeEngine } from '@/lib/providers';

export async function getChanges(projectId?: string) {
  return db.productChange.findMany({
    where: projectId ? { projectId } : undefined,
    include: {
      commit: true,
      project: true,
      repository: true,
      _count: { select: { evidence: true, documentationTasks: true } },
    },
    orderBy: { detectedAt: 'desc' },
  });
}

export async function getChange(id: string) {
  return db.productChange.findUnique({
    where: { id },
    include: {
      commit: true,
      project: true,
      repository: true,
      impactReports: {
        include: { items: { include: { knowledgeArea: true, evidence: true } } },
        orderBy: { generatedAt: 'desc' },
        take: 1,
      },
      evidence: true,
      documentationTasks: {
        include: { assignee: true, proposals: { include: { reviews: true } } },
      },
      auditEvents: { include: { actor: true }, orderBy: { occurredAt: 'asc' } },
    },
  });
}

export async function runAnalysis(changeId: string) {
  const change = await db.productChange.findUnique({
    where: { id: changeId },
    include: { commit: true, project: { include: { knowledgeAreas: true } }, evidence: true },
  });

  if (!change) throw new Error('Change not found');

  await db.productChange.update({ where: { id: changeId }, data: { status: 'analyzing' } });

  const engine = getKnowledgeEngine();
  const changedFiles = change.commit?.diff
    ? extractFilesFromDiff(change.commit.diff)
    : [];

  const result = await engine.analyzeChange({
    productChange: {
      id: change.id,
      title: change.title,
      description: change.description ?? undefined,
      changeType: change.changeType,
      commitMessage: change.commit?.message ?? '',
      diff: change.commit?.diff ?? undefined,
      changedFiles,
      additions: change.commit?.additions ?? 0,
      deletions: change.commit?.deletions ?? 0,
    },
    knowledgeAreas: change.project.knowledgeAreas.map((ka) => ({
      id: ka.id,
      slug: ka.slug,
      title: ka.title,
      description: ka.description ?? undefined,
    })),
  });

  // Save impact report
  const report = await db.impactReport.create({
    data: {
      productChangeId: changeId,
      changeSummary: result.changeSummary,
      userImpact: result.userImpact,
      confidence: result.overallConfidence,
      risks: JSON.stringify(result.risks),
      recommendedActions: JSON.stringify(result.recommendedActions),
      analysisMode: result.mode,
      items: {
        create: result.affectedAreas.map((a) => ({
          knowledgeAreaId: a.knowledgeAreaId,
          affectedStatus: a.affectedStatus,
          reasoning: a.reasoning,
          confidence: a.confidence,
        })),
      },
    },
  });

  await db.productChange.update({
    where: { id: changeId },
    data: { status: 'analyzed', analyzedAt: new Date() },
  });

  // Audit
  await db.auditEvent.create({
    data: {
      productChangeId: changeId,
      eventType: 'analysis_completed',
      summary: `Knowledge analysis completed — ${result.mode === 'demo' ? 'Demo Knowledge Analysis' : `Connected (${result.modelName})`}`,
      detail: JSON.stringify({ mode: result.mode, areasAnalyzed: result.affectedAreas.length }),
    },
  });

  return report;
}

function extractFilesFromDiff(diff: string): string[] {
  const fileRegex = /^diff --git a\/.+ b\/(.+)$/gm;
  const files: string[] = [];
  let match;
  while ((match = fileRegex.exec(diff)) !== null) {
    files.push(match[1]);
  }
  return files;
}
