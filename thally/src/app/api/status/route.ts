import { NextResponse } from 'next/server';

let statusChecks: Array<{ id: string; client_name: string; timestamp: string }> = [
  { id: '1', client_name: 'thally-control-plane', timestamp: new Date().toISOString() }
];

export async function GET() {
  return NextResponse.json(statusChecks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCheck = {
      id: String(Date.now()),
      client_name: body.client_name || 'anonymous-client',
      timestamp: new Date().toISOString(),
    };
    statusChecks.unshift(newCheck);
    return NextResponse.json(newCheck, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
