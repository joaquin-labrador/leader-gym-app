import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Lock, Sun, Moon, Dumbbell } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        setIsSubmitting(true);
        try {
            await login({ username, password });
            toast.success('¡Bienvenido!');
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            if (!err.response) {
                toast.error('Error de conexión: Verifica que el servidor esté corriendo.');
            } else {
                toast.error('Credenciales inválidas. Inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
            style={{ background: 'var(--color-bg-base)' }}
        >
            {/* Theme toggle top-right */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
                style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)'
                }}
                aria-label="Cambiar tema"
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-center mb-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)' }}
                        >
                            <Dumbbell size={32} color="#030712" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1
                        className="text-3xl font-black tracking-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <span style={{ color: 'var(--color-gold-500)' }}>LEADER</span>{' '}
                        <span>GYM</span>
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
                        Sistema de Gestión Administrativo
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{
                        background: 'var(--color-card-bg)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                >
                    <div className="p-6">
                        <h2
                            className="text-lg font-bold text-center mb-6"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Iniciar Sesión
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                label="Usuario"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                icon={<User size={16} />}
                                autoComplete="username"
                                disabled={isSubmitting}
                            />

                            <Input
                                type="password"
                                label="Contraseña"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock size={16} />}
                                autoComplete="current-password"
                                disabled={isSubmitting}
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full py-3 text-base font-bold"
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    Entrar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-muted)' }}>
                    &copy; {new Date().getFullYear()} Leader Gym &mdash; Todos los derechos reservados.
                </p>
            </div>

            <Toaster theme={theme} position="top-right" richColors />
        </div>
    );
};
