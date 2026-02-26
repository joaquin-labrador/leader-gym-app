import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { planService } from '../services/planService';
import { Plan } from '../types';
import { toast } from 'sonner';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Edit2, Save, X } from 'lucide-react';

import { formatPlanName } from '../lib/planUtils';

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>('');
    const [saving, setSaving] = useState(false);

    const fetchPlans = async () => {
        try {
            const data = await planService.getAllPlans();
            setPlans(data);
        } catch (err) {
            toast.error('Error al obtener los planes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

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
            toast.error('Ocurrió un error: Ingrese un precio válido mayor a 0');
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Planes</h1>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table
                        data={plans}
                        isLoading={loading}
                        columns={[
                            { header: 'ID', accessor: (p) => p.id },
                            { header: 'Nombre', accessor: (p) => <span className="font-bold text-gold-400">{formatPlanName(p.name)}</span> },
                            {
                                header: 'Precio (ARS)',
                                accessor: (p) => editingPlanId === p.id ? (
                                    <Input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-32 py-1 h-8 text-sm"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-lg">$ {p.price.toLocaleString('es-AR')}</span>
                                )
                            },
                            { header: 'Duración (días)', accessor: (p) => p.durationInDays || '-' },
                            {
                                header: 'Acciones',
                                accessor: (p) => editingPlanId === p.id ? (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleSavePrice(p.id)} isLoading={saving} className="bg-green-600 hover:bg-green-500 text-white">
                                            <Save size={16} className="mr-1" /> Guardar
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={handleCancelEdit} disabled={saving}>
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleEditClick(p)}>
                                        <Edit2 size={16} className="mr-1" /> Editar Precio
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
