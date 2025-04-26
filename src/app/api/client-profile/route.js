import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');


  let searchField, searchValue;

if (id) {
  searchField = 'id';
  searchValue = id;
} else if (email) {
  searchField = 'email';
  searchValue = email;
} else if (phone) {
  searchField = 'phone';
  searchValue = phone;
} else {
  return new Response('Missing search parameter', { status: 400 });
}

const [clientData] = await db.query(
  `SELECT * FROM client WHERE ${searchField} = ?`,
  [searchValue]
);

  // Fetch enrolled programs
  const clientId = clientData[0].id;
  const [programs] = await db.query(
    `SELECT p.* FROM program p 
     JOIN enrollment e ON p.id = e.program_id 
     WHERE e.client_id = ?`,
    [clientId]
  );

  const profile = {
    ...clientData[0],
    enrolledPrograms: programs,
  };

  return new Response(JSON.stringify(profile), { status: 200 });
}
