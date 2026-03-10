import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { receiptService } from '../services/receiptService';
import { ReceiptHistoryItem } from '../types';
import { toast } from 'sonner';
import { Search, Calendar as CalendarIcon, History } from 'lucide-react';
import { parseAndFormatDate } from '../lib/dateUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

const getArgentinaDateString = () =>
    new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });

const getArgentinaDate = () =>
    new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));

export const Receipts: React.FC = () => {
    const [dni, setDni] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(getArgentinaDate());
    const [receipts, setReceipts] = useState<ReceiptHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [resultInfo, setResultInfo] = useState<{ title: string; subtitle: string }>({
        title: 'Ingresos del Día',
        subtitle: 'Mostrando todos los ingresos de hoy'
    });

    const fetchHistoryByDate = useCallback(async (date: Date) => {
        setLoading(true);
        try {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            const data = await receiptService.getHistoryByDate(formattedDate);
            setReceipts(data);

            const todayStr = getArgentinaDateString().split('-').reverse().join('/');
            const isToday = formattedDate === todayStr;
            setResultInfo({
                title: isToday ? 'Ingresos del Día' : `Ingresos del ${formattedDate}`,
                subtitle: `${data.length} ingreso${data.length !== 1 ? 's' : ''} para el ${formattedDate}`
            });
        } catch {
            toast.error('No se encontraron ingresos para esta fecha');
            setReceipts([]);
            setResultInfo({ title: 'Sin resultados', subtitle: 'No se encontraron ingresos para la fecha seleccionada' });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDniSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;
        setLoading(true);
        try {
            const data = await receiptService.getReceiptHistory(dni);
            setReceipts(data);
            setResultInfo({
                title: 'Historial de Socio',
                subtitle: `${data.length} ingreso${data.length !== 1 ? 's' : ''} para DNI: ${dni}`
            });
        } catch {
            toast.error('DNI no encontrado o sin historial de ingresos');
            setReceipts([]);
            setResultInfo({ title: 'Sin resultados', subtitle: `No se encontraron ingresos para DNI: ${dni}` });
        } finally {
            setLoading(false);
        }
    };

    const handleDateSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate) fetchHistoryByDate(selectedDate);
    };

    useEffect(() => {
        fetchHistoryByDate(getArgentinaDate());
    }, [fetchHistoryByDate]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                    Historial de Ingresos
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Buscá el historial de ingresos por DNI o por fecha específica.
                </p>
            </div>

            {/* Filtros en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Búsqueda por DNI */}
                <Card>
                    <CardContent className="py-5">
                        <form onSubmit={handleDniSearch} className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                                Buscar por DNI
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Ingrese DNI..."
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    icon={<Search size={15} />}
                                />
                                <Button type="submit" isLoading={loading} disabled={!dni.trim()} className="shrink-0">
                                    Buscar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Filtro por Fecha */}
                <Card>
                    <CardContent className="py-5">
                        <form onSubmit={handleDateSearch} className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                                Filtrar por Fecha
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <CalendarIcon
                                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                                        size={15}
                                        style={{ color: 'var(--color-gold-500)' }}
                                    />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        locale="es"
                                        maxDate={getArgentinaDate()}
                                        placeholderText="dd/mm/aaaa"
                                        className="w-full px-4 py-2.5 pl-9 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/40 bg-[var(--color-input-bg)] border-[1px] border-[var(--color-input-border)] text-[var(--color-text-primary)]"
                                        wrapperClassName="w-full"
                                        portalId="root-portal"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" isLoading={loading} disabled={!selectedDate} className="shrink-0">
                                    Filtrar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de resultados */}
            <Card>
                <div
                    className="flex items-center gap-3 px-5 py-3.5"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}
                >
                    <History size={18} style={{ color: 'var(--color-gold-500)' }} />
                    <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-gold-500)' }}>
                            {resultInfo.title}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {resultInfo.subtitle}
                        </p>
                    </div>
                </div>
                <CardContent className="p-0">
                    <Table
                        data={receipts}
                        isLoading={loading}
                        emptyMessage="No se encontraron ingresos"
                        emptyIcon={<History size={48} />}
                        columns={[
                            {
                                header: 'DNI',
                                accessor: (r) => (
                                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                                        {r.dni}
                                    </span>
                                )
                            },
                            {
                                header: 'Socio',
                                accessor: (r) => (
                                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                        {r.firstName} {r.lastName}
                                    </span>
                                )
                            },
                            {
                                header: 'Fecha y Hora',
                                accessor: (r) => (
                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                                        {parseAndFormatDate(r.date, { year: 'numeric', month: 'short', day: '2-digit' })}
                                    </span>
                                )
                            },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
