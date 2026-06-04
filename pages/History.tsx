import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionRow from '../components/TransactionRow';
import { api } from '../services/api';
import { TransactionWithBalance } from '../types';
import { withRemainingBalance } from '../utils/transactions';
import logo from '../assets/logo-mark.svg';

const History: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<TransactionWithBalance[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchedTransactions = await api.getTransactions();
            setTransactions(withRemainingBalance(fetchedTransactions));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(25,127,230,0.24),transparent_34%),radial-gradient(circle_at_15%_10%,rgba(20,184,166,0.16),transparent_28%)]"></div>

            <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors text-slate-200"
                        aria-label="Volver"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="CashTrack" className="h-10 w-10 rounded-2xl shadow-glow" />
                        <div className="text-center">
                            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-white">Historial</h1>
                            <p className="text-xs font-semibold text-slate-400">{transactions.length} movimientos</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors text-slate-200"
                        aria-label="Refrescar historial"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </div>

            <main className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pt-5 gap-4">
                <div className="rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/10">
                    <p className="text-sm font-bold text-slate-200">Historial completo</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                        Cada registro muestra el dinero que quedo justo despues del movimiento.
                    </p>
                </div>

                {loading ? (
                    <div className="p-5 text-center text-slate-400 rounded-2xl bg-white/5 ring-1 ring-white/10">
                        Cargando movimientos...
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center bg-white/95 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">receipt_long</span>
                        <p className="font-bold text-slate-700 dark:text-slate-200">No hay movimientos aun</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transactions.map((t) => (
                            <TransactionRow key={t.id} transaction={t} onChanged={loadData} />
                        ))}
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex flex-col items-center gap-1 w-20 text-slate-500 hover:text-blue-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-bold">Inicio</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 w-20 text-blue-300">
                        <span className="material-symbols-outlined icon-filled">history</span>
                        <span className="text-[10px] font-extrabold">Historial</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default History;
