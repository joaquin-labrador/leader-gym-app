import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import { PaymentHistoryResponseDTO, PaymentHistoryFilterDTO } from '../types';
import { PaymentHistoryFilters } from '../components/payment-history/PaymentHistoryFilters';
import { PaymentHistoryTable } from '../components/payment-history/PaymentHistoryTable';
import { History, FileText, Download } from 'lucide-react';

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

    const fetchHistory = useCallback(async () => {
        // Validación de fechas
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
                endDate: null
            };

            // Lógica de fechas: Enviamos strings YYYY-MM-DD para evitar problemas de zona horaria
            if (filters.month) {
                // Si hay mes seleccionado (YYYY-MM), enviamos el primer día como YYYY-MM-01
                dto.startDate = `${filters.month}-01`;
                dto.endDate = null;
            } else {
                // filters.startDate y filters.endDate ya vienen como YYYY-MM-DD del input type="date"
                if (filters.startDate) dto.startDate = filters.startDate;
                if (filters.endDate) dto.endDate = filters.endDate;
            }

            const data = await paymentService.getFilteredPaymentHistory(dto);
            setHistory(data);
            if (data.length === 0) toast.info('No hay pagos para este filtro.');
        } catch (err: any) {
            toast.error('No se pudo cargar el historial de pagos. ' + (err.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Carga inicial (todo el historial)
    useEffect(() => {
        fetchHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClear = () => {
        setFilters({
            memberDni: '',
            paymentMethod: 'ALL',
            month: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center text-dark-950 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                        <History size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                            Historial de Pagos
                        </h1>
                        <p className="text-gray-400 text-sm font-medium tracking-wide">
                            Administración y reporte de ingresos del gimnasio
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-800 text-gold-500 hover:bg-dark-700 rounded-xl transition-all font-bold border border-dark-700"
                    >
                        <Download size={18} /> Imprimir Reporte
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <PaymentHistoryFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchHistory}
                onClear={handleClear}
                loading={loading}
            />

            {/* Table / Results Section */}
            <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                {/* Subtle background glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-gold-500/10 transition-all duration-700" />

                <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-gold-500" /> Resultados del Período
                </h3>

                <PaymentHistoryTable data={history} />

                {loading && (
                    <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10 animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            <span className="text-gold-500 font-bold tracking-widest uppercase text-xs">Sincronizando...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Print styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print, nav, aside, button, header, .filters-container { display: none !important; }
                    body { background: white !important; color: black !important; padding: 0 !important; }
                    
                    /* Reset container styles */
                    div { border: none !important; box-shadow: none !important; background: transparent !important; }
                    
                    /* Fix Table layout */
                    table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #000 !important; }
                    th { 
                        color: black !important; 
                        border: 1px solid #000 !important; 
                        padding: 10px !important; 
                        background-color: #f3f4f6 !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    td { 
                        color: black !important; 
                        border: 1px solid #000 !important; 
                        padding: 8px !important; 
                    }
                    
                    /* Force text colors */
                    .text-gold-500, .text-gold-400, .text-white, .text-gray-400, .text-gray-200 { color: black !important; }
                    
                    /* Fix Payment Method Badge for Print */
                    .payment-method-badge { 
                        background: transparent !important; 
                        border: none !important; 
                        color: black !important; 
                        padding: 0 !important; 
                        font-size: 10pt !important;
                        display: block !important;
                        text-align: left !important;
                    }
                    
                    /* Fix Date wrapping */
                    td:first-child { white-space: nowrap !important; }

                    /* Hide history icon and description from report if needed, or keep it clean */
                    .bg-gold-500 { display: none !important; }
                    h1 { margin-top: 0 !important; font-size: 24pt !important; }
                }
            `}} />
        </div>
    );
};
