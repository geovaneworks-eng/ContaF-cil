import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import FixedExpensesPage from './pages/FixedExpensesPage';
import ReportsPage from './pages/ReportsPage';
import WishlistPage from './pages/WishlistPage';
import MainLayout from './components/MainLayout';
import CalendarPage from './pages/CalendarPage';

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  return user ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-700">A carregar aplicação...</div>;
    }

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


const App: React.FC = () => {
  return (
    <div 
        className="min-h-screen bg-white"
    >
        <AuthProvider>
            <DataProvider>
                <AppRoutes />
            </DataProvider>
        </AuthProvider>
    </div>
  );
};

export default App;