import db from '@/lib/db';

export async function POST(req) {
  const { full_name, email, phone } = await req.json();
  await db.query('INSERT INTO client (full_name, email, phone) VALUES (?, ?, ?)', [full_name, email, phone]);
  return new Response('Client registered', { status: 201 });
}

export async function GET() {
  const [clients] = await db.query('SELECT * FROM client');
  return new Response(JSON.stringify(clients), { status: 200 });
}
