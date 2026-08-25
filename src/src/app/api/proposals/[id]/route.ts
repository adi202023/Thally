// GET /api/proposals/[id] — Get proposal
import { getProposal } from '@/lib/services/proposals';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const proposal = await getProposal(id);
    if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ proposal });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}
