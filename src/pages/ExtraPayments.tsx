import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
import { Banknote, DollarSign, Info } from 'lucide-react';

const PAYMENT_METHODS = [
    { id: 'CASH', label: 'Efectivo', emoji: '💵' },
    { id: 'CARD', label: 'Tarjeta', emoji: '💳' },
    { id: 'TRANSFER', label: 'Transf.', emoji: '🏦' },
];

export const ExtraPayments: React.FC = () => {
    const [dni, setDni] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
    const [loading, setLoading] = useState(false);

    const handleExtraPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni || !amount || !paymentMethod || !description) {
            toast.error('Complete todos los campos del pago');
            return;
        }
        setLoading(true);
        try {
            await paymentService.registerExtraPayment({ dni, amount: Number(amount), paymentMethod, description });
            toast.success('Pago suelto registrado exitosamente');
            setDni('');
            setAmount('');
            setDescription('');
            setPaymentMethod('CASH');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al procesar el pago';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                    Pagos Sueltos
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Registrá ingresos adicionales sin afectar el vencimiento del plan del socio.
                </p>
            </div>

            {/* Info notice */}
            <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
                <Info size={18} style={{ color: 'var(--color-gold-500)' }} className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Estos pagos se reflejan directamente en el <b style={{ color: 'var(--color-gold-500)' }}>Arqueo de Caja</b> y no modifican el estado de membresía del socio.
                    Usá esta sección para pagos parciales, venta de suplementos, etc.
                </p>
            </div>

            <Card style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                <div
                    className="flex items-center gap-3 px-6 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--color-gold-500)' }}
                    >
                        <Banknote size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                            Nuevo Pago Suelto
                        </h2>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Ej: pagos parciales, suplementos, cuotas extraordinarias
                        </p>
                    </div>
                </div>

                <CardContent className="pt-6">
                    <form onSubmit={handleExtraPayment} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="DNI del Socio *"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="Ej: 38425871"
                                required
                            />
                            <Input
                                label="Monto (ARS) *"
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                icon={<DollarSign size={16} />}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Motivo / Descripción *
                            </label>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg text-sm transition-all resize-none min-h-[90px] focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                                placeholder="Ej: Pago de mitad de cuota, venta de material, etc."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{
                                    background: 'var(--color-input-bg)',
                                    border: '1px solid var(--color-input-border)',
                                    color: 'var(--color-text-primary)',
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Método de Pago *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(m.id as any)}
                                        className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200"
                                        style={paymentMethod === m.id
                                            ? { background: 'rgba(245,158,11,0.1)', borderColor: 'var(--color-gold-500)', color: 'var(--color-gold-500)' }
                                            : { background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)' }
                                        }
                                    >
                                        <span className="text-xl">{m.emoji}</span>
                                        <span className="text-xs uppercase tracking-wide font-bold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 font-bold text-base"
                            isLoading={loading}
                        >
                            Registrar en Caja
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
