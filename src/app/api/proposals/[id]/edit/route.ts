// POST /api/proposals/[id]/edit
import { editProposal } from '@/lib/services/proposals';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { content, actorId } = await request.json();
    await editProposal(id, content, actorId ?? 'user-demo');
    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Edit failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
