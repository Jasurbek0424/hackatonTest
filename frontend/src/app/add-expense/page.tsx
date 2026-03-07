'use client';

import ExpenseForm from '@/components/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
        <p className="text-sm text-gray-500 mt-1">Record a new expense transaction</p>
      </div>
      <ExpenseForm />
    </div>
  );
}
