export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  avatar: string;
  phone: string;
  city: string;
}

export type SortField = 'firstName' | 'lastName' | 'email' | 'age' | 'department' | 'salary' | 'joinDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface Filters {
  search: string;
  department: string;
  isActive: string;
  ageRange: string;
}
