import React from 'react';
import { formatCurrency } from '../utils/format';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

const TransactionRow: React.FC<Props> = ({ transaction }) => {
  const isDeposit = transaction.type === 'deposit';
  
  // Format date
  const date = new Date(transaction.created_at);
  const dateStr = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  const icon = isDeposit ? 'payments' : 'shopping_cart';
  const colorClass = isDeposit ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200';
  const bgClass = isDeposit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const iconColor = isDeposit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const amountPrefix = isDeposit ? '+' : '-';

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 dark:text-white capitalize">
            {transaction.description || (isDeposit ? 'Depósito' : 'Retiro')}
          </span>
          <span className="text-xs text-slate-500 font-medium capitalize">{dateStr}</span>
        </div>
      </div>
      <span className={`font-bold ${colorClass}`}>
        {amountPrefix}{formatCurrency(Math.abs(transaction.amount))}
      </span>
    </div>
  );
};

export default TransactionRow;
