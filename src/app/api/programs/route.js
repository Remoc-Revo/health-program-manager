import db from '@/lib/db';

//register new program
export async function POST(req) {
  const { name } = await req.json();
  await db.query('INSERT INTO program (name) VALUES (?)', [name]);
  return new Response('Program created', { status: 201 });
}

//fetch existing programs
export async function GET() {
  const [programs] = await db.query('SELECT * FROM program');
  return new Response(JSON.stringify(programs), { status: 200 });
}
