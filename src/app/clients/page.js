'use client';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrollingClientId, setEnrollingClientId] = useState(null);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data));

    fetch('/api/programs')
      .then(res => res.json())
      .then(data => setPrograms(data));
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

  const enrollClient = async (clientId, programId) => {
    setLoading(true);
    setEnrollingClientId(clientId);
    await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, programId }),
    });
    setLoading(false);
    setOpenMenuId(null); // Close menu after enrolling
    setEnrollingClientId(null);
    toast.success('Client enrolled successfully!');
  };

  const viewProfile = (clientId) => {
    alert(`Viewing profile for Client ID: ${clientId}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
        <Toaster position="top-right"/>
        <h1 className="text-xl font-bold mb-4">Register Client</h1>
        <input className="border p-2 w-full mb-2" placeholder="Full Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={register}>Register</button>

        <ul className="mt-6">
            {clients.map(c => (
            <li key={c.id} className="border p-2 my-2 flex justify-between items-center">
                <span>{c.full_name} - {c.email}</span>
                <div className="relative">
                <button
                    onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                >
                    {openMenuId === c.id ? <span>&hellip;</span> : <span>&#8942;</span>}
                </button>

                {/* Floating menu */}
                {openMenuId === c.id && (
                    <div className="absolute right-1 mt-1 w-30 bg-white border rounded shadow-lg z-10">
                    <button
                        onClick={() => viewProfile(c.id)}
                        className="block w-full text-left p-2 hover:bg-gray-100"
                    >
                        View Profile
                    </button>

                    <div className="border-t"></div>

                    {loading && enrollingClientId === c.id ? (
                        <div className="p-2 text-center text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500 mx-auto"></div>
                        Enrolling...
                        </div>
                    ) : programs.length > 0 ? (
                        programs.map(p => (
                        <button
                            key={p.id}
                            className="block w-full text-left p-2 hover:bg-gray-100 text-sm"
                            onClick={() => enrollClient(c.id, p.id)}
                        >
                            Enroll to {p.name}
                        </button>
                        ))
                    ) : (
                        <p className="p-2 text-gray-500 text-sm">No Programs Yet</p>
                    )}
                    </div>
                )}
                </div>
            </li>
            ))}
        </ul>
    </div>
  );
}
