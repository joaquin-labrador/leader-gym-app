import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { memberService } from '../services/memberService';
import { planService } from '../services/planService';
import { Member, Plan, CreateMemberRequest } from '../types';
import { toast } from 'sonner';
import {
    Plus, Trash2, Edit, Calendar as CalendarIcon,
    Search, ChevronLeft, ChevronRight, X, AlertCircle, Users
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { formatPlanName } from '../lib/planUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

const PAGE_SIZE = 20;

export const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchInput, setSearchInput] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CreateMemberRequest>({
        dni: '', firstName: '', lastName: '', phoneNumber: '', email: '', planId: 0, birthDate: ''
    });

    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string; }>({
        isOpen: false, title: '', message: ''
    });

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

    useEffect(() => { if (!isSearchMode) fetchMembers(); }, [fetchMembers, isSearchMode]);
    useEffect(() => { planService.getAllPlans().then(setPlans).catch(console.error); }, []);

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
            toast.error('Socio no encontrado para ese DNI');
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setIsSearchMode(false);
        setPageIndex(0);
    };

    const handleOpenCreate = () => {
        setFormData({ dni: '', firstName: '', lastName: '', phoneNumber: '', email: '', planId: plans[0]?.id || 0, birthDate: '' });
        setIsEditing(false);
        setShowForm(true);
    };

    const handleOpenEdit = (m: Member) => {
        let birthDateStr = '';
        if (m.birthDate) {
            if (Array.isArray(m.birthDate)) {
                const [y, mm, d] = m.birthDate as number[];
                birthDateStr = `${y}-${String(mm).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            } else {
                birthDateStr = m.birthDate as string;
            }
        }
        setFormData({
            dni: m.dni,
            firstName: m.firstName,
            lastName: m.lastName,
            phoneNumber: m.phoneNumber,
            email: m.email || '',
            planId: m.planId || (plans[0]?.id || 0),
            birthDate: birthDateStr
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
                    message: 'El socio posee pagos asociados en el sistema. Su eliminación afectaría la integridad del historial de transacciones. No es posible eliminar socios con registros de pago vigentes.'
                });
            } else if (rawMsg.includes('not found')) {
                toast.error('Socio no encontrado.');
            } else {
                toast.error('Error al intentar eliminar el socio.');
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

    // ── Form view ────────────────
    if (showForm) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {isEditing ? 'Modificá los datos del socio.' : 'Completá los datos para registrar un nuevo socio.'}
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="DNI *"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                disabled={isEditing}
                                placeholder="Ej: 38425871"
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre *"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="Nombre"
                                    required
                                />
                                <Input
                                    label="Apellido *"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Apellido"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Teléfono *"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Ej: 1154321234"
                                    required
                                />

                                {/* DatePicker Fecha de Nacimiento */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                        Fecha de Nacimiento *
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon
                                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                                            size={16}
                                            style={{ color: 'var(--color-gold-500)' }}
                                        />
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
                                            className="w-full px-4 py-2.5 pl-9 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/40 bg-[var(--color-input-bg)] border-[1px] border-[var(--color-input-border)] text-[var(--color-text-primary)]"
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
                                placeholder="correo@ejemplo.com"
                            />

                            <Select
                                label="Plan Asignado *"
                                value={formData.planId}
                                onChange={(e) => setFormData({ ...formData, planId: Number(e.target.value) })}
                                required
                            >
                                <option value="" disabled>Seleccione un plan</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{formatPlanName(p.name)}</option>
                                ))}
                            </Select>

                            <div
                                className="flex flex-col sm:flex-row gap-3 pt-4"
                                style={{ borderTop: '1px solid var(--color-border)' }}
                            >
                                <Button type="submit" className="flex-1">Guardar</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── List view ────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        Gestión de Socios
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {totalElements > 0 ? `${totalElements} socios registrados` : 'Administrá los socios del gimnasio'}
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="shrink-0">
                    <Plus size={16} className="mr-1.5" />
                    Nuevo Socio
                </Button>
            </div>

            {/* Búsqueda */}
            <div className="flex gap-2">
                <Input
                    placeholder="Buscar por DNI…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    icon={<Search size={16} />}
                    className="flex-1"
                />
                <Button
                    onClick={handleSearch}
                    disabled={loading || !searchInput.trim()}
                    className="shrink-0"
                >
                    Buscar
                </Button>
                {isSearchMode && (
                    <Button
                        variant="secondary"
                        onClick={handleClearSearch}
                        className="shrink-0"
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </Button>
                )}
            </div>

            {/* Badge modo búsqueda */}
            {isSearchMode && (
                <div className="flex items-center gap-2">
                    <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--color-gold-500)' }}
                    >
                        Resultado de búsqueda
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {members.length === 0 ? 'Sin resultados' : `${members.length} socio${members.length !== 1 ? 's' : ''} encontrado${members.length !== 1 ? 's' : ''}`}
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
                        emptyIcon={<Users size={48} />}
                        columns={[
                            {
                                header: 'DNI',
                                accessor: (m) => (
                                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                                        {m.dni}
                                    </span>
                                )
                            },
                            {
                                header: 'Nombre completo',
                                accessor: (m) => (
                                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                        {m.firstName} {m.lastName}
                                    </span>
                                )
                            },
                            { header: 'Edad', accessor: (m) => m.age || '-' },
                            { header: 'Teléfono', accessor: (m) => m.phoneNumber || '-' },
                            {
                                header: 'Plan',
                                accessor: (m) => m.planDescription ? (
                                    <span className="font-medium" style={{ color: 'var(--color-gold-500)' }}>
                                        {formatPlanName(m.planDescription)}
                                    </span>
                                ) : '-'
                            },
                            {
                                header: 'Vencimiento',
                                accessor: (m) => m.expirationDate ? (
                                    <span className="font-mono text-xs">
                                        {m.expirationDate.split('-').reverse().join('/')}
                                    </span>
                                ) : '-'
                            },
                            {
                                header: 'Estado',
                                accessor: (m) => m.active
                                    ? <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--color-status-ok-bg)', color: 'var(--color-status-ok-text)' }}>ACTIVO</span>
                                    : <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--color-status-err-bg)', color: 'var(--color-status-err-text)' }}>INACTIVO</span>
                            },
                            {
                                header: 'Acciones',
                                accessor: (m) => (
                                    <div className="flex gap-1.5">
                                        <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(m)} title="Editar">
                                            <Edit size={14} />
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(m.dni)} title="Eliminar">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </CardContent>
            </Card>

            {/* Paginación */}
            {!isSearchMode && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Página <b style={{ color: 'var(--color-text-primary)' }}>{pageIndex + 1}</b> de{' '}
                        <b style={{ color: 'var(--color-text-primary)' }}>{totalPages}</b>
                        {' — '}
                        <span style={{ color: 'var(--color-gold-500)', fontWeight: 700 }}>{totalElements}</span> socios
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                            disabled={pageIndex === 0 || loading}
                        >
                            <ChevronLeft size={16} className="mr-1" /> Anterior
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))}
                            disabled={pageIndex >= totalPages - 1 || loading}
                        >
                            Siguiente <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
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
                <div className="flex flex-col items-center gap-5 py-2">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-status-err-bg)', color: 'var(--color-status-err-text)' }}
                    >
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Acción denegada</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                            {errorModal.message}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
