import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, LogOut, Layers, Search, History, Settings, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
    onToggleSidebar?: () => void;
    isSidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const pageTitle = useMemo(() => {
        const path = location.pathname;
        if (path === '/dashboard') return { main: 'INTEL GRID', sub: 'DASHBOARD' };
        if (path === '/search') return { main: 'SCHOLARLY HUB', sub: 'SEARCH' };
        if (path === '/history') return { main: 'ARCHIVE', sub: 'HISTORY' };
        if (path === '/settings') return { main: 'ENGINE CONFIG', sub: 'SETTINGS' };
        if (path.startsWith('/workspace/')) return { main: 'RESEARCH MATRIX', sub: 'WORKSPACE' };
        return { main: 'RESEARCHHUB', sub: 'AI' };
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="sticky top-0 z-40 bg-[#0b1220]/70 border-b border-white/10 backdrop-blur-xl transition-all duration-300">
            <div className="px-4 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-6">
                        {onToggleSidebar && (
                            <button
                                onClick={onToggleSidebar}
                                className="lg:hidden p-2 text-[#94a3b8] hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5"
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        )}

                        {/* Breadcrumb / Location Indicator */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="p-1.5 bg-[var(--accent-color)]/10 rounded border border-[var(--accent-color)]/20">
                                <Layers className="h-3.5 w-3.5 text-[var(--accent-color)]" />
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] font-black tracking-[0.2em] uppercase">
                                <span className="text-[#4b5563]">{pageTitle.main}</span>
                                <span className="text-[#1e293b]">/</span>
                                <span className="text-[var(--accent-color)]">{pageTitle.sub}</span>
                            </div>
                        </div>

                        {/* Mobile Logo Branding */}
                        <div className="flex items-center space-x-3 md:hidden">
                            <BookOpen className="h-6 w-6 text-[var(--accent-color)]" />
                            <span className="font-bold text-lg text-white tracking-tight">RH <span className="text-[var(--accent-color)]">AI</span></span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Space for additional navbar items if needed */}
                    </div>
                </div>
            </div>

            {/* Subtle bottom glow line */}
            <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)]/20 to-transparent"></div>
        </nav>
    );
};

export default Navbar;
