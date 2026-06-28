import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { paymentService } from '../services/paymentService';
import { planService } from '../services/planService';
import { Plan } from '../types';
import { toast } from 'sonner';
import { CreditCard, DollarSign, Calendar, Percent } from 'lucide-react';
import { formatPlanName } from '../lib/planUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { Modal } from '../components/ui/Modal';

registerLocale('es', es);

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
    
    // Nuevos estados
    const [paymentDate, setPaymentDate] = useState<Date>(new Date());
    const [discount, setDiscount] = useState<number | ''>('');
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [baseAmount, setBaseAmount] = useState<number | ''>('');

    useEffect(() => {
        planService.getAllPlans()
            .then(setPlans)
            .catch(() => toast.error('Error al cargar planes'));
    }, []);

    // Actualizar monto base al cambiar plan
    useEffect(() => {
        if (planId !== '') {
            const selected = plans.find(p => p.id === planId);
            if (selected) {
                setBaseAmount(selected.price);
                const currentDiscount = typeof discount === 'number' ? discount : 0;
                const discountedAmount = selected.price * (1 - currentDiscount / 100);
                setAmount(discountedAmount.toString());
            }
        }
    }, [planId, plans]);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const calculateExpiration = (startDate: Date, plan?: Plan) => {
        if (!plan) return null;
        const expiration = new Date(startDate);
        
        if (plan.durationInDays) {
            expiration.setDate(expiration.getDate() + plan.durationInDays);
            return expiration;
        }

        const name = plan.name || '';
        if (name.includes('MONTH') || name === 'THREE_TIMES_PER_WEEK') {
            expiration.setMonth(expiration.getMonth() + 1);
        } else if (name === 'FIFTEEN_DAYS') {
            expiration.setDate(expiration.getDate() + 15);
        } else if (name === 'WEEKLY') {
            expiration.setDate(expiration.getDate() + 7);
        } else if (name === 'DAILY') {
            expiration.setDate(expiration.getDate() + 1);
        } else {
            expiration.setMonth(expiration.getMonth() + 1);
        }
        return expiration;
    };

    const selectedPlan = plans.find(p => p.id === planId);
    const isDateModified = !isToday(paymentDate);
    const expirationDate = calculateExpiration(paymentDate, selectedPlan);

    const formatExpiration = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentDiscount = typeof discount === 'number' ? discount : 0;
        if (currentDiscount > 0 && !pendingSubmit) {
            setShowDiscountModal(true);
            return;
        }
        executePayment();
    };

    const executePayment = async () => {
        if (!dni || !planId || !amount || !paymentMethod) {
            toast.error('Complete todos los campos del pago');
            return;
        }
        setLoading(true);
        try {
            const offset = paymentDate.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(paymentDate.getTime() - offset)).toISOString().split('T')[0];

            await paymentService.registerPayment({
                dni,
                planId: Number(planId),
                amount: Number(amount),
                paymentMethod,
                paymentDate: localISOTime
            });
            toast.success('Pago registrado exitosamente');
            setDni('');
            setPlanId('');
            setAmount('');
            setBaseAmount('');
            setDiscount('');
            setPaymentDate(new Date());
            setPendingSubmit(false);
            setShowDiscountModal(false);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al procesar el pago';
            toast.error(msg);
        } finally {
            setLoading(false);
            setPendingSubmit(false);
        }
    };

    const confirmDiscountAndPay = () => {
        setPendingSubmit(true);
        setShowDiscountModal(false);
        setTimeout(() => executePayment(), 0);
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
                    <form onSubmit={handleFormSubmit} className="space-y-4">
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
                            onChange={(e) => setPlanId(Number(e.target.value))}
                            required
                        >
                            <option value="" disabled>Seleccione un plan</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {formatPlanName(p.name)} — $ {p.price.toLocaleString('es-AR')}
                                </option>
                            ))}
                        </Select>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Fecha de Pago *
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--color-gold-500)' }}>
                                    <Calendar size={15} />
                                </div>
                                <DatePicker
                                    selected={paymentDate}
                                    onChange={(date: Date | null) => date && setPaymentDate(date)}
                                    locale="es"
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-4 py-2.5 pl-9 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/40 bg-[var(--color-input-bg)] border-[1px] border-[var(--color-input-border)] text-[var(--color-text-primary)]"
                                    wrapperClassName="w-full"
                                    portalId="root-portal"
                                />
                            </div>
                            
                            {isDateModified && selectedPlan && expirationDate && (
                                <div 
                                    className="text-sm mt-1 p-3 rounded-xl border"
                                    style={{ 
                                        background: 'rgba(245, 158, 11, 0.1)', 
                                        borderColor: 'rgba(245, 158, 11, 0.2)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <span className="font-semibold" style={{ color: 'var(--color-gold-500)' }}>ℹ Información:</span>{' '}
                                    Al modificar la fecha de pago, este plan <strong>{formatPlanName(selectedPlan.name)}</strong> vencerá el <strong>{formatExpiration(expirationDate)}</strong>.
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Descuento (%)"
                                type="number"
                                min="0"
                                max="100"
                                value={discount}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    if (val === '' || (val >= 0 && val <= 100)) {
                                        setDiscount(val);
                                        if (baseAmount !== '') {
                                            const currentDiscount = val === '' ? 0 : val;
                                            setAmount((Number(baseAmount) * (1 - currentDiscount / 100)).toString());
                                        }
                                    }
                                }}
                                placeholder="0"
                                icon={<Percent size={16} />}
                            />

                            <Input
                                label="Monto a abonar (ARS) *"
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAmount(val);
                                    if (val !== '') {
                                        setBaseAmount(Number(val));
                                        setDiscount('');
                                    } else {
                                        setBaseAmount('');
                                    }
                                }}
                                placeholder="Ej: 15000"
                                icon={<DollarSign size={16} />}
                                required
                            />
                        </div>

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

            <Modal
                isOpen={showDiscountModal}
                onClose={() => setShowDiscountModal(false)}
                title="Confirmar Descuento"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDiscountModal(false)}>Cancelar</Button>
                        <Button onClick={confirmDiscountAndPay}>Aplicar y Pagar</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p>
                        Estás aplicando un descuento del <strong>{discount}%</strong> al plan seleccionado.
                    </p>
                    <p className="text-lg font-bold">
                        El monto final a abonar será de <span style={{ color: 'var(--color-gold-500)' }}>$ {Number(amount).toLocaleString('es-AR')}</span>.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        ¿Estás seguro de que deseas continuar con este descuento?
                    </p>
                </div>
            </Modal>
        </div>
    );
};
