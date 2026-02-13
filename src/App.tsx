import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useUserStore } from './store/userStore';
import { useDebounce } from './hooks/useDebounce';
import { useFilteredUsers } from './hooks/useFilteredUsers';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { UsersTable } from './components/UsersTable';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import type { Filters } from './types/user';

const LazyUserModal = lazy(() =>
  import('./components/UserModal').then((m) => ({ default: m.UserModal })),
);

type StoreState = ReturnType<typeof useUserStore.getState>;

const selectUsers = (s: StoreState) => s.users;
const selectIsLoading = (s: StoreState) => s.isLoading;
const selectError = (s: StoreState) => s.error;
const selectFilters = (s: StoreState) => s.filters;
const selectSortConfig = (s: StoreState) => s.sortConfig;
const selectSelectedUser = (s: StoreState) => s.selectedUser;
const selectIsModalOpen = (s: StoreState) => s.isModalOpen;
const selectIsSaving = (s: StoreState) => s.isSaving;
const selectSaveError = (s: StoreState) => s.saveError;
const selectLoadUsers = (s: StoreState) => s.loadUsers;
const selectSetFilter = (s: StoreState) => s.setFilter;
const selectSetSort = (s: StoreState) => s.setSort;
const selectSelectUser = (s: StoreState) => s.selectUser;
const selectCloseModal = (s: StoreState) => s.closeModal;
const selectUpdateUser = (s: StoreState) => s.updateUser;

function App() {
  const users = useUserStore(selectUsers);
  const isLoading = useUserStore(selectIsLoading);
  const error = useUserStore(selectError);
  const filters = useUserStore(selectFilters);
  const sortConfig = useUserStore(selectSortConfig);
  const selectedUser = useUserStore(selectSelectedUser);
  const isModalOpen = useUserStore(selectIsModalOpen);
  const isSaving = useUserStore(selectIsSaving);
  const saveError = useUserStore(selectSaveError);
  const loadUsers = useUserStore(selectLoadUsers);
  const setFilter = useUserStore(selectSetFilter);
  const setSort = useUserStore(selectSetSort);
  const selectUser = useUserStore(selectSelectUser);
  const closeModal = useUserStore(selectCloseModal);
  const updateUser = useUserStore(selectUpdateUser);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilter('search', debouncedSearch);
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useFilteredUsers(users, filters, debouncedSearch, sortConfig);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setFilter('search', '');
    setFilter('department', '');
    setFilter('isActive', '');
    setFilter('ageRange', '');
  }, [setFilter]);

  const hasActiveFilters = Boolean(
    searchInput || filters.department || filters.isActive || filters.ageRange,
  );

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: string) => setFilter(key, value),
    [setFilter],
  );

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <ErrorState message={error} onRetry={loadUsers} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm z-20">
        <div style={{ maxWidth: 1600 }} className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Users Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Managing {users.length.toLocaleString()} users with real-time performance analytics
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">
                {filteredUsers.length.toLocaleString()} results
              </span>
            </div>
          </div>

          <SearchBar value={searchInput} onChange={setSearchInput} />

          <div className="mt-3">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1600 }} className="flex-1 w-full mx-auto px-6 py-4 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col">
          <UsersTable
            users={filteredUsers}
            sortConfig={sortConfig}
            onSort={setSort}
            onSelectUser={selectUser}
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>

      {selectedUser && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <LazyUserModal
            user={selectedUser}
            isOpen={isModalOpen}
            isSaving={isSaving}
            saveError={saveError}
            onClose={closeModal}
            onSave={updateUser}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
