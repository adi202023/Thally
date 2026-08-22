// POST /api/changes/[id]/analyze — Trigger knowledge analysis
import { runAnalysis } from '@/lib/services/changes';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await runAnalysis(id);
    return Response.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
