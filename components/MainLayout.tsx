import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, ListIcon, CalendarIcon, ReportsIcon, LogoutIcon, MenuIcon, CloseIcon, ChevronLeftIcon, StarIcon, CalendarDaysIcon } from './icons';
import FloatingCalculatorButton from './FloatingCalculatorButton';
import FinancialInsightBanner from './FinancialInsightBanner';

const NavItem: React.FC<{ to: string, isCollapsed: boolean, icon: React.ReactNode, label: string }> = ({ to, isCollapsed, icon, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center h-12 px-4 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : 'justify-start'} ${
          isActive 
            ? 'bg-blue-100 text-blue-600 font-semibold' 
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
        {icon}
        <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{label}</span>
    </NavLink>
);

const SidebarContent: React.FC<{ isCollapsed: boolean, onToggleCollapse?: () => void }> = ({ isCollapsed, onToggleCollapse }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="h-full bg-white flex flex-col p-4">
             <div className={`flex items-center h-16 mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-300`}>
                 <h2 className={`text-2xl font-bold whitespace-nowrap transition-opacity bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Conta Fácil</h2>
                 {onToggleCollapse && (
                    <button onClick={onToggleCollapse} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                             <ChevronLeftIcon />
                        </div>
                    </button>
                )}
            </div>
            
            <nav className="flex-1 space-y-2">
                <NavItem to="/dashboard" isCollapsed={isCollapsed} icon={<HomeIcon />} label="Painel Principal" />
                <NavItem to="/transactions" isCollapsed={isCollapsed} icon={<ListIcon />} label="Meus Lançamentos" />
                <NavItem to="/fixed-expenses" isCollapsed={isCollapsed} icon={<CalendarIcon />} label="Gastos Fixos" />
                <NavItem to="/wishlist" isCollapsed={isCollapsed} icon={<StarIcon />} label="Lista de Desejos" />
                <NavItem to="/reports" isCollapsed={isCollapsed} icon={<ReportsIcon />} label="Relatórios" />
                <NavItem to="/calendar" isCollapsed={isCollapsed} icon={<CalendarDaysIcon />} label="Calendário" />
            </nav>
            <div className="border-t pt-2">
                <button onClick={handleLogout} className={`flex items-center h-12 px-4 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <LogoutIcon />
                    <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Sair</span>
                </button>
            </div>
        </div>
    );
};


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-white">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="w-64 h-full shadow-2xl bg-white">
                    <SidebarContent isCollapsed={false} />
                </div>
                <div className="fixed inset-0 bg-transparent z-30" onClick={() => setIsMobileSidebarOpen(false)}></div>
            </div>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:block flex-shrink-0 shadow-lg transition-all duration-300 ease-in-out bg-white ${isDesktopCollapsed ? 'w-20' : 'w-64'}`}>
                <div className={`fixed h-full transition-all duration-300 ease-in-out bg-white ${isDesktopCollapsed ? 'w-20' : 'w-64'}`}>
                    <SidebarContent 
                        isCollapsed={isDesktopCollapsed} 
                        onToggleCollapse={() => setIsDesktopCollapsed(p => !p)} 
                    />
                </div>
            </aside>
            
            <div className="flex-1 flex flex-col">
                <main className="flex-grow">
                    <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm p-4 shadow-sm z-20 flex items-center justify-between">
                        <button onClick={() => setIsMobileSidebarOpen(true)}>
                        <MenuIcon/>
                        </button>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Conta Fácil</h2>
                        <div className="w-6 h-6"></div>
                    </header>
                    <div className="w-full">
                        {children}
                    </div>
                </main>
                <FinancialInsightBanner />
            </div>

            <FloatingCalculatorButton />
        </div>
    );
};

export default MainLayout;