// POST /api/previews/[id]/merge — Merge preview to production
import { mergePreview } from '@/lib/services/previews';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { actorId } = await request.json();
    const deployment = await mergePreview(id, actorId ?? 'user-demo');
    return Response.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Merge failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
