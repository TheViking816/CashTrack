import { Transaction, TransactionWithBalance } from '../types';

const transactionDelta = (transaction: Transaction): number => {
  return transaction.type === 'deposit' ? Number(transaction.amount) : -Number(transaction.amount);
};

export const withRemainingBalance = (transactions: Transaction[]): TransactionWithBalance[] => {
  const sorted = [...transactions].sort((a, b) => {
    const dateDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return dateDiff || a.id.localeCompare(b.id);
  });

  const balances = new Map<string, number>();
  let runningBalance = 0;

  for (const transaction of sorted) {
    runningBalance += transactionDelta(transaction);
    balances.set(transaction.id, runningBalance);
  }

  return transactions.map((transaction) => ({
    ...transaction,
    remaining_balance: balances.get(transaction.id) ?? 0,
  }));
};
