import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { checkInService } from '../services/checkInService';
import { toast } from 'sonner';
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
        audio.play().catch(err => console.error('Error playing audio:', err));
    };

    const translateError = (msg: string): string => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('already checked in')) return 'El socio ya ingresó el día de hoy.';
        if (lowerMsg.includes('not found')) return 'Socio no encontrado. Verificá el DNI.';
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
            toast.success(`Ingreso registrado: ${result.memberName}`, { duration: 10000 });
            setDni('');
        } catch (err: any) {
            playAudio(ERROR_SOUND_URL);
            const rawMsg = err.response?.data?.message || 'Error al registrar el ingreso.';
            const translatedMsg = translateError(rawMsg);
            setLastCheckIn('error');
            setCheckInResult(null);
            setErrorMessage(translatedMsg);
            toast.error(translatedMsg, { duration: 10000 });
        } finally {
            setLoading(false);
        }
    };

    const isWarning = checkInResult && checkInResult.dayToExpirationMembership <= 5;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                    Check-In de Socios
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Ingresá el DNI del socio para registrar su entrada al gimnasio.
                </p>
            </div>

            {/* Form Card */}
            <Card style={{ borderColor: 'rgba(245,158,11,0.25)', boxShadow: '0 0 24px rgba(245,158,11,0.08)' }}>
                <CardContent className="pt-6 pb-6">
                    <form onSubmit={handleCheckIn} className="space-y-4">
                        <Input
                            label="DNI del Socio"
                            placeholder="Ej: 38425871"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                            icon={<UserCheck size={18} />}
                            className="text-xl py-4 h-14 font-mono tracking-widest text-center"
                            autoFocus
                            maxLength={10}
                            inputMode="numeric"
                        />
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold"
                            isLoading={loading}
                            disabled={!dni.trim()}
                        >
                            Registrar Ingreso
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Result: Success */}
            {lastCheckIn === 'success' && checkInResult && (
                <div
                    className="flex flex-col items-center justify-center p-8 rounded-2xl text-center animate-in zoom-in-95 duration-300"
                    style={isWarning
                        ? { background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.4)', color: '#CA8A04' }
                        : { background: 'var(--color-status-ok-bg)', border: '1px solid rgba(74,222,128,0.3)', color: 'var(--color-status-ok-text)' }
                    }
                >
                    {isWarning
                        ? <AlertTriangle size={56} className="mb-4" />
                        : <CheckCircle2 size={56} className="mb-4" />
                    }

                    <h2 className="text-2xl font-black uppercase tracking-wider mb-1">
                        ¡Bienvenido/a!
                    </h2>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        {checkInResult.memberName}
                    </h3>

                    {isWarning ? (
                        <p
                            className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ background: 'rgba(234,179,8,0.15)' }}
                        >
                            ⚠️ Te quedan {checkInResult.dayToExpirationMembership}{' '}
                            {checkInResult.dayToExpirationMembership === 1 ? 'día' : 'días'} para el próximo vencimiento.
                        </p>
                    ) : (
                        <p className="text-sm">
                            Pase activo — {checkInResult.dayToExpirationMembership} días restantes.
                        </p>
                    )}
                </div>
            )}

            {/* Result: Error */}
            {lastCheckIn === 'error' && (
                <div
                    className="flex flex-col items-center justify-center p-8 rounded-2xl text-center animate-in zoom-in-95 duration-300"
                    style={{ background: 'var(--color-status-err-bg)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-status-err-text)' }}
                >
                    <XCircle size={56} className="mb-4" />
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Ingreso Denegado</h2>
                    <p className="text-sm font-medium">{errorMessage}</p>
                </div>
            )}
        </div>
    );
};
