/**
 * Formatea una fecha recibida del backend (posiblemente en DD/MM/YYYY o YYYY-MM-DD)
 * a un formato legible para el usuario.
 */
export const parseAndFormatDate = (
    dateString: string | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }
): string => {
    if (!dateString) return '-';

    try {
        // Caso 1: Formato DD/MM/YYYY (común en respuestas del backend de pagos)
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts.map(Number);
                // new Date uses month 0-11
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-AR', options);
                }
            }
        }

        // Caso 2: Formato YYYY-MM-DD (ISO date)
        // Evitamos usar new Date(string) directamente porque puede causar desfases por zona horaria
        if (dateString.includes('-') && !dateString.includes('T')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts.map(Number);
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-AR', options);
                }
            }
        }

        // Fallback general para otros strings de fecha (ISO full, etc)
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-AR', options);
        }

        return dateString;
    } catch (e) {
        console.error('Error formatting date:', dateString, e);
        return dateString;
    }
};
