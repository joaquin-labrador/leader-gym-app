import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { paymentService } from '../services/paymentService';
import { planService } from '../services/planService';
import { PaymentHistoryItem, Plan } from '../types';
import { toast } from 'sonner';
import { Search, CreditCard } from 'lucide-react';
import { formatPlanName } from '../lib/planUtils';

export const Payments: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [dni, setDni] = useState('');
    const [planId, setPlanId] = useState<number | ''>('');
    const [amount, setAmount] = useState('');
    const [loadingPay, setLoadingPay] = useState(false);

    const [searchDni, setSearchDni] = useState('');
    const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        planService.getAllPlans()
            .then(setPlans)
            .catch(() => toast.error('Error al cargar planes'));
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni || !planId || !amount) {
            toast.error('Complete todos los campos del pago');
            return;
        }

        setLoadingPay(true);
        try {
            await paymentService.registerPayment({
                dni,
                planId: Number(planId),
                amount: Number(amount)
            });
            toast.success('Pago registrado exitosamente');
            setDni('');
            setAmount('');
            setPlanId('');

            if (searchDni === dni) {
                fetchHistory(dni);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al procesar el pago';
            toast.error(`Error: ${msg}`);
        } finally {
            setLoadingPay(false);
        }
    };

    const fetchHistory = async (targetDni: string) => {
        setLoadingHistory(true);
        try {
            const data = await paymentService.getPaymentHistory(targetDni);
            setHistory(data);
        } catch (err: any) {
            toast.error('Error al cargar historial o DNI no encontrado');
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSearchHistory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchDni) return;
        fetchHistory(searchDni);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Pagos</h1>
                <p className="text-gray-400 mt-1">Registre nuevos pagos o consulte el historial de un socio</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario de Pago */}
                <Card className="border-gold-500/30">
                    <div className="p-4 bg-dark-800 border-b border-dark-700 flex items-center gap-2">
                        <CreditCard className="text-gold-500" />
                        <h2 className="text-xl font-bold text-gray-200">Registrar Pago</h2>
                    </div>
                    <CardContent>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <Input
                                label="DNI del Socio"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="Ingrese DNI"
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-300">Plan</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                                    value={planId}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setPlanId(id);
                                        const selectedPlan = plans.find(p => p.id === id);
                                        if (selectedPlan) {
                                            setAmount(selectedPlan.price.toString());
                                        }
                                    }}
                                >
                                    <option value="" disabled>Seleccione un plan</option>
                                    {plans.map((p) => (
                                        <option key={p.id} value={p.id}>{formatPlanName(p.name)} - $ {p.price.toLocaleString('es-AR')}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Monto a abonar (ARS)"
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ej. 15000"
                            />

                            <Button type="submit" className="w-full mt-4" isLoading={loadingPay}>
                                Confirmar Pago
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Historial de Pagos */}
                <div className="space-y-6">
                    <Card>
                        <div className="p-4 bg-dark-800 border-b border-dark-700 flex items-center gap-2">
                            <Search className="text-blue-500" />
                            <h2 className="text-xl font-bold text-gray-200">Historial por Socio</h2>
                        </div>
                        <CardContent>
                            <form onSubmit={handleSearchHistory} className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="DNI del socio..."
                                        value={searchDni}
                                        onChange={(e) => setSearchDni(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" variant="secondary" isLoading={loadingHistory} disabled={!searchDni.trim()}>
                                    Buscar
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {history.length > 0 && (
                        <Card>
                            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                                <Table
                                    data={history}
                                    columns={[
                                        { header: 'Fecha', accessor: (p) => new Date(p.paymentDate).toLocaleDateString('es-AR') },
                                        { header: 'Plan', accessor: (p) => <span className="font-semibold text-gold-400">{formatPlanName(p.planName)}</span> },
                                        { header: 'Monto', accessor: (p) => `$ ${p.amount.toLocaleString('es-AR')}` },
                                        { header: 'Vence', accessor: (p) => p.expirationDate ? new Date(p.expirationDate).toLocaleDateString('es-AR') : '-' },
                                        {
                                            header: 'Estado', accessor: (p) =>
                                                p.active
                                                    ? <span className="text-green-500 font-bold text-xs">ACTIVO</span>
                                                    : <span className="text-red-500 font-bold text-xs">VENCIDO</span>
                                        },
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
