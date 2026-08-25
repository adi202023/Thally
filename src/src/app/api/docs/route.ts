// GET /api/docs — List all documentation pages
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    const pages = await db.documentationPage.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(status ? { status } : {}),
      },
      include: { knowledgeArea: true },
      orderBy: [{ knowledgeArea: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });

    return Response.json({ pages });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
