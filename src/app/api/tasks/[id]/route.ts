// GET /api/tasks/[id] — Get task with proposals
import { db } from '@/lib/db';
import { generateProposal } from '@/lib/services/proposals';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const task = await db.documentationTask.findUnique({
      where: { id },
      include: {
        assignee: true,
        productChange: { include: { commit: true } },
        proposals: {
          include: {
            reviews: { include: { reviewer: true } },
            previews: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
          orderBy: { generatedAt: 'desc' },
        },
      },
    });

    if (!task) return Response.json({ error: 'Task not found' }, { status: 404 });
    return Response.json({ task });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// POST /api/tasks/[id] — Generate proposal for task
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const proposal = await generateProposal(id);
    return Response.json({ proposal }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate proposal';
    return Response.json({ error: message }, { status: 500 });
  }
}
