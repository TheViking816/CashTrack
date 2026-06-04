import React, { useState } from 'react';
import { api } from '../services/api';
import { TransactionType, TransactionWithBalance } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  transaction: TransactionWithBalance;
  onChanged?: () => void;
}

const TransactionRow: React.FC<Props> = ({ transaction, onChanged }) => {
  const isDeposit = transaction.type === 'deposit';
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editAmount, setEditAmount] = useState(String(transaction.amount));
  const [editType, setEditType] = useState<TransactionType>(transaction.type);
  const [editDescription, setEditDescription] = useState(transaction.description || '');

  const date = new Date(transaction.created_at);
  const dateStr = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  const icon = isDeposit ? 'payments' : 'shopping_cart';
  const colorClass = isDeposit ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200';
  const bgClass = isDeposit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const iconColor = isDeposit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const amountPrefix = isDeposit ? '+' : '-';

  const resetEditState = () => {
    setEditAmount(String(transaction.amount));
    setEditType(transaction.type);
    setEditDescription(transaction.description || '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    const parsedAmount = Number(editAmount);
    if (!editAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Introduce un importe valido');
      return;
    }

    setIsSaving(true);
    const success = await api.updateTransaction(transaction.id, {
      amount: parsedAmount,
      type: editType,
      description: editDescription.trim() || (editType === 'deposit' ? 'Deposito' : 'Retiro'),
    });
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
      onChanged?.();
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Eliminar este registro? Esta accion no se puede deshacer.');
    if (!confirmed) return;

    setIsSaving(true);
    const success = await api.deleteTransaction(transaction.id);
    setIsSaving(false);

    if (success) {
      onChanged?.();
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-soft border border-primary/30 dark:border-primary/40">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            Tipo
            <select
              value={editType}
              onChange={(event) => setEditType(event.target.value as TransactionType)}
              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark text-sm font-semibold text-slate-900 dark:text-white"
            >
              <option value="deposit">Ingreso</option>
              <option value="withdrawal">Retiro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            Importe
            <input
              value={editAmount}
              onChange={(event) => setEditAmount(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark text-sm font-semibold text-slate-900 dark:text-white"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          Concepto
          <input
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark text-sm font-semibold text-slate-900 dark:text-white"
            placeholder="Concepto"
          />
        </label>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={resetEditState}
            disabled={isSaving}
            className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 px-4 rounded-xl bg-primary text-sm font-bold text-white shadow-glow disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center ${iconColor} ring-1 ring-inset ring-white/20`}>
          <span className="material-symbols-outlined text-2xl icon-filled">{icon}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 dark:text-white capitalize truncate">
            {transaction.description || (isDeposit ? 'Deposito' : 'Retiro')}
          </span>
          <span className="text-xs text-slate-500 font-medium capitalize">{dateStr}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
            Saldo tras movimiento: {formatCurrency(transaction.remaining_balance)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="min-w-[88px] text-right">
          <span className={`block font-extrabold ${colorClass}`}>
            {amountPrefix}{formatCurrency(Math.abs(transaction.amount))}
          </span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          disabled={isSaving}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25 disabled:opacity-50"
          aria-label="Editar registro"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={isSaving}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25 disabled:opacity-50"
          aria-label="Eliminar registro"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;
