import { useMemo } from 'react';
import type { User, SortConfig, Filters } from '../types/user';

export function useFilteredUsers(
  users: User[],
  filters: Filters,
  debouncedSearch: string,
  sortConfig: SortConfig,
): User[] {
  return useMemo(() => {
    let result = users;

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.city.toLowerCase().includes(searchLower),
      );
    }

    if (filters.department) {
      result = result.filter((user) => user.department === filters.department);
    }

    if (filters.isActive !== '') {
      const isActive = filters.isActive === 'true';
      result = result.filter((user) => user.isActive === isActive);
    }

    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split('-').map(Number);
      result = result.filter((user) => user.age >= min && user.age <= max);
    }

    result = [...result].sort((a, b) => {
      const field = sortConfig.field;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return 0;
    });

    return result;
  }, [users, debouncedSearch, filters.department, filters.isActive, filters.ageRange, sortConfig]);
}
