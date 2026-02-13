import { memo, useCallback } from 'react';
import type { Filters } from '../types/user';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const departments = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance',
  'Design', 'Product', 'Operations', 'Legal', 'Customer Support',
];

const ageRanges = [
  { label: '20-29', value: '20-29' },
  { label: '30-39', value: '30-39' },
  { label: '40-49', value: '40-49' },
  { label: '50-64', value: '50-64' },
];

export const FilterBar = memo(function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleDepartment = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('department', e.target.value),
    [onFilterChange],
  );
  const handleActive = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('isActive', e.target.value),
    [onFilterChange],
  );
  const handleAge = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('ageRange', e.target.value),
    [onFilterChange],
  );

  const hasActiveFilters = filters.department || filters.isActive || filters.ageRange;

  const clearAll = useCallback(() => {
    onFilterChange('department', '');
    onFilterChange('isActive', '');
    onFilterChange('ageRange', '');
  }, [onFilterChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </span>

      <select value={filters.department} onChange={handleDepartment}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
        <option value="">All Departments</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <select value={filters.isActive} onChange={handleActive}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <select value={filters.ageRange} onChange={handleAge}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
        <option value="">All Ages</option>
        {ageRanges.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>

      {hasActiveFilters && (
        <button onClick={clearAll}
          className="px-3 py-2 text-sm text-red-400 hover:text-red-300 border border-red-800
                     hover:border-red-600 rounded-lg transition-all flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
});
