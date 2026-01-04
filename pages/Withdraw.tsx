import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency, formatCurrencyFromInput } from '../utils/format';

const Withdraw: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [balance, setBalance] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.getBalance().then(setBalance);
    }, []);

    const handleMax = () => setAmount(balance.toString());

    const handleConfirm = async () => {
        const val = Number(amount);
        if (!amount || isNaN(val) || val <= 0) return;
        if (val > balance) {
            alert('Fondos insuficientes');
            return;
        }

        setIsSubmitting(true);
        const description = note.trim() || 'Retiro de Efectivo';
        const success = await api.addTransaction(val, 'withdrawal', description);
        setIsSubmitting(false);

        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display antialiased selection:bg-primary selection:text-white min-h-screen">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-background-dark shadow-2xl border-x border-slate-100 dark:border-slate-800">
                <header className="flex items-center justify-between p-4 pt-6 sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Retirar Efectivo</h2>
                    <div className="size-10"></div>
                </header>
                <section className="flex flex-col items-center justify-center pt-6 pb-8 px-4">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Monto a retirar</span>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <input
                            autoFocus
                            className="w-48 bg-transparent text-center text-6xl font-extrabold text-slate-900 dark:text-white border-none focus:ring-0 p-0 placeholder-slate-200 dark:placeholder-slate-700 caret-primary"
                            placeholder="0.00"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="text-slate-300 dark:text-slate-600 text-5xl font-extrabold ml-1">€</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                        <span className="text-sm font-medium">Disponible: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(balance)}</span></span>
                        <button 
                            onClick={handleMax}
                            className="ml-1 text-xs font-bold text-primary hover:text-blue-600 uppercase"
                        >
                            Max
                        </button>
                    </div>
                </section>
                <section className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-850 rounded-t-[2.5rem] px-6 pt-8 pb-32 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Detalles</h3>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-background-dark rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined icon-filled">payments</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-900 dark:text-white font-bold text-base">Efectivo Físico</span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Se descontará del saldo disponible</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="note">Nota / Concepto</label>
                            <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 resize-none shadow-sm" 
                                id="note" 
                                placeholder="Opcional: ¿Para qué es este retiro?" 
                                rows={3}
                            ></textarea>
                        </div>
                    </div>
                </section>
                <div className="fixed bottom-0 left-0 right-0 z-20 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Total a retirar</span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrencyFromInput(amount)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleConfirm}
                        disabled={isSubmitting || !amount}
                        className={`group w-full overflow-hidden rounded-2xl bg-primary hover:bg-blue-600 transition-all duration-300 shadow-glow hover:shadow-lg hover:-translate-y-0.5 ${isSubmitting || !amount ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="relative z-10 flex h-14 w-full items-center justify-center gap-2 px-4">
                            <span className="text-white text-base font-bold tracking-wide">
                                {isSubmitting ? 'Procesando...' : 'Confirmar Retiro'}
                            </span>
                            <span className="material-symbols-outlined text-white text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
