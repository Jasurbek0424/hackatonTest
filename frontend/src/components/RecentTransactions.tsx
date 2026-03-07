'use client';

import { Transaction } from '@/types';

function formatMoney(amount: number) {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${tx.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.description || tx.category}</p>
                  <p className="text-xs text-gray-400">{tx.accountName} &middot; {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatMoney(tx.amount)}
                </p>
                <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mt-0.5">
                  {tx.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
