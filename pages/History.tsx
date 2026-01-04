import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Transaction } from '../types';
import TransactionRow from '../components/TransactionRow';
import logo from '../assets/logo-mark.png';

const History: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const fetchedTransactions = await api.getTransactions();
            setTransactions(fetchedTransactions);
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
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-20">
            <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="CashTrack" className="h-11 w-11 rounded-2xl shadow-sm" />
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Historial</h2>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        aria-label="Refrescar historial"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-6 gap-4">
                {loading ? (
                    <div className="p-4 text-center text-slate-500">Cargando movimientos...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">receipt_long</span>
                        <p className="text-slate-500">No hay movimientos aun</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transactions.map((t) => (
                            <TransactionRow key={t.id} transaction={t} />
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pb-safe z-40">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex flex-col items-center gap-1 w-16 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-medium">Inicio</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 w-16 text-primary">
                        <span className="material-symbols-outlined icon-filled">history</span>
                        <span className="text-[10px] font-bold">Historial</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default History;
