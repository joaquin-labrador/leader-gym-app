import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { paymentService } from '../services/paymentService';
import { planService } from '../services/planService';
import { Plan } from '../types';
import { toast } from 'sonner';
import { CreditCard, DollarSign } from 'lucide-react';
import { formatPlanName } from '../lib/planUtils';

const PAYMENT_METHODS = [
    { value: 'CASH', label: 'Efectivo', emoji: '💵' },
    { value: 'CARD', label: 'Tarjeta', emoji: '💳' },
    { value: 'TRANSFER', label: 'Transferencia', emoji: '🏦' },
];

export const Payments: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [dni, setDni] = useState('');
    const [planId, setPlanId] = useState<number | ''>('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        planService.getAllPlans()
            .then(setPlans)
            .catch(() => toast.error('Error al cargar planes'));
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni || !planId || !amount || !paymentMethod) {
            toast.error('Complete todos los campos del pago');
            return;
        }
        setLoading(true);
        try {
            await paymentService.registerPayment({
                dni,
                planId: Number(planId),
                amount: Number(amount),
                paymentMethod,
            });
            toast.success('Pago registrado exitosamente');
            setDni('');
            setAmount('');
            setPlanId('');
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
                    Pagos de Plan
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Registrá el pago de la cuota mensual de un socio.
                </p>
            </div>

            <Card style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                {/* Card Header */}
                <div
                    className="flex items-center gap-3 px-6 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--color-gold-500)' }}
                    >
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                            Registrar Pago de Cuota
                        </h2>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Este pago actualiza el vencimiento del socio.
                        </p>
                    </div>
                </div>

                <CardContent>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <Input
                            label="DNI del Socio *"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Ej: 38425871"
                            required
                        />

                        <Select
                            label="Plan *"
                            value={planId}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setPlanId(id);
                                const selected = plans.find(p => p.id === id);
                                if (selected) setAmount(selected.price.toString());
                            }}
                            required
                        >
                            <option value="" disabled>Seleccione un plan</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {formatPlanName(p.name)} — $ {p.price.toLocaleString('es-AR')}
                                </option>
                            ))}
                        </Select>

                        <Input
                            label="Monto a abonar (ARS) *"
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ej: 15000"
                            icon={<DollarSign size={16} />}
                            required
                        />

                        {/* Método de pago — pill selector */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Método de Pago *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setPaymentMethod(m.value as any)}
                                        className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 font-medium"
                                        style={paymentMethod === m.value
                                            ? { background: 'rgba(245,158,11,0.1)', borderColor: 'var(--color-gold-500)', color: 'var(--color-gold-500)' }
                                            : { background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)' }
                                        }
                                    >
                                        <span className="text-lg">{m.emoji}</span>
                                        <span className="text-xs uppercase tracking-wide font-semibold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2 h-11 font-bold" isLoading={loading}>
                            Confirmar Pago
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
