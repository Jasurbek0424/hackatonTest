'use client';

import { useState, useEffect } from 'react';
import { Account, Transfer } from '@/types';
import { getAccounts, createTransfer, getTransfers } from '@/services/api';
import toast from 'react-hot-toast';

function formatMoney(amount: number) {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

export default function TransferForm() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    getAccounts().then(setAccounts);
    getTransfers().then(setTransfers);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId || !amount) {
      toast.error('Please fill all fields');
      return;
    }
    if (fromId === toId) {
      toast.error('Cannot transfer to same account');
      return;
    }
    setLoading(true);
    try {
      await createTransfer({
        fromAccountId: parseInt(fromId),
        toAccountId: parseInt(toId),
        amount: parseFloat(amount),
      });
      toast.success('Transfer completed!');
      setAmount('');
      loadData();
    } catch {
      toast.error('Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Account *</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select source</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name} - {formatMoney(a.balance)} {a.currency}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Account *</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select destination</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name} - {formatMoney(a.balance)} {a.currency}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Transferring...' : 'Transfer'}
        </button>
      </form>

      {transfers.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm max-w-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Transfers</h3>
          <div className="space-y-3">
            {transfers.slice(0, 10).map((t) => (
              <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="text-sm">
                  <span className="font-medium text-gray-800">{t.fromAccountName}</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="font-medium text-gray-800">{t.toAccountName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-600">{formatMoney(t.amount)}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
