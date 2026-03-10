import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import { PaymentHistoryResponseDTO, PaymentHistoryFilterDTO } from '../types';
import { PaymentHistoryFilters } from '../components/payment-history/PaymentHistoryFilters';
import { PaymentHistoryTable } from '../components/payment-history/PaymentHistoryTable';
import { History, FileText, Printer, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const PaymentHistory: React.FC = () => {
    const [history, setHistory] = useState<PaymentHistoryResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        memberDni: '',
        paymentMethod: 'ALL',
        month: '',
        startDate: '',
        endDate: ''
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        payment: PaymentHistoryResponseDTO | null;
        isDeleting: boolean;
    }>({ isOpen: false, payment: null, isDeleting: false });

    const fetchHistory = useCallback(async () => {
        if (filters.startDate && filters.endDate && new Date(filters.endDate) < new Date(filters.startDate)) {
            toast.error('La fecha de fin no puede ser anterior a la de inicio');
            return;
        }

        setLoading(true);
        try {
            const dto: PaymentHistoryFilterDTO = {
                memberDni: filters.memberDni.trim() || null,
                paymentMethod: filters.paymentMethod === 'ALL' ? null : filters.paymentMethod,
                startDate: null,
                endDate: null,
            };

            if (filters.month) {
                dto.startDate = `${filters.month}-01`;
                dto.endDate = null;
            } else {
                if (filters.startDate) dto.startDate = filters.startDate;
                if (filters.endDate) dto.endDate = filters.endDate;
            }

            const data = await paymentService.getFilteredPaymentHistory(dto);
            setHistory(data);
            if (data.length === 0) toast.info('No hay pagos para este filtro.');
        } catch (err: any) {
            toast.error('No se pudo cargar el historial. ' + (err.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClear = () => {
        setFilters({ memberDni: '', paymentMethod: 'ALL', month: '', startDate: '', endDate: '' });
    };

    const handleDelete = async () => {
        if (!deleteModal.payment) return;
        setDeleteModal(prev => ({ ...prev, isDeleting: true }));
        try {
            await paymentService.deleteLastPayment(deleteModal.payment.paymentId);
            toast.success('Pago eliminado exitosamente');
            setDeleteModal({ isOpen: false, payment: null, isDeleting: false });
            fetchHistory();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al eliminar el pago';
            toast.error(msg);
            setDeleteModal(prev => ({ ...prev, isDeleting: false }));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)', color: '#030712', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                    >
                        <History size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase" style={{ color: 'var(--color-text-primary)' }}>
                            Arqueo / Caja
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            Administración y reporte de ingresos del gimnasio
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:brightness-105 shrink-0"
                    style={{
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-gold-500)'
                    }}
                >
                    <Printer size={16} /> Imprimir
                </button>
            </div>

            {/* Filters */}
            <PaymentHistoryFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchHistory}
                onClear={handleClear}
                loading={loading}
            />

            {/* Results */}
            <div
                className="rounded-2xl overflow-hidden relative"
                style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
            >
                {/* Results header */}
                <div
                    className="flex items-center gap-2 px-5 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}
                >
                    <FileText size={18} style={{ color: 'var(--color-gold-500)' }} />
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        Resultados del Período
                    </span>
                    {history.length > 0 && (
                        <span
                            className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--color-gold-500)' }}
                        >
                            {history.length} pagos
                        </span>
                    )}
                </div>

                <div style={{ background: 'var(--color-card-bg)' }}>
                    <PaymentHistoryTable
                        data={history}
                        onDelete={(payment) => setDeleteModal({ isOpen: true, payment, isDeleting: false })}
                    />
                </div>

                {/* Loading overlay */}
                {loading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center z-10 animate-in fade-in duration-200"
                        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div
                                className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                                style={{ borderColor: 'var(--color-gold-500)', borderTopColor: 'transparent' }}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold-500)' }}>
                                Cargando...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => !deleteModal.isDeleting && setDeleteModal({ isOpen: false, payment: null, isDeleting: false })}
                title="Eliminar Registro de Pago"
                footer={
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setDeleteModal({ isOpen: false, payment: null, isDeleting: false })}
                            disabled={deleteModal.isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button variant="danger" className="flex-1" onClick={handleDelete} isLoading={deleteModal.isDeleting}>
                            Eliminar
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col items-center gap-5 py-2">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-status-err-bg)', color: 'var(--color-status-err-text)' }}
                    >
                        <AlertCircle size={32} />
                    </div>
                    <div className="text-center space-y-3 w-full">
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            ¿Estás seguro de eliminar el pago del socio{' '}
                            <strong style={{ color: 'var(--color-text-primary)' }}>
                                {deleteModal.payment?.memberDni}
                            </strong>?
                        </p>
                        <div
                            className="rounded-xl p-4 text-sm text-left"
                            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                        >
                            <p
                                className="font-bold text-xs uppercase tracking-widest mb-2"
                                style={{ color: 'var(--color-gold-500)' }}
                            >
                                ⚠ Consecuencias:
                            </p>
                            <ul className="space-y-1.5 text-xs list-disc pl-4" style={{ color: 'var(--color-text-secondary)' }}>
                                <li>Se eliminará el registro histórico y el pago actual.</li>
                                <li>El vencimiento del socio retrocederá a la fecha anterior.</li>
                                <li>Si era el único pago activo, el socio quedará{' '}
                                    <span style={{ color: 'var(--color-status-err-text)', fontWeight: 'bold' }}>INACTIVO</span>.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Print styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print, nav, aside, button, header { display: none !important; }
                    body { background: white !important; color: black !important; }
                    div { border: none !important; box-shadow: none !important; background: transparent !important; }
                    table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #000 !important; }
                    th { color: black !important; border: 1px solid #000 !important; padding: 8px !important; background-color: #f3f4f6 !important; }
                    td { color: black !important; border: 1px solid #000 !important; padding: 6px !important; }
                    .payment-method-badge { background: transparent !important; border: none !important; color: black !important; }
                }
            `}} />
        </div>
    );
};
