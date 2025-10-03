import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Pode-se renderizar um spinner ou uma tela de carregamento aqui
    return <div className="flex items-center justify-center min-h-screen text-gray-700">A carregar...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-700">A carregar aplicação...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><MainLayout><TransactionsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/fixed-expenses" element={<ProtectedRoute><MainLayout><FixedExpensesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><MainLayout><ReportsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><MainLayout><WishlistPage /></MainLayout></ProtectedRoute>} />
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