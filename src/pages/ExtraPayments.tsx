import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
import { Banknote, Wallet } from 'lucide-react';

export const ExtraPayments: React.FC = () => {
    const [dni, setDni] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | ''>('CASH');
    const [loadingPay, setLoadingPay] = useState(false);

    const handleExtraPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dni || !amount || !paymentMethod || !description) {
            toast.error('Complete todos los campos del pago');
            return;
        }

        setLoadingPay(true);
        try {
            await paymentService.registerExtraPayment({
                dni,
                amount: Number(amount),
                paymentMethod,
                description
            });
            toast.success('Pago suelto registrado exitosamente');
            setDni('');
            setAmount('');
            setDescription('');
            setPaymentMethod('CASH');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al procesar el pago';
            toast.error(`Error: ${msg}`);
        } finally {
            setLoadingPay(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Pagos Sueltos</h1>
                <p className="text-gray-400 mt-1">
                    Registra ingresos adicionales que no afectan el vencimiento del plan del socio.
                    <span className="text-gold-500 font-medium ml-1">(Ej: pagos parciales, suplementos, etc.)</span>
                </p>
            </div>

            <Card className="border-gold-500/20 bg-dark-900/50">
                <div className="p-4 bg-dark-800/80 border-b border-dark-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-100">Nuevo Pago Suelto</h2>
                        <p className="text-xs text-gray-500">Estos pagos se reflejarán directamente en el Arqueo de Caja</p>
                    </div>
                </div>

                <CardContent className="pt-6">
                    <form onSubmit={handleExtraPayment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="DNI del Socio"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="DNI sin puntos"
                                icon={<Wallet size={18} className="text-gold-500/50" />}
                                required
                            />

                            <Input
                                label="Monto (ARS)"
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                icon={<Banknote size={18} className="text-gold-500/50" />}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Motivo / Descripción</label>
                            <textarea
                                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none min-h-[100px]"
                                placeholder="Ej: Pago de mitad de cuota, Venta de material, etc."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Método de Pago</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'CASH', label: 'Efectivo', icon: '💵' },
                                    { id: 'CARD', label: 'Tarjeta', icon: '💳' },
                                    { id: 'TRANSFER', label: 'Transf.', icon: '🏦' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id as any)}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                            ? 'bg-gold-500/10 border-gold-500 text-gold-500'
                                            : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-dark-600'
                                            }`}
                                    >
                                        <span className="text-xl">{method.icon}</span>
                                        <span className="text-xs font-bold uppercase">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-bold shadow-glow hover:shadow-gold-500/40"
                                isLoading={loadingPay}
                            >
                                Registrar en Caja
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
