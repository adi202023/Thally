// GET /api/agent/knowledge — Get agent knowledge status
// POST /api/agent/knowledge — Sync agent knowledge
import { getAgentKnowledge, syncAgentKnowledge } from '@/lib/services/agent';
import { db } from '@/lib/db';

const DEFAULT_PROJECT_ID = 'project-demo-001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') ?? DEFAULT_PROJECT_ID;
    const knowledge = await getAgentKnowledge(projectId);
    return Response.json({ knowledge });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    const knowledge = await syncAgentKnowledge(projectId ?? DEFAULT_PROJECT_ID);

    await db.auditEvent.create({
      data: {
        eventType: 'agent_knowledge_synchronized',
        summary: `Agent knowledge synchronized — ${knowledge.chunksIndexed} chunks indexed from ${knowledge.pagesIndexed} pages`,
        detail: JSON.stringify({ knowledgeVersion: knowledge.knowledgeVersion }),
      },
    });

    return Response.json({ knowledge }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Sync failed' }, { status: 500 });
  }
}
