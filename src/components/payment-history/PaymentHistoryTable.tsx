import React, { useState } from 'react';
import { PaymentHistoryResponseDTO } from '../../types';
import { ChevronLeft, ChevronRight, Trash2, FileX } from 'lucide-react';
import { formatPlanName } from '../../lib/planUtils';
import { parseAndFormatDate } from '../../lib/dateUtils';

interface PaymentHistoryTableProps {
    data: PaymentHistoryResponseDTO[];
    onDelete?: (payment: PaymentHistoryResponseDTO) => void;
}

const ROWS_PER_PAGE = 10;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const PAYMENT_METHOD_INFO: Record<string, { label: string; emoji: string }> = {
    'CASH': { label: 'Efectivo', emoji: '💵' },
    'CARD': { label: 'Tarjeta', emoji: '💳' },
    'TRANSFER': { label: 'Transferencia', emoji: '🏦' },
};

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ data, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-muted)' }}>
                <FileX size={40} className="opacity-40" />
                <span className="text-sm">No se encontraron pagos en este período.</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile-friendly list view (xs–sm) */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {paginatedData.map((payment, idx) => {
                    const methodInfo = PAYMENT_METHOD_INFO[payment.paymentMethod] || { label: payment.paymentMethod, emoji: '' };
                    return (
                        <div key={idx} className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                        {formatPlanName(payment.planDescription)}
                                    </p>
                                    <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                        DNI {payment.memberDni}
                                    </p>
                                </div>
                                <span className="font-black text-lg" style={{ color: 'var(--color-gold-500)' }}>
                                    {formatCurrency(payment.amountPaid)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="payment-method-badge px-2 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                            background: 'var(--color-bg-elevated)',
                                            border: '1px solid var(--color-border-subtle)',
                                            color: 'var(--color-text-secondary)'
                                        }}
                                    >
                                        {methodInfo.emoji} {methodInfo.label}
                                    </span>
                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                        {parseAndFormatDate(payment.paymentDate)}
                                    </span>
                                </div>
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(payment)}
                                        className="p-1.5 rounded-lg transition-all"
                                        style={{ color: 'var(--color-text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-status-err-text)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                                        title="Eliminar pago"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto" style={{ border: '1px solid var(--color-border)', borderRadius: '0.75rem' }}>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ background: 'var(--color-table-head)', borderBottom: '1px solid var(--color-table-divider)' }}>
                            {['Fecha', 'DNI', 'Plan / Descripción', 'Método', 'Monto', ''].map((th, i) => (
                                <th
                                    key={i}
                                    className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${i === 4 ? 'text-right' : ''} ${i === 5 ? 'text-center no-print' : ''}`}
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((payment, idx) => {
                            const methodInfo = PAYMENT_METHOD_INFO[payment.paymentMethod] || { label: payment.paymentMethod, emoji: '' };
                            return (
                                <tr
                                    key={idx}
                                    className="transition-colors duration-150"
                                    style={{
                                        background: idx % 2 === 0 ? 'var(--color-table-row)' : 'var(--color-table-row-alt)',
                                        borderBottom: '1px solid var(--color-table-divider)'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-table-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'var(--color-table-row)' : 'var(--color-table-row-alt)')}
                                >
                                    <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        {parseAndFormatDate(payment.paymentDate)}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                        {payment.memberDni}
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                        {formatPlanName(payment.planDescription)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className="payment-method-badge px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                                            style={{
                                                background: 'var(--color-bg-elevated)',
                                                border: '1px solid var(--color-border-subtle)',
                                                color: 'var(--color-text-secondary)'
                                            }}
                                        >
                                            {methodInfo.label}
                                            <span className="no-print">{methodInfo.emoji}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className="font-black text-base" style={{ color: 'var(--color-gold-500)' }}>
                                            {formatCurrency(payment.amountPaid)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center no-print">
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(payment)}
                                                className="p-2 rounded-lg transition-all"
                                                style={{ color: 'var(--color-text-muted)' }}
                                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-status-err-text)')}
                                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                                                title="Eliminar pago"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Página <b style={{ color: 'var(--color-text-primary)' }}>{currentPage}</b> de{' '}
                        <b style={{ color: 'var(--color-text-primary)' }}>{totalPages}</b>
                        {' — '}
                        <span style={{ color: 'var(--color-gold-500)', fontWeight: 700 }}>{data.length}</span> registros
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                background: 'var(--color-bg-elevated)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                background: 'var(--color-bg-elevated)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
