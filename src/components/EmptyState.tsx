interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-100 gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-1">No users found</h3>
        <p className="text-sm text-slate-500 mb-4">
          {hasFilters
            ? 'No users match your current filters. Try adjusting your search criteria.'
            : 'No users available at the moment.'}
        </p>
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm
                       font-medium rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
