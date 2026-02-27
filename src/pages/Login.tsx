import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Lock, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
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
            // Si el error es de conexión (backend caído o CORS), axios no tendrá response
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
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                        <span className="text-gold-500">LEADER</span> GYM
                    </h1>
                    <p className="text-gray-400 mt-2">Acceso al sistema administrativo</p>
                </div>

                <Card className="border-dark-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Iniciar Sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10"
                                        autoComplete="username"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        autoComplete="current-password"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-bold"
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Entrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-600 mt-8">
                    &copy; {new Date().getFullYear()} Leader Gym Management. Todos los derechos reservados.
                </p>
            </div>
            <Toaster theme="dark" position="top-right" />
        </div>
    );
};
