import React from 'react';
import { Loader2 } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
}

export function Table<T>({ columns, data, isLoading, emptyMessage = 'No hay resultados', emptyIcon }: TableProps<T>) {
    if (isLoading) {
        return (
            <div
                className="w-full py-16 flex flex-col items-center justify-center gap-3 rounded-xl"
                style={{ color: 'var(--color-text-muted)' }}
            >
                <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-gold-500)' }} />
                <span className="text-sm font-medium">Cargando datos...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div
                className="w-full py-16 flex flex-col items-center justify-center gap-3 rounded-xl"
                style={{ color: 'var(--color-text-muted)' }}
            >
                {emptyIcon && <div className="opacity-40">{emptyIcon}</div>}
                <span className="text-sm">{emptyMessage}</span>
            </div>
        );
    }

    return (
        <div
            className="w-full overflow-x-auto rounded-xl"
            style={{ border: '1px solid var(--color-border)' }}
        >
            <table className="w-full text-left text-sm">
                <thead>
                    <tr style={{ background: 'var(--color-table-head)', borderBottom: '1px solid var(--color-table-divider)' }}>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${col.className ?? ''}`}
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody
                    style={{ background: 'var(--color-table-row)' }}
                >
                    {data.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className="transition-colors duration-150 hover:brightness-95"
                            style={{
                                background: rowIdx % 2 === 0 ? 'var(--color-table-row)' : 'var(--color-table-row-alt)',
                                borderBottom: '1px solid var(--color-table-divider)',
                            }}
                        >
                            {columns.map((col, colIdx) => (
                                <td
                                    key={colIdx}
                                    className={`px-5 py-3.5 ${col.className ?? ''}`}
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {col.accessor(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
