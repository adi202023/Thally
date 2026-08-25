// GET /api/previews/[id] — Get preview
import { getPreview } from '@/lib/services/previews';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const preview = await getPreview(id);
    if (!preview) return Response.json({ error: 'Preview not found' }, { status: 404 });
    return Response.json({ preview });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
