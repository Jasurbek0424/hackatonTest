'use client';

import { Account } from '@/types';
import { HiCreditCard, HiCash, HiTrash } from 'react-icons/hi';

function formatMoney(amount: number, currency: string) {
  if (currency === 'USD') return `$${new Intl.NumberFormat('en-US').format(amount)}`;
  return `${new Intl.NumberFormat('uz-UZ').format(amount)} so'm`;
}

interface Props {
  account: Account;
  onDelete: (id: number) => void;
}

export default function AccountCard({ account, onDelete }: Props) {
  const isCard = account.type === 'CARD';

  return (
    <div className={`relative rounded-xl p-5 text-white shadow-md ${
      isCard ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
    }`}>
      <button
        onClick={() => onDelete(account.id)}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
      >
        <HiTrash className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 mb-4">
        {isCard ? <HiCreditCard className="w-6 h-6" /> : <HiCash className="w-6 h-6" />}
        <span className="text-sm font-medium opacity-90">{account.type}</span>
      </div>
      <p className="text-2xl font-bold">{formatMoney(account.balance, account.currency)}</p>
      <p className="text-sm opacity-80 mt-1">{account.name}</p>
      <p className="text-xs opacity-60 mt-0.5">{account.currency}</p>
    </div>
  );
}
