// POST /api/proposals/[id]/reject
import { rejectProposal } from '@/lib/services/proposals';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { actorId, reason } = await request.json();
    if (!reason) return Response.json({ error: 'Rejection reason is required' }, { status: 400 });
    await rejectProposal(id, actorId ?? 'user-demo', reason);
    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Rejection failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
