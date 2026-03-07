'use client';

import IncomeForm from '@/components/IncomeForm';

export default function AddIncomePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Add Income</h2>
        <p className="text-sm text-gray-500 mt-1">Record a new income transaction</p>
      </div>
      <IncomeForm />
    </div>
  );
}
