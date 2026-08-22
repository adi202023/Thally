// POST /api/previews — Generate preview
import { generatePreview } from '@/lib/services/previews';

export async function POST(request: Request) {
  try {
    const { proposalId } = await request.json();
    const preview = await generatePreview(proposalId);
    return Response.json({ preview }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate preview';
    return Response.json({ error: message }, { status: 500 });
  }
}
