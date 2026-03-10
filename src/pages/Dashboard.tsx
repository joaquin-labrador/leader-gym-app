import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Activity, Users, DollarSign, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
    {
        label: 'Check-In Rápido',
        description: 'Registrar Ingreso',
        to: '/check-in',
        icon: <CheckSquare size={28} />,
        iconColor: 'var(--color-gold-500)',
        iconBg: 'rgba(245,158,11,0.12)',
        hoverColor: 'var(--color-gold-400)',
    },
    {
        label: 'Pagos',
        description: 'Nuevo Pago de Plan',
        to: '/payments',
        icon: <DollarSign size={28} />,
        iconColor: '#4ADE80',
        iconBg: 'rgba(74,222,128,0.1)',
        hoverColor: '#4ADE80',
    },
    {
        label: 'Socios',
        description: 'Gestionar Socios',
        to: '/members',
        icon: <Users size={28} />,
        iconColor: '#60A5FA',
        iconBg: 'rgba(96,165,250,0.1)',
        hoverColor: '#60A5FA',
    },
    {
        label: 'Planes',
        description: 'Ver y Editar Planes',
        to: '/plans',
        icon: <Activity size={28} />,
        iconColor: '#C084FC',
        iconBg: 'rgba(192,132,252,0.1)',
        hoverColor: '#C084FC',
    },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1
                    className="text-3xl font-black tracking-tight"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Panel Principal
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Bienvenido al sistema de gestión de Leader Gym
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Card key={action.to} className="group hover:scale-[1.02] transition-all duration-200">
                        <CardContent className="flex items-center gap-4 py-6 px-5">
                            <div
                                className="p-3 rounded-xl shrink-0"
                                style={{ background: action.iconBg, color: action.iconColor }}
                            >
                                {action.icon}
                            </div>
                            <div className="min-w-0">
                                <p
                                    className="text-xs font-medium uppercase tracking-wider"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {action.label}
                                </p>
                                <Link
                                    to={action.to}
                                    className="text-sm font-bold transition-colors duration-150 block mt-0.5"
                                    style={{ color: 'var(--color-text-primary)' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = action.hoverColor)}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                                >
                                    {action.description} →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info banner */}
            <div
                className="rounded-xl p-5 flex items-start gap-4"
                style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)',
                    border: '1px solid rgba(245,158,11,0.2)'
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-gold-400)' }}
                >
                    <CheckSquare size={20} />
                </div>
                <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-gold-400)' }}>
                        Sistema funcionando correctamente
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        Todos los módulos están activos. Usá la barra lateral para navegar.
                    </p>
                </div>
            </div>
        </div>
    );
};
