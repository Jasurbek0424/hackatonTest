import { create } from 'zustand';
import type { User, SortConfig, Filters } from '../types/user';

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  sortConfig: SortConfig;
  selectedUser: User | null;
  isModalOpen: boolean;
  isSaving: boolean;
  saveError: string | null;

  loadUsers: () => Promise<void>;
  setFilter: (key: keyof Filters, value: string) => void;
  setSort: (field: SortConfig['field']) => void;
  selectUser: (user: User | null) => void;
  closeModal: () => void;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  filters: { search: '', department: '', isActive: '', ageRange: '' },
  sortConfig: { field: 'firstName', direction: 'asc' },
  selectedUser: null,
  isModalOpen: false,
  isSaving: false,
  saveError: null,

  loadUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await new Promise<User[]>((resolve, reject) => {
        const worker = new Worker(
          new URL('../workers/generateUsers.worker.ts', import.meta.url),
          { type: 'module' },
        );
        worker.onmessage = (e: MessageEvent<User[]>) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.onerror = (err) => {
          reject(new Error(err.message));
          worker.terminate();
        };
        worker.postMessage({ count: 10_000 });
      });
      set({ users, isLoading: false });
    } catch {
      set({ error: 'Failed to load users. Please try again.', isLoading: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  setSort: (field) => {
    set((state) => ({
      sortConfig: {
        field,
        direction:
          state.sortConfig.field === field && state.sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc',
      },
    }));
  },

  selectUser: (user) => {
    set({ selectedUser: user, isModalOpen: true, saveError: null });
  },

  closeModal: () => {
    set({ isModalOpen: false, selectedUser: null, saveError: null });
  },

  updateUser: async (userId, updates) => {
    const { users, selectedUser } = get();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return false;

    const originalUser = users[userIndex];
    const updatedUser = { ...originalUser, ...updates };

    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    set({
      users: newUsers,
      selectedUser: selectedUser?.id === userId ? updatedUser : selectedUser,
      isSaving: true,
      saveError: null,
    });

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.3) {
            reject(new Error('Server error: Failed to save changes'));
          } else {
            resolve(true);
          }
        }, 800);
      });

      set({ isSaving: false });
      return true;
    } catch (err) {
      const rollbackUsers = [...get().users];
      const idx = rollbackUsers.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        rollbackUsers[idx] = originalUser;
      }
      set({
        users: rollbackUsers,
        selectedUser: selectedUser?.id === userId ? originalUser : get().selectedUser,
        isSaving: false,
        saveError: err instanceof Error ? err.message : 'Failed to save',
      });
      return false;
    }
  },
}));
