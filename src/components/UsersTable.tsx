import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { User, SortConfig, SortField } from '../types/user';
import { UserRow } from './UserRow';
import { TableHeader } from './TableHeader';
import { EmptyState } from './EmptyState';

interface UsersTableProps {
  users: User[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  onSelectUser: (user: User) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const ROW_HEIGHT = 56;

export function UsersTable({
  users, sortConfig, onSort, onSelectUser, hasFilters, onClearFilters,
}: UsersTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  });

  const handleSelectUser = useCallback(
    (user: User) => onSelectUser(user),
    [onSelectUser],
  );

  const virtualItems = rowVirtualizer.getVirtualItems();

  if (users.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="flex flex-col h-full border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
      <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-medium">{users.length.toLocaleString()}</span> users
        </span>
        <span className="text-xs text-slate-600">{virtualItems.length} rows in DOM</span>
      </div>

      <TableHeader sortConfig={sortConfig} onSort={onSort} />

      <div ref={parentRef} className="overflow-auto" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {virtualItems.map((virtualRow) => (
            <UserRow
              key={users[virtualRow.index].id}
              user={users[virtualRow.index]}
              index={virtualRow.index}
              size={virtualRow.size}
              start={virtualRow.start}
              onSelect={handleSelectUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
