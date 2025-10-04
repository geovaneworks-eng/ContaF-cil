import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import FixedExpensesPage from '@/pages/FixedExpensesPage';
import ReportsPage from '@/pages/ReportsPage';
import WishlistPage from '@/pages/WishlistPage';
import MainLayout from '@/components/MainLayout';
import CalendarPage from '@/pages/CalendarPage';
import SplashScreen from '@/components/SplashScreen';

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  return user ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
            
            <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/fixed-expenses" element={<FixedExpensesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
            </Route>
        </Routes>
    );
};

// Este componente decide se mostra a tela de carregamento ou a aplicação principal
const AppContent: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return <SplashScreen />;
    }

    return <AppRoutes />;
};


const App: React.FC = () => {
  return (
    <div 
        className="min-h-screen bg-white"
    >
        <AuthProvider>
            <DataProvider>
                <AppContent />
            </DataProvider>
        </AuthProvider>
    </div>
  );
};

export default App;