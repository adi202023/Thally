export async function GET() {
  return Response.json({ message: 'Hello World', status: 'ok', time: new Date().toISOString() });
}
