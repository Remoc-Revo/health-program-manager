import db from '@/lib/db';

export async function POST(req) {
    const { clientId, programId } = await req.json();
  
    // Check if the enrollment already exists
    const [existing] = await db.query(
      'SELECT * FROM enrollment WHERE client_id = ? AND program_id = ?',
      [clientId, programId]
    );
  
    if (existing.length > 0) {
      return new Response('Client already enrolled in this program', { status: 409 });
    }
  
    // Proceed to insert if not found
    await db.query(
      'INSERT INTO enrollment (client_id, program_id) VALUES (?, ?)',
      [clientId, programId]
    );
  
    return new Response('Client enrolled', { status: 201 });
  }
  