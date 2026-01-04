import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';

const Auth: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setNotice('');

        if (!email || !password) {
            setError('Completa el correo y la contrasena.');
            return;
        }

        setIsSubmitting(true);
        if (mode === 'login') {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInError) {
                setError(signInError.message);
            }
        } else {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
            if (signUpError) {
                setError(signUpError.message);
            } else if (!data.session) {
                setNotice('Cuenta creada. Revisa tu correo para confirmar el acceso.');
            }
        }
        setIsSubmitting(false);
    };

    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="CashTrack" className="h-12 w-12 rounded-2xl shadow-sm" />
                        <div>
                            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                                Control de Efectivo
                            </p>
                            <h1 className="text-2xl font-bold">
                                {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
                            </h1>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                            Correo
                        </label>
                        <input
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@correo.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                            Contrasena
                        </label>
                        <input
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            id="password"
                            type="password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </div>

                    {error ? (
                        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                            {error}
                        </div>
                    ) : null}

                    {notice ? (
                        <div className="text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-xl">
                            {notice}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-14 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-lg shadow-glow transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Procesando...' : isLogin ? 'Entrar' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <button
                        className="text-primary font-semibold hover:underline"
                        onClick={() => setMode(isLogin ? 'register' : 'login')}
                    >
                        {isLogin ? 'No tienes cuenta? Crear una.' : 'Ya tienes cuenta? Inicia sesion.'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
