'use client';

import { Stats } from '@/types';
import { HiTrendingUp, HiTrendingDown, HiCash } from 'react-icons/hi';

function formatMoney(amount: number) {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

export default function DashboardStats({ stats }: { stats: Stats | null }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Balance',
      value: formatMoney(stats.totalBalance),
      icon: HiCash,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Income',
      value: `+${formatMoney(stats.totalIncome)}`,
      icon: HiTrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Expense',
      value: `-${formatMoney(stats.totalExpense)}`,
      icon: HiTrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </div>
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
