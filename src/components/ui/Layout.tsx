import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, Dumbbell, CreditCard, CheckCircle, History } from 'lucide-react';
import { Toaster } from 'sonner';

export const Layout: React.FC = () => {
    const navItems = [
        { to: '/', label: 'Inicio', icon: <Home size={20} /> },
        { to: '/check-in', label: 'Check-In', icon: <CheckCircle size={20} /> },
        { to: '/members', label: 'Socios', icon: <Users size={20} /> },
        { to: '/plans', label: 'Planes', icon: <Dumbbell size={20} /> },
        { to: '/payments', label: 'Pagos', icon: <CreditCard size={20} /> },
        { to: '/receipts', label: 'Historial', icon: <History size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-dark-950 text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col fixed inset-y-0 shadow-glow">
                <div className="p-6 flex items-center justify-center border-b border-dark-800">
                    {/* Mock logo since I don't have the file physically available right here during build */}
                    <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        <span className="text-gold-500">LEADER</span> GYM
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-gold-500 text-dark-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 text-xs text-gray-600 text-center border-t border-dark-800">
                    &copy; {new Date().getFullYear()} Leader Gym Admin
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
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
