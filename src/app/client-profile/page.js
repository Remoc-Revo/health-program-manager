
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientProfile() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
     fetch(`/api/profile?clientId=${clientId}`)
        .then(res =>res.json())
        .then(data => setProfile(data));       
  }, [clientId]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Client Profile</h1>
     
      {profile && (
        <div className="mt-4 border p-4 rounded">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Programs:</strong></p>
          <ul className="list-disc pl-5">
            {profile.enrolledPrograms.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
