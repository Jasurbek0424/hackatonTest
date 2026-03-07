'use client';

import { useEffect, useState } from 'react';
import { Stats, Transaction } from '@/types';
import { getStats, getTransactions, getAdvice } from '@/services/api';
import DashboardStats from '@/components/DashboardStats';
import CategoryPieChart from '@/components/CategoryPieChart';
import RecentTransactions from '@/components/RecentTransactions';
import { HiSparkles } from 'react-icons/hi';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);

  useEffect(() => {
    getStats().then(setStats);
    getTransactions().then(setTransactions);
  }, []);

  const handleAdvice = async () => {
    setAdviceLoading(true);
    try {
      const result = await getAdvice();
      setAdvice(result.advice);
    } catch {
      setAdvice('Failed to get advice. Check API key.');
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Your financial overview</p>
        </div>
        <button
          onClick={handleAdvice}
          disabled={adviceLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
        >
          <HiSparkles className="w-4 h-4" />
          {adviceLoading ? 'Getting advice...' : 'AI Financial Advice'}
        </button>
      </div>

      {advice && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <HiSparkles className="w-4 h-4" /> AI Financial Advice
          </h3>
          <p className="text-sm text-purple-700 whitespace-pre-line">{advice}</p>
        </div>
      )}

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={stats?.expenseByCategory || {}} title="Expenses by Category" />
        <CategoryPieChart data={stats?.incomeByCategory || {}} title="Income by Category" />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
