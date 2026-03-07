export interface Account {
  id: number;
  name: string;
  type: string;
  currency: string;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
  accountId: number;
  accountName: string;
}

export interface Transfer {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  fromAccountName: string;
  toAccountName: string;
  amount: number;
  date: string;
}

export interface Stats {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  expenseByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}
