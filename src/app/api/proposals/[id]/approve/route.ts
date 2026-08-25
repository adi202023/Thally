// POST /api/proposals/[id]/approve
import { approveProposal } from '@/lib/services/proposals';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { actorId, comment } = await request.json();
    await approveProposal(id, actorId ?? 'user-demo', comment);
    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Approval failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
