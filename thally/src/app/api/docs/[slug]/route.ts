// GET /api/docs/[slug] — Get documentation page
import { db } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = await db.documentationPage.findFirst({
      where: { slug },
      include: { knowledgeArea: true },
    });

    if (!page) return Response.json({ error: 'Page not found' }, { status: 404 });
    return Response.json({ page });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
