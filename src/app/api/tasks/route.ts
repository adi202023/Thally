// POST /api/tasks — Create documentation task
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productChangeId, title, description, priority, affectedPages, acceptanceCriteria, assigneeId } = body;

    const task = await db.documentationTask.create({
      data: {
        productChangeId,
        assigneeId,
        title,
        description,
        priority: priority ?? 'high',
        status: 'open',
        affectedPages: JSON.stringify(affectedPages ?? []),
        acceptanceCriteria: JSON.stringify(acceptanceCriteria ?? []),
      },
      include: { assignee: true },
    });

    await db.auditEvent.create({
      data: {
        productChangeId,
        eventType: 'task_created',
        summary: `Documentation task created: ${title}`,
        detail: JSON.stringify({ taskId: task.id, priority }),
      },
    });

    await db.productChange.update({ where: { id: productChangeId }, data: { status: 'task_created' } });

    return Response.json({ task }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const changeId = searchParams.get('changeId') ?? undefined;

    const tasks = await db.documentationTask.findMany({
      where: changeId ? { productChangeId: changeId } : undefined,
      include: { assignee: true, _count: { select: { proposals: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ tasks });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
