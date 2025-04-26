'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const links = [
    // { href: '/', label: 'Home' },
    { href: '/clients', label: 'Clients' },
    { href: '/programs', label: 'Programs' },
  ];

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="text-xl font-bold">Health Program Manager</div>
      <nav className="flex gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === href ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
