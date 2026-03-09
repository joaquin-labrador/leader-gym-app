import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { receiptService } from '../services/receiptService';
import { ReceiptHistoryItem } from '../types';
import { toast } from 'sonner';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { parseAndFormatDate } from '../lib/dateUtils';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

const getArgentinaDateString = () => {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
};

const getArgentinaDate = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
};

export const Receipts: React.FC = () => {
    const [dni, setDni] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(getArgentinaDate());
    const [receipts, setReceipts] = useState<ReceiptHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('Ingresos del Día');
    const [subtitle, setSubtitle] = useState('Mostrando ingresos para hoy');

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
            setTitle(formattedDate === todayStr ? 'Ingresos del Día' : `Ingresos del ${formattedDate}`);
            setSubtitle(`Resultados para la fecha: ${formattedDate}`);
        } catch (err: any) {
            toast.error('No se encontraron ingresos para esta fecha');
            setReceipts([]);
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
            setTitle('Historial de Socio');
            setSubtitle(`Resultados para DNI: ${dni}`);
        } catch (err: any) {
            toast.error('Error al buscar historial de ingresos o DNI no encontrado');
            setReceipts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate) {
            fetchHistoryByDate(selectedDate);
        }
    };

    useEffect(() => {
        fetchHistoryByDate(getArgentinaDate());
    }, [fetchHistoryByDate]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Historial de Ingresos</h1>
                <p className="text-gray-400 mt-1">Busque el historial de ingresos por DNI o por una fecha específica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="py-6">
                        <form onSubmit={handleDniSearch} className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Buscar por DNI</label>
                                <Input
                                    placeholder="Ingrese DNI..."
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" isLoading={loading} disabled={!dni.trim()}>
                                    <Search size={18} className="mr-2" />
                                    Buscar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-6">
                        <form onSubmit={handleDateSearch} className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Filtrar por Fecha</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 z-10 pointer-events-none" size={18} />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        locale="es"
                                        maxDate={getArgentinaDate()}
                                        placeholderText="dd/mm/aaaa"
                                        className="w-full px-4 py-2.5 pl-10 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-sans"
                                        wrapperClassName="w-full"
                                        portalId="root-portal"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" variant="secondary" isLoading={loading} disabled={!selectedDate}>
                                    Filtrar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 bg-dark-800 border-b border-dark-700">
                        <h3 className="font-semibold text-gold-400">{title}</h3>
                        <p className="text-xs text-gray-400">{subtitle}</p>
                    </div>
                    <Table
                        data={receipts}
                        isLoading={loading}
                        emptyMessage="No se encontraron ingresos"
                        columns={[
                            { header: 'DNI', accessor: (r) => r.dni },
                            { header: 'Socio', accessor: (r) => `${r.firstName} ${r.lastName}` },
                            {
                                header: 'Fecha',
                                accessor: (r) => parseAndFormatDate(r.date, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit'
                                })
                            }
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
