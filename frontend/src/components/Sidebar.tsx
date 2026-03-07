import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Search as SearchIcon,
    History,
    Settings,
    LogOut,
    BookOpen,
    User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Search Papers', path: '/search', icon: SearchIcon },
        { name: 'History', path: '/history', icon: History },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const displayName = user?.full_name || user?.email?.split('@')[0] || 'Researcher';

    return (
        <aside className="relative flex flex-col h-full w-[240px] bg-[#111827] border-r border-white/5 z-20 overflow-hidden">
            {/* Logo */}
            <div className="p-8 flex items-center space-x-3">
                <div className="bg-[var(--accent-color)] p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-[#0b1220]" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white uppercase">ResearchHub <span className="text-[var(--accent-color)]">AI</span></span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] border-l-2 border-[var(--accent-color)]'
                                : 'text-[#94a3b8] hover:text-[#e5e7eb] hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-[#0f172a] border border-white/5 group transition-all hover:border-[var(--accent-color)]/20">
                    <div className="h-10 w-10 min-w-[40px] rounded-full bg-[#1e293b] flex items-center justify-center text-[var(--accent-color)] border border-white/10">
                        <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#e5e7eb] truncate">{displayName}</span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)]"></span>
                            <span className="text-[9px] font-bold text-[var(--accent-color)] uppercase tracking-[0.1em]">Authenticated</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[#94a3b8] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold text-sm uppercase tracking-wider">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
