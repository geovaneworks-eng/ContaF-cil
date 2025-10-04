import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Componente para proteger rotas que exigem autenticação
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Componente para a rota de autenticação, que redireciona se o utilizador já estiver logado
const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <SplashScreen />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Estrutura principal das rotas da aplicação
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
            
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
            <Route path="/fixed-expenses" element={<PrivateRoute><FixedExpensesPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
        <AuthProvider>
            <DataProvider>
                <AppRoutes />
            </DataProvider>
        </AuthProvider>
    </div>
  );
};

export default App;