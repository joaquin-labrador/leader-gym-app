import React from 'react';

interface Filters {
    memberDni: string;
    paymentMethod: string;
    month: string;
    startDate: string;
    endDate: string;
}

interface PaymentHistoryFiltersProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    onSearch: () => void;
    onClear: () => void;
    loading: boolean;
}

export const PaymentHistoryFilters: React.FC<PaymentHistoryFiltersProps> = ({
    filters,
    setFilters,
    onSearch,
    onClear,
    loading
}) => {
    return (
        <div className="bg-dark-900/50 p-6 rounded-xl border border-dark-700 space-y-6 no-print">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* DNI */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">DNI del Socio</label>
                    <input
                        type="text"
                        value={filters.memberDni}
                        onChange={(e) => setFilters({ ...filters, memberDni: e.target.value })}
                        placeholder="Filtrar por DNI..."
                        className="w-full px-4 py-2 bg-dark-950 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-gold-500/50 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>

                {/* Método de Pago */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Método de Pago</label>
                    <select
                        value={filters.paymentMethod}
                        onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-950 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-gold-500/50 outline-none transition-all appearance-none"
                    >
                        <option value="ALL">Todos los métodos</option>
                        <option value="CASH">Efectivo 💵</option>
                        <option value="CARD">Tarjeta 💳</option>
                        <option value="TRANSFER">Transferencia 🏦</option>
                    </select>
                </div>

                {/* Mes desde */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Desde el mes</label>
                    <input
                        type="month"
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value, startDate: '', endDate: '' })}
                        className="w-full px-4 py-2 bg-dark-950 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-gold-500/50 outline-none transition-all"
                    />
                </div>

                {/* Rango de fechas */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Rango (Opcional)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={filters.startDate}
                            disabled={!!filters.month}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value, month: '' })}
                            className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-lg text-white text-xs disabled:opacity-30 outline-none transition-all"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            disabled={!!filters.month}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value, month: '' })}
                            className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-lg text-white text-xs disabled:opacity-30 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-dark-800">
                <button
                    onClick={onClear}
                    className="px-6 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors font-medium border border-dark-700"
                >
                    Limpiar
                </button>
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="px-8 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-dark-950 rounded-lg transition-all font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
        </div>
    );
};
