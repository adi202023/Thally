// POST /api/agent/query — Query agent knowledge
import { queryAgentKnowledge } from '@/lib/services/agent';

export async function POST(request: Request) {
  try {
    const { query, projectId } = await request.json();
    if (!query) return Response.json({ error: 'Query is required' }, { status: 400 });

    const result = await queryAgentKnowledge(projectId ?? 'project-demo-001', query);
    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }
}
