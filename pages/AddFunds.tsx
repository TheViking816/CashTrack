import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AddFunds: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.getBalance().then(setBalance);
    }, []);

    const handleConfirm = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        
        setIsSubmitting(true);
        const success = await api.addTransaction(Number(amount), 'deposit', 'Ingreso Efectivo');
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
                    <div className="text-center">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Ingresar Fondos</h2>
                        <span className="text-xs font-semibold text-primary dark:text-blue-400 uppercase tracking-wide">Depósito</span>
                    </div>
                    <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </header>
                <main className="flex-1 flex flex-col relative">
                    <section className="flex-1 flex flex-col items-center justify-center p-6 w-full">
                        <div className="w-full max-w-[85%] mx-auto flex flex-col items-center gap-8">
                            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">payments</span>
                                <span className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Monto a Ingresar</span>
                            </div>
                            <div className="relative w-full flex items-center justify-center">
                                <span className="text-[4rem] font-bold text-slate-300 dark:text-slate-600 mr-2">€</span>
                                <input 
                                    autoFocus 
                                    className="w-full bg-transparent border-none p-0 text-center text-[4.5rem] leading-none font-extrabold tracking-tight text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-slate-700 focus:ring-0 focus:outline-none caret-primary" 
                                    placeholder="0" 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col items-center animate-fade-in-up">
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">
                                    Saldo actual
                                </p>
                                <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                                    € {balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </section>
                    <section className="p-6 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 pb-10">
                        <button 
                            onClick={handleConfirm}
                            disabled={isSubmitting || !amount}
                            className={`group relative w-full overflow-hidden rounded-2xl bg-primary hover:bg-blue-600 transition-all duration-300 shadow-glow hover:shadow-lg hover:-translate-y-0.5 ${isSubmitting || !amount ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="relative z-10 flex h-14 w-full items-center justify-center gap-2 px-4">
                                <span className="material-symbols-outlined text-white">
                                    {isSubmitting ? 'hourglass_empty' : 'check_circle'}
                                </span>
                                <span className="text-white text-lg font-bold tracking-wide">
                                    {isSubmitting ? 'Procesando...' : 'Confirmar'}
                                </span>
                            </div>
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AddFunds;
