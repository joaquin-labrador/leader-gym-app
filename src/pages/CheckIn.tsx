import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { checkInService } from '../services/checkInService';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';


export const CheckIn: React.FC = () => {
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const translateError = (msg: string): string => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('already checked in')) return 'El socio ya ingresó el día de hoy.';
        if (lowerMsg.includes('not found')) return 'Socio no encontrado. Verifique el DNI.';
        if (lowerMsg.includes('not pay') || lowerMsg.includes('payment')) return 'Debe verificar el pago. El plan se encuentra vencido.';
        if (lowerMsg.includes('weekly visit limit')) return 'Ingreso denegado: Se pasó del límite de visitas semanales de su plan.';
        if (lowerMsg.includes('daily visit limit')) return 'Ingreso denegado: Ya realizó su visita diaria permitida.';
        return msg; // Fallback to original if no match
    };

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;

        setLoading(true);
        setErrorMessage('');
        try {
            await checkInService.registerCheckIn(dni);
            setLastCheckIn('success');
            setErrorMessage('');
            toast.success('Ingreso registrado correctamente');
            setDni('');
        } catch (err: any) {
            const rawMsg = err.response?.data?.message || 'Error al registrar el ingreso.';
            const translatedMsg = translateError(rawMsg);
            setLastCheckIn('error');
            setErrorMessage(translatedMsg);
            toast.error(translatedMsg);
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

            {lastCheckIn === 'success' && (
                <div className="flex flex-col items-center justify-center p-8 bg-green-900/20 border border-green-500/30 rounded-xl text-green-400 animate-in zoom-in-95 duration-300">
                    <CheckCircle2 size={64} className="mb-4" />
                    <h2 className="text-2xl font-bold">¡INGRESO PERMITIDO!</h2>
                    <p className="text-lg">El socio tiene el pase activo.</p>
                </div>
            )}

            {lastCheckIn === 'error' && (
                <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl text-red-500 animate-in zoom-in-95 duration-300">
                    <XCircle size={64} className="mb-4" />
                    <h2 className="text-2xl font-bold uppercase tracking-wider">Ingreso Denegado</h2>
                    <p className="text-lg font-medium mt-2">{errorMessage}</p>
                </div>
            )}
        </div>
    );
};
