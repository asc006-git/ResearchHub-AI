import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

const DashboardLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0b1220] overflow-hidden">
            {/* Sidebar toggle for mobile/tablet */}
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar wrapper */}
            <div className={`fixed lg:relative inset-y-0 left-0 z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
