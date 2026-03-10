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

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500";
const inputStyle: React.CSSProperties = {
    background: 'var(--color-input-bg)',
    border: '1px solid var(--color-input-border)',
    color: 'var(--color-text-primary)',
};

export const PaymentHistoryFilters: React.FC<PaymentHistoryFiltersProps> = ({
    filters, setFilters, onSearch, onClear, loading
}) => {
    return (
        <div
            className="rounded-xl p-5 space-y-5 no-print"
            style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* DNI */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                        DNI del Socio
                    </label>
                    <input
                        type="text"
                        value={filters.memberDni}
                        onChange={(e) => setFilters({ ...filters, memberDni: e.target.value })}
                        placeholder="Filtrar por DNI..."
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>

                {/* Método de Pago */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                        Método de Pago
                    </label>
                    <select
                        value={filters.paymentMethod}
                        onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                        className={`${inputClass} appearance-none`}
                        style={inputStyle}
                    >
                        <option value="ALL">Todos los métodos</option>
                        <option value="CASH">Efectivo 💵</option>
                        <option value="CARD">Tarjeta 💳</option>
                        <option value="TRANSFER">Transferencia 🏦</option>
                    </select>
                </div>

                {/* Mes */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                        Desde el Mes
                    </label>
                    <input
                        type="month"
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value, startDate: '', endDate: '' })}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>

                {/* Rango de fechas */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                        Rango de Fechas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={filters.startDate}
                            disabled={!!filters.month}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value, month: '' })}
                            className={inputClass}
                            style={{ ...inputStyle, opacity: filters.month ? 0.4 : 1 }}
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            disabled={!!filters.month}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value, month: '' })}
                            className={inputClass}
                            style={{ ...inputStyle, opacity: filters.month ? 0.4 : 1 }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="flex flex-col sm:flex-row justify-end gap-3 pt-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
            >
                <button
                    onClick={onClear}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:brightness-95 active:scale-95"
                    style={{
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-text-secondary)'
                    }}
                >
                    Limpiar Filtros
                </button>
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl font-bold text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
                        color: '#030712',
                        boxShadow: '0 0 14px rgba(245,158,11,0.25)'
                    }}
                >
                    {loading ? 'Buscando...' : '🔍 Buscar'}
                </button>
            </div>
        </div>
    );
};
