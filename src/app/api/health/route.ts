// GET /api/health — Production health check
import { db } from '@/lib/db';
import { config } from '@/lib/config';

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.1.0',
      mode: config.demo.enabled ? 'demo' : 'connected',
      services: {
        database: 'ok',
        ai: config.demo.enabled ? 'demo' : config.ai.provider,
        repository: config.demo.enabled ? 'demo' : 'github',
        deployment: config.demo.enabled ? 'demo' : config.deployment.provider,
      },
    });
  } catch (error) {
    return Response.json({ status: 'error', error: 'Database unavailable' }, { status: 503 });
  }
}
