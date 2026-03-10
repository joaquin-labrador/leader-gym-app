import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { planService } from '../services/planService';
import { Plan } from '../types';
import { toast } from 'sonner';
import { Edit2, Save, X, Dumbbell } from 'lucide-react';
import { formatPlanName } from '../lib/planUtils';

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>('');
    const [saving, setSaving] = useState(false);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planService.getAllPlans();
            setPlans(data);
        } catch {
            toast.error('Error al obtener los planes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleEditClick = (plan: Plan) => {
        setEditingPlanId(plan.id);
        setEditPrice(plan.price.toString());
    };

    const handleCancelEdit = () => {
        setEditingPlanId(null);
        setEditPrice('');
    };

    const handleSavePrice = async (planId: number) => {
        const priceNumber = Number(editPrice);
        if (isNaN(priceNumber) || priceNumber <= 0) {
            toast.error('Ingrese un precio válido mayor a 0');
            return;
        }
        setSaving(true);
        try {
            await planService.updatePlanPrice(planId, priceNumber);
            toast.success('Precio actualizado exitosamente');
            setEditingPlanId(null);
            await fetchPlans();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al actualizar el precio';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        Gestión de Planes
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Visualizá y actualizá los precios de los planes disponibles.
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table
                        data={plans}
                        isLoading={loading}
                        emptyMessage="No hay planes registrados"
                        emptyIcon={<Dumbbell size={48} />}
                        columns={[
                            {
                                header: 'ID',
                                accessor: (p) => (
                                    <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        #{p.id}
                                    </span>
                                )
                            },
                            {
                                header: 'Nombre del Plan',
                                accessor: (p) => (
                                    <span className="font-bold" style={{ color: 'var(--color-gold-500)' }}>
                                        {formatPlanName(p.name)}
                                    </span>
                                )
                            },
                            {
                                header: 'Precio (ARS)',
                                accessor: (p) => editingPlanId === p.id ? (
                                    <Input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-32 py-1.5 h-9 text-sm"
                                        autoFocus
                                        min="0"
                                    />
                                ) : (
                                    <span className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
                                        $ {p.price.toLocaleString('es-AR')}
                                    </span>
                                )
                            },
                            {
                                header: 'Duración',
                                accessor: (p) => (
                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                        {p.durationInDays ? `${p.durationInDays} días` : '-'}
                                    </span>
                                )
                            },
                            {
                                header: 'Acciones',
                                accessor: (p) => editingPlanId === p.id ? (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleSavePrice(p.id)}
                                            isLoading={saving}
                                            style={{ background: 'rgb(22 163 74)', color: '#fff' }}
                                        >
                                            <Save size={14} className="mr-1" /> Guardar
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={handleCancelEdit} disabled={saving}>
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleEditClick(p)}>
                                        <Edit2 size={14} className="mr-1" /> Editar
                                    </Button>
                                )
                            }
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
