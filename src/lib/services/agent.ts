// Thally — Agent Knowledge Service
import { db } from '@/lib/db';
import { getKnowledgeEngine } from '@/lib/providers';

export async function getAgentKnowledge(projectId: string) {
  return db.agentKnowledge.findFirst({
    where: { projectId, isActive: true },
    include: { chunks: true },
    orderBy: { indexedAt: 'desc' },
  });
}

export async function syncAgentKnowledge(projectId: string) {
  // Deactivate old knowledge
  await db.agentKnowledge.updateMany({
    where: { projectId, isActive: true },
    data: { isActive: false },
  });

  // Get all published pages
  const pages = await db.documentationPage.findMany({
    where: { projectId, status: 'published' },
  });

  // Create chunks from pages
  const chunks = pages.flatMap((page) => {
    const paragraphs = page.content.split('\n\n').filter((p) => p.trim().length > 0);
    return paragraphs.map((p, i) => ({
      pageSlug: page.slug,
      pageTitle: page.title,
      chunkIndex: i,
      content: p.replace(/^#+\s*/m, '').trim(),
    }));
  });

  const agentKnowledge = await db.agentKnowledge.create({
    data: {
      projectId,
      knowledgeVersion: '1.1.0',
      pagesIndexed: pages.length,
      chunksIndexed: chunks.length,
      provider: 'demo',
      isActive: true,
      chunks: { create: chunks },
    },
  });

  return agentKnowledge;
}

export async function queryAgentKnowledge(projectId: string, query: string) {
  const knowledge = await db.agentKnowledge.findFirst({
    where: { projectId, isActive: true },
    include: { chunks: true },
    orderBy: { indexedAt: 'desc' },
  });

  const engine = getKnowledgeEngine();

  if (!knowledge || knowledge.chunks.length === 0) {
    return engine.queryKnowledge({ query, chunks: [] });
  }

  return engine.queryKnowledge({
    query,
    chunks: knowledge.chunks.map((c) => ({
      pageSlug: c.pageSlug,
      pageTitle: c.pageTitle,
      content: c.content,
    })),
  });
}
