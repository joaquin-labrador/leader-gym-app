import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { receiptService } from '../services/receiptService';
import { ReceiptHistoryItem } from '../types';
import { toast } from 'sonner';
import { Search, Calendar, User, Fingerprint, History, CheckCircle2 } from 'lucide-react';

export const Receipts: React.FC = () => {
    const [dni, setDni] = useState('');
    const [searchDni, setSearchDni] = useState('');
    const [receipts, setReceipts] = useState<ReceiptHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;

        setLoading(true);
        setSearchDni(dni);
        try {
            const data = await receiptService.getReceiptHistory(dni);
            setReceipts(data);
            setHasSearched(true);
        } catch (err: any) {
            toast.error('Error al buscar historial de ingresos o DNI no encontrado');
            setReceipts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <History className="text-gold-500" size={32} />
                        Historial de Ingresos
                    </h1>
                    <p className="text-gray-400 mt-2">Consulte el registro histórico de accesos al gimnasio.</p>
                </div>

                {hasSearched && receipts.length > 0 && (
                    <div className="px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                        <span className="text-sm text-gray-400">Total ingresos:</span>
                        <span className="ml-2 text-xl font-bold text-gold-500">{receipts.length}</span>
                    </div>
                )}
            </div>

            <Card className="border-gold-500/10 bg-dark-800/50 backdrop-blur-sm">
                <CardContent className="py-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-3xl">
                        <div className="flex-1 relative">
                            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                placeholder="DNI del socio..."
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                className="pl-10 text-lg h-12"
                            />
                        </div>
                        <Button type="submit" isLoading={loading} disabled={!dni.trim()} className="h-12 px-8">
                            <Search size={20} className="mr-2" />
                            Buscar Historial
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {hasSearched && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-4 w-1 bg-gold-500 rounded-full" />
                        <h3 className="font-semibold text-lg text-gray-200">
                            Resultados para <span className="text-gold-400">{searchDni}</span>
                        </h3>
                    </div>

                    <Card className="overflow-hidden border-dark-700 shadow-xl">
                        <CardContent className="p-0">
                            <Table
                                data={receipts}
                                isLoading={loading}
                                emptyMessage="No se encontraron registros de ingreso para este socio"
                                columns={[
                                    {
                                        header: 'DNI',
                                        accessor: (r) => (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Fingerprint size={16} />
                                                <span>{r.dni}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Socio',
                                        accessor: (r) => (
                                            <div className="flex items-center gap-2 font-medium text-gray-100">
                                                <User size={16} className="text-blue-400" />
                                                <span>{r.firstName} {r.lastName}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Fecha de Ingreso',
                                        accessor: (r) => (
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Calendar size={16} className="text-gold-500" />
                                                <span>{new Date(r.date).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Estado',
                                        accessor: () => (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                                <CheckCircle2 size={12} />
                                                ACCESO VÁLIDO
                                            </span>
                                        )
                                    }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
