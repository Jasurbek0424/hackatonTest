import { memo, useCallback } from 'react';
import type { SortConfig, SortField } from '../types/user';

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

interface ColumnDef {
  field: SortField | null;
  label: string;
  width: string;
  align?: string;
}

const columns: ColumnDef[] = [
  { field: 'firstName', label: 'Name', width: 'w-[220px] min-w-[220px]' },
  { field: 'email', label: 'Email', width: 'w-[250px] min-w-[250px]' },
  { field: 'department', label: 'Department', width: 'w-[150px] min-w-[150px]' },
  { field: 'age', label: 'Age', width: 'w-[70px] min-w-[70px]', align: 'text-center' },
  { field: 'salary', label: 'Salary', width: 'w-[120px] min-w-[120px]' },
  { field: null, label: 'Score', width: 'w-[130px] min-w-[130px]' },
  { field: null, label: 'Status', width: 'w-[90px] min-w-[90px]', align: 'text-center' },
  { field: null, label: 'City', width: 'flex-1' },
];

function SortIcon({ field, sortConfig }: { field: SortField | null; sortConfig: SortConfig }) {
  if (!field) return null;

  const isActive = sortConfig.field === field;

  return (
    <span className={`ml-1 inline-flex ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
      {isActive && sortConfig.direction === 'asc' ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : isActive && sortConfig.direction === 'desc' ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )}
    </span>
  );
}

export const TableHeader = memo(function TableHeader({ sortConfig, onSort }: TableHeaderProps) {
  const handleSort = useCallback(
    (field: SortField | null) => {
      if (field) onSort(field);
    },
    [onSort],
  );

  return (
    <div className="flex items-center px-4 py-3 bg-slate-800/80 border-b border-slate-700 sticky top-0 z-10">
      {columns.map((col) => (
        <div
          key={col.label}
          className={`${col.width} ${col.align || ''} text-xs font-semibold text-slate-400 uppercase tracking-wider
                      ${col.field ? 'cursor-pointer hover:text-slate-200 select-none transition-colors' : ''} px-2 first:pl-0`}
          onClick={() => handleSort(col.field)}
        >
          <span className="inline-flex items-center">
            {col.label}
            <SortIcon field={col.field} sortConfig={sortConfig} />
          </span>
        </div>
      ))}
    </div>
  );
});
