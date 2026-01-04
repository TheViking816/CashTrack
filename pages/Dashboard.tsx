import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Transaction } from '../types';
import TransactionRow from '../components/TransactionRow';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo-mark.png';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedBalance, fetchedTransactions] = await Promise.all([
                api.getBalance(),
                api.getTransactions(50)
            ]);
            setBalance(fetchedBalance);
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

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut({ scope: 'local' });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const balanceParts = balance.toFixed(2).split('.');

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-20">
            {/* Top App Bar */}
            <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
                    <div className="flex items-center gap-3 flex-1">
                        <img src={logo} alt="CashTrack" className="h-11 w-11 rounded-2xl shadow-sm" />
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">CashTrack</h2>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        aria-label="Cerrar sesion"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-6 gap-6">
                {/* Balance Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-soft p-6 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-2 z-10">Saldo Actual</p>
                    <div className="flex items-baseline gap-1 z-10">
                        <span className="text-primary font-bold text-4xl sm:text-5xl tracking-tight">
                            € {loading ? '...' : balanceParts[0]}
                        </span>
                        <span className="text-primary/70 font-semibold text-2xl">.{loading ? '00' : balanceParts[1]}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">trending_up</span>
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">Actualizado</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate('/add-funds')}
                        className="flex items-center justify-center gap-2 h-14 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        <span>Ingresar</span>
                    </button>
                    <button 
                        onClick={() => navigate('/withdraw')}
                        className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white dark:bg-transparent border-2 border-primary/20 hover:border-primary text-primary font-bold text-base transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined">do_not_disturb_on</span>
                        <span>Retirar</span>
                    </button>
                </div>

                {/* Recent Transactions List */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Movimientos Recientes</h3>
                        <button 
                            onClick={loadData}
                            className="text-sm font-semibold text-primary hover:text-blue-600"
                        >
                            Refrescar
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {loading ? (
                             <div className="p-4 text-center text-slate-500">Cargando movimientos...</div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">receipt_long</span>
                                <p className="text-slate-500">No hay movimientos aún</p>
                            </div>
                        ) : (
                            transactions.map(t => <TransactionRow key={t.id} transaction={t} />)
                        )}
                    </div>
                </div>
                {/* Spacing for bottom nav */}
                <div className="h-10"></div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pb-safe z-40">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button className="flex flex-col items-center gap-1 w-16 text-primary">
                        <span className="material-symbols-outlined icon-filled">home</span>
                        <span className="text-[10px] font-bold">Inicio</span>
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="flex flex-col items-center gap-1 w-16 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">history</span>
                        <span className="text-[10px] font-medium">Historial</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
