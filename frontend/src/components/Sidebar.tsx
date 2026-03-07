'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiCreditCard, HiArrowDown, HiArrowUp, HiSwitchHorizontal } from 'react-icons/hi';

const links = [
  { href: '/', label: 'Dashboard', icon: HiHome },
  { href: '/accounts', label: 'Accounts', icon: HiCreditCard },
  { href: '/add-expense', label: 'Add Expense', icon: HiArrowDown },
  { href: '/add-income', label: 'Add Income', icon: HiArrowUp },
  { href: '/transfers', label: 'Transfers', icon: HiSwitchHorizontal },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-indigo-600">FinPilot</h1>
        <p className="text-xs text-gray-400 mt-1">Personal Finance Manager</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
