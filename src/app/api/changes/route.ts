// GET /api/changes — List product changes
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') ?? undefined;

    const changes = await db.productChange.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        commit: true,
        project: true,
        _count: { select: { evidence: true, documentationTasks: true } },
      },
      orderBy: { detectedAt: 'desc' },
    });

    return Response.json({ changes });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch changes' }, { status: 500 });
  }
}
