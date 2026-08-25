// GET /api/changes/[id] — Get change detail
import { db } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const change = await db.productChange.findUnique({
      where: { id },
      include: {
        commit: true,
        project: true,
        repository: true,
        impactReports: {
          include: {
            items: { include: { knowledgeArea: true, evidence: true } },
          },
          orderBy: { generatedAt: 'desc' },
          take: 1,
        },
        evidence: { orderBy: { createdAt: 'asc' } },
        documentationTasks: {
          include: {
            assignee: true,
            proposals: {
              include: {
                reviews: { include: { reviewer: true } },
                previews: { orderBy: { createdAt: 'desc' }, take: 1 },
              },
            },
          },
        },
        auditEvents: {
          include: { actor: true },
          orderBy: { occurredAt: 'asc' },
        },
      },
    });

    if (!change) {
      return Response.json({ error: 'Change not found' }, { status: 404 });
    }

    return Response.json({ change });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch change' }, { status: 500 });
  }
}
