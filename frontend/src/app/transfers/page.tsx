'use client';

import TransferForm from '@/components/TransferForm';

export default function TransfersPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Transfers</h2>
        <p className="text-sm text-gray-500 mt-1">Transfer money between accounts</p>
      </div>
      <TransferForm />
    </div>
  );
}
