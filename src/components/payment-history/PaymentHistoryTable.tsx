import React, { useState } from 'react';
import { PaymentHistoryResponseDTO } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaymentHistoryTableProps {
    data: PaymentHistoryResponseDTO[];
}

const ROWS_PER_PAGE = 10;

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getPaymentMethodInfo = (method: string) => {
        const info: Record<string, { label: string, emoji: string }> = {
            'CASH': { label: 'Efectivo', emoji: '💵' },
            'CARD': { label: 'Tarjeta', emoji: '💳' },
            'TRANSFER': { label: 'Transferencia', emoji: '🏦' },
        };
        return info[method] || { label: method, emoji: '' };
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-dark-900 border border-dark-700 rounded-xl">
                <span className="text-gray-500 text-lg">No se encontraron pagos en este período.</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-dark-700 shadow-xl scrollbar-thin scrollbar-thumb-dark-600">
                <table className="w-full text-left border-collapse bg-dark-950/30">
                    <thead className="bg-dark-900/80 border-b border-dark-700">
                        <tr className="text-gold-500 font-bold tracking-wider text-sm">
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">DNI</th>
                            <th className="px-6 py-4">Plan / Descripción</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800">
                        {paginatedData.map((payment, idx) => (
                            <tr key={idx} className="hover:bg-dark-800/40 transition-colors group">
                                <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                    {formatDate(payment.paymentDate)}
                                </td>
                                <td className="px-6 py-4 text-gray-200 font-medium">
                                    {payment.memberDni}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-white font-semibold">
                                        {payment.planDescription}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {(() => {
                                        const { label, emoji } = getPaymentMethodInfo(payment.paymentMethod);
                                        return (
                                            <span className="payment-method-badge px-2.5 py-1 bg-dark-800 text-gray-300 rounded-full text-xs font-medium border border-dark-700 flex items-center justify-center gap-1 w-fit">
                                                {label} <span className="no-print">{emoji}</span>
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-gold-400 font-black text-lg">
                                        {formatCurrency(payment.amountPaid)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-sm text-gray-400">
                        Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span>
                        <span className="mx-2 text-dark-700">|</span> Total: <span className="text-gold-500 font-bold">{data.length}</span> registros
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-dark-800 border border-dark-700 rounded-lg text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-dark-800 border border-dark-700 rounded-lg text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
