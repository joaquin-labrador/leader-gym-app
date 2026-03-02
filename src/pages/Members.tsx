import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { memberService } from '../services/memberService';
import { planService } from '../services/planService';
import { Member, Plan, CreateMemberRequest } from '../types';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Calendar as CalendarIcon, Search, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { formatPlanName } from '../lib/planUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

const PAGE_SIZE = 20;



export const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    // Paginación (sólo activa cuando no hay búsqueda)
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Búsqueda por DNI
    const [searchInput, setSearchInput] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);

    // Modal / Form state
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CreateMemberRequest>({
        dni: '', firstName: '', lastName: '', phoneNumber: '', email: '', planId: 0, birthDate: ''
    });

    // Error Feedback Modal
    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: ''
    });

    // ── Carga paginada (modo lista) ──────────────────────────────────
    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await memberService.getMembers(pageIndex, PAGE_SIZE, 'firstName,asc');
            setMembers(data.content || []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch {
            toast.error('Error al cargar socios');
        } finally {
            setLoading(false);
        }
    }, [pageIndex]);

    useEffect(() => {
        if (!isSearchMode) fetchMembers();
    }, [fetchMembers, isSearchMode]);

    useEffect(() => {
        planService.getAllPlans().then(setPlans).catch(console.error);
    }, []);

    // ── Búsqueda puntual ─────────────────────────────────────────────
    const handleSearch = async () => {
        const query = searchInput.trim();
        if (!query) return;

        setLoading(true);
        setIsSearchMode(true);
        try {
            const member = await memberService.getMemberByDni(query);
            setMembers([member]);
            setTotalPages(0);
            setTotalElements(1);
        } catch {
            toast.error('Error al buscar socio');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setIsSearchMode(false);
        setPageIndex(0);
    };

    // ── CRUD handlers ────────────────────────────────────────────────
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
            if (isSearchMode) handleClearSearch(); else fetchMembers();
        } catch (err: any) {
            const rawMsg = err.response?.data?.message || '';

            if (rawMsg.includes('active payments')) {
                setErrorModal({
                    isOpen: true,
                    title: 'Operación denegada',
                    message: 'El socio posee pagos asociados en el sistema. Su eliminación afectaría la integridad del historial de transacciones y los reportes de ingresos. No es posible eliminar socios con registros de pago vigentes.'
                });
            } else if (rawMsg.includes('not found')) {
                toast.error('Socio no encontrado. Es posible que ya haya sido eliminado.');
            } else {
                toast.error('Error al intentar eliminar el socio. Intente nuevamente.');
            }
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
                await memberService.createMember({ ...formData, planId: Number(formData.planId) });
                toast.success('Socio creado exitosamente');
            }
            setShowForm(false);
            if (isSearchMode) handleClearSearch(); else fetchMembers();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al guardar el socio';
            toast.error(msg);
        }
    };

    // ── Form view ────────────────────────────────────────────────────
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

    // ── List view ────────────────────────────────────────────────────


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Socios</h1>
                <Button onClick={handleOpenCreate}>
                    <Plus size={18} className="mr-2" />
                    Nuevo Socio
                </Button>
            </div>

            {/* Búsqueda por DNI */}
            <div className="flex gap-2 items-stretch">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Buscar por DNI…"
                    className="flex-1 h-11 px-4 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                />

                {/* Botón lupa */}
                <button
                    onClick={handleSearch}
                    disabled={loading || !searchInput.trim()}
                    className="h-11 w-11 flex items-center justify-center bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-dark-950 font-semibold rounded-lg transition-all shrink-0"
                    title="Buscar"
                >
                    <Search size={18} />
                </button>

                {/* Botón limpiar (sólo visible cuando hay búsqueda activa) */}
                {isSearchMode && (
                    <button
                        onClick={handleClearSearch}
                        className="h-11 w-11 flex items-center justify-center bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-all shrink-0"
                        title="Limpiar búsqueda"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Badge de modo */}
            {isSearchMode && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-full text-xs font-semibold">
                        Resultado de búsqueda
                    </span>
                    <span className="text-gray-400">
                        {members.length === 0
                            ? 'Sin resultados'
                            : `${members.length} socio${members.length !== 1 ? 's' : ''} encontrado${members.length !== 1 ? 's' : ''}`}
                    </span>
                </div>
            )}

            {/* Tabla */}
            <Card>
                <CardContent className="p-0">
                    <Table
                        data={members}
                        isLoading={loading}
                        emptyMessage={isSearchMode ? 'Sin resultados para esta búsqueda' : 'No hay socios registrados'}
                        columns={[
                            { header: 'DNI', accessor: (m) => m.dni },
                            { header: 'Nombre', accessor: (m) => <span className="font-semibold text-gray-100">{m.firstName} {m.lastName}</span> },
                            { header: 'Edad', accessor: (m) => m.age || '-' },
                            { header: 'Teléfono', accessor: (m) => m.phoneNumber || '-' },
                            { header: 'Plan', accessor: (m) => m.planDescription ? <span className="text-gold-400 font-medium">{formatPlanName(m.planDescription)}</span> : '-' },
                            {
                                header: 'Vencimiento',
                                accessor: (m) => m.expirationDate ? (
                                    <span className="text-gray-300 font-medium">
                                        {m.expirationDate.split('-').reverse().join('/')}
                                    </span>
                                ) : '-'
                            },
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

            {/* Paginación (oculta en modo búsqueda) */}
            {!isSearchMode && totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-400">
                        Página <span className="text-white font-semibold">{pageIndex + 1}</span> de{' '}
                        <span className="text-white font-semibold">{totalPages}</span>
                        {' '}·{' '}
                        <span className="text-gold-400 font-semibold">{totalElements}</span> socio{totalElements !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                            disabled={pageIndex === 0 || loading}
                        >
                            <ChevronLeft size={16} className="mr-1" /> Anterior
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={pageIndex >= totalPages - 1 || loading}
                        >
                            Siguiente <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                title={errorModal.title}
                footer={
                    <Button onClick={() => setErrorModal({ ...errorModal, isOpen: false })} className="w-full">
                        Entendido
                    </Button>
                }
            >
                <div className="flex flex-col items-center gap-6 py-2">
                    <div className="w-20 h-20 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-500 animate-in zoom-in duration-300">
                        <AlertCircle size={40} />
                    </div>
                    <div className="space-y-4 w-full">
                        <p className="text-xl font-bold text-white text-center">Acción denegada</p>
                        <p className="text-gray-300 leading-relaxed text-pretty text-justify">
                            {errorModal.message}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
