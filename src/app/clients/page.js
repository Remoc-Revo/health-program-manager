'use client';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function Clients() {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrollingClientId, setEnrollingClientId] = useState(null);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchClients();
        fetchPrograms();
    }, []);

    const fetchClients = async () => {
        const res = await fetch('/api/clients');
        const data = await res.json();
        setClients(data);
    };

    const fetchPrograms = async () => {
        const res = await fetch('/api/programs');
        const data = await res.json();
        setPrograms(data);
    };

    const register = async () => {
        await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        });
        setForm({ full_name: '', email: '', phone: '' });
        await fetchClients();
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
        setOpenMenuId(null);
        setEnrollingClientId(null);
        toast.success('Client enrolled successfully!');
    };

    const viewProfile = (clientId) => {
        router.push(`/client-profile?id=${clientId}`);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() === '') {
        setSearchResults([]);
        return;
        }

        const results = clients.filter(c =>
        c.full_name.toLowerCase().includes(value.toLowerCase()) ||
        c.email.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(results);
    };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Header/>
      <Toaster position="top-right"/>
      <h1 className="text-xl font-bold mt-4 mb-4">Register Client</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Full Name"
        value={form.full_name}
        onChange={e => setForm({ ...form, full_name: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full mb-6"
        onClick={register}
      >
        Register
      </button>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Search Clients..."
          value={search}
          onChange={handleSearch}
        />

        {/* Floating Search Results */}
        {search.length > 0 && (
          <div className="absolute w-full bg-white border shadow rounded mt-1 max-h-60 overflow-y-auto z-10">
            {searchResults.length > 0 ? (
              searchResults.map(c => (
                <div key={c.id} className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                  <span>{c.full_name} - {c.email}</span>
                  <button
                    onClick={() => {
                      setOpenMenuId(c.id);
                      setSearch('');
                    }}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                  >
                    ⋮
                  </button>
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500">No matching clients</p>
            )}
          </div>
        )}
      </div>

      {/* Client List */}
      <ul className="mt-2">
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
                <div className="absolute right-1 mt-1 w-36 bg-white border rounded shadow-lg z-10">
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
