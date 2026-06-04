import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionRow from '../components/TransactionRow';
import { api } from '../services/api';
import { isSupabaseConfigured, supabase } from '../supabaseClient';
import { TransactionWithBalance } from '../types';
import { formatCurrency, formatCurrencyParts } from '../utils/format';
import { withRemainingBalance } from '../utils/transactions';
import logo from '../assets/logo-mark.svg';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<TransactionWithBalance[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedBalance, fetchedTransactions] = await Promise.all([
                api.getBalance(),
                api.getTransactions(),
            ]);
            setBalance(fetchedBalance);
            setTransactions(withRemainingBalance(fetchedTransactions).slice(0, 50));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSignOut = async () => {
        if (!isSupabaseConfigured || !supabase) {
            window.localStorage.removeItem('cashtrack-local-mode');
            window.location.reload();
            return;
        }

        try {
            await supabase.auth.signOut({ scope: 'local' });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const summary = useMemo(() => {
        return transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'deposit') {
                    acc.income += Number(transaction.amount);
                } else {
                    acc.expense += Number(transaction.amount);
                }
                return acc;
            },
            { income: 0, expense: 0 }
        );
    }, [transactions]);

    const balanceParts = formatCurrencyParts(balance);
    const storageLabel = isSupabaseConfigured ? 'Sincronizado' : 'Modo local';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(25,127,230,0.32),transparent_34%),radial-gradient(circle_at_10%_20%,rgba(20,184,166,0.18),transparent_28%)]"></div>

            <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={logo} alt="CashTrack" className="h-11 w-11 rounded-2xl shadow-glow" />
                        <div className="min-w-0">
                            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-white">CashTrack</h1>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-200">
                                <span className="h-2 w-2 rounded-full bg-teal-300"></span>
                                {storageLabel}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors text-slate-200"
                        aria-label="Cerrar sesion"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>

            <main className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pt-5 gap-5">
                <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-600 via-primary to-teal-500 p-6 shadow-[0_24px_70px_-28px_rgba(25,127,230,0.9)]">
                    <div className="absolute inset-x-0 -bottom-24 h-44 bg-white/15 blur-3xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold uppercase tracking-wider text-white/75">Saldo actual</p>
                            <span className="material-symbols-outlined icon-filled text-white/80">account_balance_wallet</span>
                        </div>
                        <div className="mt-5 flex items-baseline gap-1">
                            <span className="text-white font-extrabold text-5xl tracking-tight">
                                {loading ? '...' : balanceParts.whole}
                            </span>
                            <span className="text-white/80 font-bold text-2xl">
                                ,{loading ? '00' : balanceParts.fraction}€
                            </span>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white/15 px-3 py-3 ring-1 ring-white/15">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-white/65">Entradas</p>
                                <p className="mt-1 text-sm font-extrabold text-white">{formatCurrency(summary.income)}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-950/20 px-3 py-3 ring-1 ring-white/10">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-white/65">Salidas</p>
                                <p className="mt-1 text-sm font-extrabold text-white">{formatCurrency(summary.expense)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate('/add-funds')}
                        className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-white text-slate-950 font-extrabold shadow-soft transition-transform active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined icon-filled text-primary">add_circle</span>
                        <span>Ingresar</span>
                    </button>
                    <button
                        onClick={() => navigate('/withdraw')}
                        className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white font-extrabold ring-1 ring-white/10 transition-transform active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined icon-filled text-red-300">remove_circle</span>
                        <span>Retirar</span>
                    </button>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-white">Movimientos</h2>
                            <p className="text-xs font-semibold text-slate-400">Con remanente tras cada registro</p>
                        </div>
                        <button
                            onClick={loadData}
                            className="flex h-10 items-center gap-1 rounded-xl bg-white/10 px-3 text-sm font-bold text-blue-100 hover:bg-white/15"
                        >
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Refrescar
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {loading ? (
                            <div className="p-5 text-center text-slate-400 rounded-2xl bg-white/5 ring-1 ring-white/10">
                                Cargando movimientos...
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center bg-white/95 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">receipt_long</span>
                                <p className="font-bold text-slate-700 dark:text-slate-200">No hay movimientos aun</p>
                                <p className="mt-1 text-sm text-slate-500">Anade tu primer ingreso o retiro.</p>
                            </div>
                        ) : (
                            transactions.map((t) => <TransactionRow key={t.id} transaction={t} onChanged={loadData} />)
                        )}
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button className="flex flex-col items-center gap-1 w-20 text-blue-300">
                        <span className="material-symbols-outlined icon-filled">home</span>
                        <span className="text-[10px] font-extrabold">Inicio</span>
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="flex flex-col items-center gap-1 w-20 text-slate-500 hover:text-blue-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">history</span>
                        <span className="text-[10px] font-bold">Historial</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
