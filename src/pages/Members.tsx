import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { memberService } from '../services/memberService';
import { planService } from '../services/planService';
import { Member, Plan, CreateMemberRequest } from '../types';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Calendar as CalendarIcon } from 'lucide-react';
import { formatPlanName } from '../lib/planUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

export const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal / Form state
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CreateMemberRequest>({
        dni: '', firstName: '', lastName: '', phoneNumber: '', email: '', planId: 0, birthDate: ''
    });

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await memberService.getMembers(0, 50, 'firstName,asc');
            setMembers(data.content || []);
        } catch (err) {
            toast.error('Error al cargar socios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
        planService.getAllPlans().then(setPlans).catch(console.error);
    }, []);

    const handleOpenCreate = () => {
        setFormData({ dni: '', firstName: '', lastName: '', phoneNumber: '', email: '', planId: plans[0]?.id || 0, birthDate: '' });
        setIsEditing(false);
        setShowForm(true);
    };

    const handleOpenEdit = (m: Member) => {
        setFormData({
            dni: m.dni,
            firstName: m.firstName,
            lastName: m.lastName,
            phoneNumber: m.phoneNumber,
            email: m.email || '',
            planId: m.planId || (plans[0]?.id || 0),
            birthDate: m.birthDate || ''
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (dni: string) => {
        if (!window.confirm(`¿Seguro que desea eliminar al socio con DNI ${dni}?`)) return;
        try {
            await memberService.deleteMember(dni);
            toast.success('Socio eliminado');
            fetchMembers();
        } catch (err) {
            toast.error('Error al eliminar el socio');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await memberService.updateMember(formData.dni, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    planId: Number(formData.planId),
                    birthDate: formData.birthDate
                });
                toast.success('Socio actualizado');
            } else {
                await memberService.createMember({
                    ...formData,
                    planId: Number(formData.planId)
                });
                toast.success('Socio creado exitosamente');
            }
            setShowForm(false);
            fetchMembers();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al guardar el socio';
            toast.error(msg);
        }
    };

    if (showForm) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">{isEditing ? 'Editar Socio' : 'Nuevo Socio'}</h1>
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="DNI"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                disabled={isEditing}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Apellido"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Teléfono"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    required
                                />
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-gray-300">Fecha de Nacimiento</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 z-10 pointer-events-none" size={18} />
                                        <DatePicker
                                            selected={formData.birthDate ? new Date(formData.birthDate + 'T00:00:00') : null}
                                            onChange={(date: Date | null) => {
                                                if (date) {
                                                    const formatted = date.toISOString().split('T')[0];
                                                    setFormData({ ...formData, birthDate: formatted });
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            locale="es"
                                            placeholderText="dd/mm/aaaa"
                                            className="w-full px-4 py-2.5 pl-10 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-sans"
                                            wrapperClassName="w-full"
                                            required
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                            portalId="root-portal"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Input
                                label="Email (Opcional)"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-300">Plan Asignado</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white appearance-none"
                                    value={formData.planId}
                                    onChange={(e) => setFormData({ ...formData, planId: Number(e.target.value) })}
                                    required
                                >
                                    <option value="" disabled>Seleccione un plan</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{formatPlanName(p.name)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-dark-800">
                                <Button type="submit" className="flex-1">Guardar</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Socios</h1>
                <Button onClick={handleOpenCreate}>
                    <Plus size={18} className="mr-2" />
                    Nuevo Socio
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table
                        data={members}
                        isLoading={loading}
                        emptyMessage="No hay socios registrados"
                        columns={[
                            { header: 'DNI', accessor: (m) => m.dni },
                            { header: 'Nombre', accessor: (m) => <span className="font-semibold text-gray-100">{m.firstName} {m.lastName}</span> },
                            { header: 'Edad', accessor: (m) => m.age || '-' },
                            { header: 'Teléfono', accessor: (m) => m.phoneNumber || '-' },
                            { header: 'Plan', accessor: (m) => m.planDescription ? <span className="text-gold-400 font-medium">{formatPlanName(m.planDescription)}</span> : '-' },
                            {
                                header: 'Estado',
                                accessor: (m) => m.active
                                    ? <span className="px-2 py-1 bg-green-900/40 text-green-400 rounded-full text-xs font-bold">ACTIVO</span>
                                    : <span className="px-2 py-1 bg-red-900/40 text-red-500 rounded-full text-xs font-bold">INACTIVO</span>
                            },
                            {
                                header: 'Acciones',
                                accessor: (m) => (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(m)}>
                                            <Edit size={16} />
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(m.dni)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
