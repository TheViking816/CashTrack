import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddFunds from './pages/AddFunds';
import Withdraw from './pages/Withdraw';
import History from './pages/History';
import Auth from './pages/Auth';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const LOCAL_MODE_KEY = 'cashtrack-local-mode';

const App: React.FC = () => {
    const [sessionReady, setSessionReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setIsAuthenticated(window.localStorage.getItem(LOCAL_MODE_KEY) === 'true');
            setSessionReady(true);
            return;
        }

        let mounted = true;
        const initSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!mounted) return;
                setIsAuthenticated(!!data.session);
            } catch (error) {
                console.error('Failed to restore session', error);
                if (!mounted) return;
                setIsAuthenticated(false);
            } finally {
                if (mounted) {
                    setSessionReady(true);
                }
            }
        };

        initSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            setSessionReady(true);
        });
        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleContinueLocal = () => {
        window.localStorage.setItem(LOCAL_MODE_KEY, 'true');
        setIsAuthenticated(true);
    };

    if (!sessionReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                Cargando...
            </div>
        );
    }

    return (
        <HashRouter>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="*" element={<Auth onContinueLocal={handleContinueLocal} />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add-funds" element={<AddFunds />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route path="/history" element={<History />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            )}
        </HashRouter>
    );
};

export default App;
