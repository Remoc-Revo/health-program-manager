'use client';
import { useEffect, useState } from 'react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);

  const register = async () => {
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ full_name: '', email: '', phone: '' });
    const res = await fetch('/api/clients');
    setClients(await res.json());
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Register Client</h1>
      <input className="border p-2 w-full mb-2" placeholder="Full Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={register}>Register</button>
      <ul className="mt-4">
        {clients.map(c => (
          <li key={c.id} className="border p-2 my-1">{c.full_name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}