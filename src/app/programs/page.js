'use client';
import { useEffect, useState } from 'react';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => setPrograms(data));
  }, []);

  const createProgram = async () => {
    await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    const res = await fetch('/api/programs');
    setPrograms(await res.json());
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Health Programs</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Program Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={createProgram}>Add Program</button>
      <ul className="mt-4">
        {programs.map(p => (
          <li key={p.id} className="border p-2 my-1">{p.name}</li>
        ))}
      </ul>
    </div>
  );
}