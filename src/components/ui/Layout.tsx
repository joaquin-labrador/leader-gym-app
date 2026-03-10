import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home, Users, Dumbbell, CreditCard, CheckCircle,
    History, ChevronLeft, Menu, LogOut, User as UserIcon,
    FileText, Banknote, X, Sun, Moon
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
    { to: '/', label: 'Inicio', icon: <Home size={20} />, end: true },
    { to: '/check-in', label: 'Check-In', icon: <CheckCircle size={20} /> },
    { to: '/members', label: 'Socios', icon: <Users size={20} /> },
    { to: '/plans', label: 'Planes', icon: <Dumbbell size={20} /> },
    { to: '/payments', label: 'Pagos de Plan', icon: <CreditCard size={20} /> },
    { to: '/extra-payments', label: 'Pagos Sueltos', icon: <Banknote size={20} /> },
    { to: '/receipts', label: 'Historial de Ingresos', icon: <History size={20} /> },
    { to: '/payment-history', label: 'Arqueo / Caja', icon: <FileText size={20} /> },
];

export const Layout: React.FC = () => {
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Sesión cerrada correctamente');
            navigate('/login');
        } catch {
            toast.error('Error al cerrar sesión');
        }
    };

    const sidebarContent = (isMobile = false) => (
        <div
            className="flex flex-col h-full theme-transition"
            style={{
                background: 'var(--color-sidebar-bg)',
                borderRight: '1px solid var(--color-sidebar-border)'
            }}
        >
            {/* Logo Header */}
            <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'var(--color-sidebar-border)' }}
            >
                {(!desktopCollapsed || isMobile) && (
                    <div className="text-xl font-black tracking-tight select-none" style={{ color: 'var(--color-text-primary)' }}>
                        <span style={{ color: 'var(--color-gold-400)' }}>LEADER</span>{' '}
                        <span>GYM</span>
                    </div>
                )}
                {isMobile ? (
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-sidebar-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        aria-label="Cerrar menú"
                    >
                        <X size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => setDesktopCollapsed(p => !p)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-sidebar-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        aria-label={desktopCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                    >
                        <ChevronLeft
                            size={18}
                            style={{ transform: desktopCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                        />
                    </button>
                )}
            </div>

            {/* User Info */}
            {user && (!desktopCollapsed || isMobile) && (
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-sidebar-border)' }}>
                    <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                        style={{ background: 'var(--color-bg-base)' }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                            style={{ background: 'var(--color-gold-500)', color: '#000' }}
                        >
                            <UserIcon size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{user.username}</p>
                            <p className="text-[10px] uppercase tracking-widest font-extrabold" style={{ color: 'var(--color-gold-600)' }}>
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Collapsed User avatar */}
            {user && desktopCollapsed && !isMobile && (
                <div className="flex justify-center py-3 border-b" style={{ borderColor: 'var(--color-sidebar-border)' }}>
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-gold-500)', color: '#000' }}
                        title={user.username}
                    >
                        <UserIcon size={18} />
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                            ${desktopCollapsed && !isMobile ? 'justify-center' : ''}`
                        }
                        style={({ isActive }) => isActive
                            ? {
                                background: 'linear-gradient(135deg, var(--color-gold-400) 0%, var(--color-gold-600) 100%)',
                                color: '#030712',
                                boxShadow: '0 4px 12px rgba(245,158,11,0.25)'
                            }
                            : {
                                color: 'var(--color-sidebar-text)'
                            }
                        }
                        onMouseEnter={e => {
                            const target = e.currentTarget;
                            if (!target.classList.contains('active')) {
                                target.style.background = 'var(--color-sidebar-hover)';
                                target.style.color = 'var(--color-text-primary)';
                            }
                        }}
                        onMouseLeave={e => {
                            const target = e.currentTarget;
                            if (!target.classList.contains('active')) {
                                target.style.background = 'transparent';
                                target.style.color = 'var(--color-sidebar-text)';
                            }
                        }}
                        title={desktopCollapsed && !isMobile ? item.label : undefined}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        {(!desktopCollapsed || isMobile) && <span className="truncate text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: 'var(--color-sidebar-border)' }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all font-medium
                        ${desktopCollapsed && !isMobile ? 'justify-center' : ''}`}
                    style={{ color: 'var(--color-sidebar-text)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--color-sidebar-hover)';
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-sidebar-text)';
                    }}
                >
                    <span className="shrink-0">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </span>
                    {(!desktopCollapsed || isMobile) && (
                        <span className="text-sm">{isDark ? 'Tema Claro' : 'Tema Oscuro'}</span>
                    )}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all font-medium
                        ${desktopCollapsed && !isMobile ? 'justify-center' : ''}`}
                    style={{ color: 'var(--color-sidebar-text)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--color-status-err-bg)';
                        e.currentTarget.style.color = 'var(--color-status-err-text)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-sidebar-text)';
                    }}
                >
                    <span className="shrink-0"><LogOut size={20} /></span>
                    {(!desktopCollapsed || isMobile) && <span className="text-sm">Cerrar Sesión</span>}
                </button>
            </div>

            {(!desktopCollapsed || isMobile) && (
                <div className="px-4 pb-3 text-[10px] text-center" style={{ color: 'var(--color-text-muted)' }}>
                    © {new Date().getFullYear()} Leader Gym Admin
                </div>
            )}
        </div>
    );

    const sidebarWidth = desktopCollapsed ? 72 : 240;

    return (
        <div
            className="flex min-h-screen"
            style={{ background: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
        >
            {/* ── DESKTOP SIDEBAR ── */}
            <aside
                className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30 shadow-xl transition-all duration-300 ease-in-out overflow-hidden"
                style={{ width: sidebarWidth, borderRight: 'none' }}
            >
                {sidebarContent(false)}
            </aside>

            {/* ── MOBILE OVERLAY + DRAWER ── */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {sidebarContent(true)}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div
                className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
                style={{ marginLeft: window.innerWidth >= 768 ? sidebarWidth : 0 }}
            >
                {/* Mobile top bar */}
                <header
                    className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b shadow-sm theme-transition"
                    style={{
                        background: 'var(--color-sidebar-bg)',
                        borderColor: 'var(--color-sidebar-border)'
                    }}
                >
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-sidebar-text)' }}
                        aria-label="Abrir menú"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="text-lg font-black select-none" style={{ color: 'var(--color-text-primary)' }}>
                        <span style={{ color: 'var(--color-gold-400)' }}>LEADER</span> GYM
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-sidebar-text)' }}
                        aria-label="Cambiar tema"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Toaster */}
            <Toaster
                theme={theme}
                position="top-right"
                toastOptions={{
                    style: isDark
                        ? { background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }
                        : { background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A' },
                    className: 'font-sans text-sm'
                }}
                richColors
            />
        </div>
    );
};
