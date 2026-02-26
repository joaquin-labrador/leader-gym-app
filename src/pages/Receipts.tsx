import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { receiptService } from '../services/receiptService';
import { ReceiptHistoryItem } from '../types';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Historial de Ingresos</h1>
                <p className="text-gray-400 mt-1">Busque el historial de ingresos por el DNI del socio</p>
            </div>

            <Card>
                <CardContent className="py-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 max-w-sm">
                            <Input
                                placeholder="Ingrese DNI..."
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                            />
                        </div>
                        <Button type="submit" isLoading={loading} disabled={!dni.trim()}>
                            <Search size={18} className="mr-2" />
                            Buscar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {hasSearched && (
                <Card>
                    <CardContent className="p-0">
                        <div className="p-4 bg-dark-800 border-b border-dark-700">
                            <h3 className="font-semibold text-gold-400">Resultados para DNI: {searchDni}</h3>
                        </div>
                        <Table
                            data={receipts}
                            isLoading={loading}
                            emptyMessage="No se encontraron ingresos para este DNI"
                            columns={[
                                { header: 'DNI', accessor: (r) => r.dni },
                                { header: 'Socio', accessor: (r) => `${r.firstName} ${r.lastName}` },
                                {
                                    header: 'Fecha',
                                    accessor: (r) => new Date(r.date).toLocaleDateString('es-AR')
                                }
                            ]}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
