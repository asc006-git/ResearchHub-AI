import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Navbar />
            <main className="content-container py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
