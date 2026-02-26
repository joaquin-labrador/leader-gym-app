export const PLAN_NAMES: Record<string, string> = {
    'MONTHLY_FREE': 'Libre Mensual',
    'THREE_TIMES_PER_WEEK': '3 veces por semana',
    'FIFTEEN_DAYS': 'Quincena',
    'WEEKLY': 'Semanal',
    'DAILY': 'Diario',
    'MONTHLY_FREE_FRIEND': 'Libre Mensual (Amigo)',
};

export const formatPlanName = (name?: string): string => {
    if (!name) return '-';
    return PLAN_NAMES[name] || name;
};
