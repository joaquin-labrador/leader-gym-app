import React from 'react';

interface Column<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function Table<T>({ columns, data, isLoading, emptyMessage = "No hay resultados" }: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full h-32 flex items-center justify-center text-gray-500">
                <svg className="animate-spin h-6 w-6 mr-3 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando datos...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-32 flex items-center justify-center text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full rounded-xl border border-dark-800">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-dark-800 text-gray-300 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-dark-900 divide-y divide-dark-800">
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-dark-800/50 transition-colors">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 text-gray-200">
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
