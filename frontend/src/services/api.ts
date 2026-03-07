import axios from 'axios';
import { Account, Transaction, Transfer, Stats, MonthlyStats } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Accounts
export const getAccounts = () => api.get<Account[]>('/accounts').then(r => r.data);
export const getAccount = (id: number) => api.get<Account>(`/accounts/${id}`).then(r => r.data);
export const createAccount = (data: Partial<Account>) => api.post<Account>('/accounts', data).then(r => r.data);
export const deleteAccount = (id: number) => api.delete(`/accounts/${id}`);

// Transactions
export const getTransactions = (params?: {
  type?: string;
  category?: string;
  from?: string;
  to?: string;
}) => api.get<Transaction[]>('/transactions', { params }).then(r => r.data);
export const createTransaction = (data: Partial<Transaction>) => api.post<Transaction>('/transactions', data).then(r => r.data);
export const deleteTransaction = (id: number) => api.delete(`/transactions/${id}`);

// Transfers
export const getTransfers = () => api.get<Transfer[]>('/transfers').then(r => r.data);
export const createTransfer = (data: Partial<Transfer>) => api.post<Transfer>('/transfers', data).then(r => r.data);

// Stats
export const getStats = () => api.get<Stats>('/stats').then(r => r.data);
export const getMonthlyStats = () => api.get<MonthlyStats[]>('/stats/monthly').then(r => r.data);

// AI
export const categorize = (description: string) =>
  api.post<{ category: string }>('/ai/categorize', { description }).then(r => r.data);
export const getAdvice = () =>
  api.post<{ advice: string }>('/ai/advice').then(r => r.data);
