import db from '@/lib/db';

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get('clientId');

  if (!clientId) {
    return new Response('Client ID is required', { status: 400 });
  }

  const [rows] = await db.query(`
    SELECT 
      c.*, 
      p.id AS program_id, 
      p.name AS program_name
    FROM client c
    LEFT JOIN enrollment e ON c.id = e.client_id
    LEFT JOIN program p ON p.id = e.program_id
    WHERE c.id = ?
  `, [clientId]);

  if (!rows.length) {
    return new Response('Client not found', { status: 404 });
  }

  // Process to group enrolled programs
  const client = {
    id: rows[0].id,
    full_name: rows[0].full_name,
    email: rows[0].email,
    phone: rows[0].phone,
    enrolledPrograms: rows
      .filter(row => row.program_id !== null)
      .map(row => ({
        id: row.program_id,
        name: row.program_name,
      })),
  };

  return new Response(JSON.stringify(client), { status: 200 });
}
