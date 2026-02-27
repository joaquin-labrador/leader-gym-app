import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, Dumbbell, CreditCard, CheckCircle, History, ChevronLeft, Menu } from 'lucide-react';
import { Toaster } from 'sonner';

export const Layout: React.FC = () => {
    const [isHidden, setIsHidden] = useState(false);

    const navItems = [
        { to: '/', label: 'Inicio', icon: <Home size={20} /> },
        { to: '/check-in', label: 'Check-In', icon: <CheckCircle size={20} /> },
        { to: '/members', label: 'Socios', icon: <Users size={20} /> },
        { to: '/plans', label: 'Planes', icon: <Dumbbell size={20} /> },
        { to: '/payments', label: 'Pagos', icon: <CreditCard size={20} /> },
        { to: '/receipts', label: 'Historial', icon: <History size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-dark-950 text-gray-100 font-sans">
            {/* Toggle Button for when sidebar is hidden */}
            {isHidden && (
                <button
                    onClick={() => setIsHidden(false)}
                    className="fixed top-6 left-6 z-[60] bg-gold-500 text-dark-950 p-3 rounded-xl shadow-glow hover:scale-105 transition-all animate-in fade-in zoom-in duration-300"
                    title="Mostrar menú"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`bg-dark-900 border-r border-dark-800 flex flex-col fixed inset-y-0 shadow-glow transition-all duration-300 ease-in-out z-50 ${isHidden ? '-translate-x-full' : 'translate-x-0'
                    } w-64`}
            >
                <div className="p-6 flex items-center justify-between border-b border-dark-800">
                    <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className="text-gold-500">LEADER</span> GYM
                    </div>

                    <button
                        onClick={() => setIsHidden(true)}
                        className="bg-dark-800 text-gray-400 p-2 rounded-lg hover:bg-dark-700 hover:text-gold-500 transition-colors"
                        title="Ocultar menú"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap ${isActive
                                    ? 'bg-gold-500 text-dark-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 text-xs text-gray-600 text-center border-t border-dark-800">
                    © {new Date().getFullYear()} Leader Gym Admin
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ease-in-out p-8 ${isHidden ? 'ml-0' : 'ml-64'}`}>
                <div className={`max-w-6xl mx-auto ${isHidden ? 'pt-14' : ''}`}>
                    <Outlet />
                </div>
            </main>

            {/* Global Toaster for notifications */}
            <Toaster
                theme="dark"
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1F2937',
                        border: '1px solid #374151',
                        color: '#F9FAFB'
                    },
                    className: 'font-sans'
                }}
            />
        </div>
    );
};
