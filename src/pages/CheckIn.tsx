import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { checkInService } from '../services/checkInService';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { CheckInResponseDTO } from '../types';

const SUCCESS_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
const ERROR_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3';

export const CheckIn: React.FC = () => {
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState<'success' | 'error' | null>(null);
    const [checkInResult, setCheckInResult] = useState<CheckInResponseDTO | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (lastCheckIn) {
            const timer = setTimeout(() => {
                setLastCheckIn(null);
                setCheckInResult(null);
            }, 20000);
            return () => clearTimeout(timer);
        }
    }, [lastCheckIn]);

    const playAudio = (url: string) => {
        const audio = new Audio(url);
        audio.play().catch(err => console.error("Error playing audio:", err));
    };

    const translateError = (msg: string): string => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('already checked in')) return 'El socio ya ingresó el día de hoy.';
        if (lowerMsg.includes('not found')) return 'Socio no encontrado. Verifique el DNI.';

        if (lowerMsg.includes('partial payment')) {
            const match = msg.match(/is: ([\d.,]+)/);
            const debt = match ? match[1] : '';
            return `El socio no puede ingresar porque debe parte de la cuota.${debt ? ` Monto restante: $${debt}` : ''}`;
        }

        if (lowerMsg.includes('not pay') || lowerMsg.includes('payment') || lowerMsg.includes('has not paid'))
            return 'Ingreso denegado: El socio no tiene el pago de la cuota al día.';
        if (lowerMsg.includes('weekly visit limit')) return 'Ingreso denegado: Se pasó del límite de visitas semanales de su plan.';
        if (lowerMsg.includes('daily visit limit')) return 'Ingreso denegado: Ya realizó su visita diaria permitida.';
        return msg;
    };

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;

        setLoading(true);
        setErrorMessage('');
        try {
            const result = await checkInService.registerCheckIn(dni);
            playAudio(SUCCESS_SOUND_URL);
            setCheckInResult(result);
            setLastCheckIn('success');
            setErrorMessage('');
            toast.success(`Ingreso registrado: ${result.memberName}`, { duration: 20000 });
            setDni('');
        } catch (err: any) {
            playAudio(ERROR_SOUND_URL);
            const rawMsg = err.response?.data?.message || 'Error al registrar el ingreso.';
            const translatedMsg = translateError(rawMsg);
            setLastCheckIn('error');
            setCheckInResult(null);
            setErrorMessage(translatedMsg);
            toast.error(translatedMsg, { duration: 20000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Check-In de Socios</h1>
                <p className="text-gray-400 mt-2">Ingrese el DNI del socio para registrar su entrada al gimnasio.</p>
            </div>

            <Card className="border-gold-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <CardContent className="pt-8">
                    <form onSubmit={handleCheckIn} className="space-y-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    label="DNI del Socio"
                                    placeholder="Ingrese el DNI sin puntos"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    className="text-2xl py-4 h-16 font-mono tracking-widest text-center"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-16 text-xl bg-gold-600 hover:bg-gold-700 text-black font-bold"
                            isLoading={loading}
                            disabled={!dni.trim()}
                        >
                            Registrar Ingreso
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {lastCheckIn === 'success' && checkInResult && (
                <div className={`flex flex-col items-center justify-center p-8 border rounded-xl animate-in zoom-in-95 duration-300 ${checkInResult.dayToExpirationMembership <= 5
                        ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-500'
                        : 'bg-green-900/20 border-green-500/30 text-green-400'
                    }`}>
                    {checkInResult.dayToExpirationMembership <= 5 ? (
                        <AlertTriangle size={64} className="mb-4" />
                    ) : (
                        <CheckCircle2 size={64} className="mb-4" />
                    )}

                    <h2 className="text-3xl font-black uppercase mb-1 tracking-wider text-center">
                        ¡BIENVENIDO/A!
                    </h2>
                    <h3 className="text-2xl font-bold mb-4 text-white text-center">
                        {checkInResult.memberName}
                    </h3>

                    <div className="text-center space-y-2 mt-2">
                        {checkInResult.dayToExpirationMembership <= 5 ? (
                            <p className="text-xl font-bold px-4 py-2 bg-yellow-500/20 rounded-lg">
                                ¡Atención! Te quedan {checkInResult.dayToExpirationMembership} {checkInResult.dayToExpirationMembership === 1 ? 'día' : 'días'} para tu próximo vencimiento.
                            </p>
                        ) : (
                            <p className="text-lg">
                                El pase está activo. Te quedan {checkInResult.dayToExpirationMembership} días.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {lastCheckIn === 'error' && (
                <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl text-red-500 animate-in zoom-in-95 duration-300">
                    <XCircle size={64} className="mb-4" />
                    <h2 className="text-2xl font-bold uppercase tracking-wider">Ingreso Denegado</h2>
                    <p className="text-lg font-medium mt-2 text-center">{errorMessage}</p>
                </div>
            )}
        </div>
    );
};
