export type TransactionType = 'deposit' | 'withdrawal';

export interface Transaction {
  id: string;
  user_id: string;
  created_at: string;
  amount: number;
  type: TransactionType;
  description: string;
}

export interface TransactionWithBalance extends Transaction {
  remaining_balance: number;
}

export interface BalanceState {
  total: number;
  loading: boolean;
}
