import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo-mark.svg';

const Auth: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setNotice('');

        if (!supabase) {
            setError('No hay backend configurado. Conecta Supabase para iniciar sesion.');
            return;
        }

        if (!email || !password) {
            setError('Completa el correo y la contrasena.');
            return;
        }

        setIsSubmitting(true);
        if (mode === 'login') {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) {
                setError(signInError.message);
            }
        } else {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (signUpError) {
                setError(signUpError.message);
            } else if (!data.session) {
                setNotice('Cuenta creada. Revisa tu correo para confirmar el acceso.');
            }
        }
        setIsSubmitting(false);
    };

    const handlePasswordReset = async () => {
        setError('');
        setNotice('');

        if (!supabase) {
            setError('No hay Supabase configurado para enviar recuperacion.');
            return;
        }

        if (!email) {
            setError('Escribe tu email para enviar la recuperacion.');
            return;
        }

        setIsSubmitting(true);
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${window.location.pathname}`,
        });
        setIsSubmitting(false);

        if (resetError) {
            setError(resetError.message);
        } else {
            setNotice('Si ese email existe, Supabase enviara un enlace de recuperacion.');
        }
    };

    const isLogin = mode === 'login';

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display transition-colors duration-500">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] dark:bg-primary/10"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-[80px] dark:bg-teal-400/10"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-8">
                <div className="flex flex-col items-center gap-6 w-full mb-8">
                    <div className="relative group cursor-default">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-teal-400 rounded-[2rem] opacity-30 blur-lg transition duration-500"></div>
                        <img
                            src={logo}
                            alt=""
                            className="relative h-48 w-48 drop-shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                        <h1 className="text-slate-900 dark:text-white text-[2rem] font-extrabold tracking-tight leading-tight">
                            CashTrack
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
                            Control de efectivo
                        </p>
                    </div>
                </div>

                <div className="w-full bg-white/70 dark:bg-card-dark/70 backdrop-blur-sm rounded-3xl p-1">
                    <form className="space-y-5 p-5" onSubmit={handleSubmit}>
                        {!supabase ? (
                            <div className="text-sm text-amber-800 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-200 px-3 py-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                                No hay Supabase configurado para iniciar sesion. Esta app requiere una cuenta real para cargar y guardar tus movimientos.
                            </div>
                        ) : null}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[1.25rem]">mail</span>
                                </div>
                                <input
                                    className="block w-full rounded-2xl border-0 py-4 pl-11 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-background-dark dark:ring-white/10 dark:text-white dark:placeholder:text-slate-600 transition-all"
                                    id="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="password">
                                Contrasena
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[1.25rem]">lock</span>
                                </div>
                                <input
                                    className="block w-full rounded-2xl border-0 py-4 pl-11 pr-11 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-background-dark dark:ring-white/10 dark:text-white dark:placeholder:text-slate-600 transition-all"
                                    id="password"
                                    name="password"
                                    placeholder="********"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                >
                                    <span className="material-symbols-outlined text-[1.25rem]">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {supabase ? (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    disabled={isSubmitting}
                                    className="text-sm font-semibold text-primary hover:text-blue-600 transition-colors disabled:opacity-60"
                                >
                                    Recuperar contrasena
                                </button>
                            </div>
                        ) : null}

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
                            disabled={isSubmitting || !supabase}
                            className={`w-full bg-primary hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-lg rounded-2xl py-4 transition-all duration-200 shadow-glow mt-2 flex items-center justify-center gap-2 ${
                                isSubmitting || !supabase ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        >
                            <span>{isSubmitting ? 'Procesando...' : isLogin ? 'Iniciar sesion' : 'Crear cuenta'}</span>
                            <span className="material-symbols-outlined text-[1.25rem]" style={{ fontVariationSettings: "'wght' 700" }}>
                                arrow_forward
                            </span>
                        </button>

                    </form>
                </div>

                {supabase ? (
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            {isLogin ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}
                            <button
                                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1"
                                onClick={() => setMode(isLogin ? 'register' : 'login')}
                            >
                                {isLogin ? 'Crear cuenta' : 'Iniciar sesion'}
                            </button>
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Auth;
