// GET /api/audit — Get audit events
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const changeId = searchParams.get('changeId') ?? undefined;
    const limit = parseInt(searchParams.get('limit') ?? '50');

    const events = await db.auditEvent.findMany({
      where: changeId ? { productChangeId: changeId } : undefined,
      include: { actor: true, productChange: true },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });

    return Response.json({ events });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch audit events' }, { status: 500 });
  }
}
