import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Transaction, TransactionType } from '../types';
import TransactionModal from '../components/TransactionModal';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import Minicourse from '../components/Minicourse';
import LevelProgressBar from '../components/LevelProgressBar';
import { PlusCircleIcon, DocumentTextIcon, ChartBarIcon } from '../components/icons';

const DashboardPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { transactions, loading } = useData();
    const navigate = useNavigate();
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [isMinicourseOpen, setIsMinicourseOpen] = useState(false);

    const { receitas, despesas, saldo } = useMemo(() => {
        const receitas = transactions
            .filter(t => t.type === TransactionType.Receita)
            .reduce((sum, t) => sum + t.amount, 0);
        const despesas = transactions
            .filter(t => t.type === TransactionType.Despesa)
            .reduce((sum, t) => sum + t.amount, 0);
        return { receitas, despesas, saldo: receitas - despesas };
    }, [transactions]);

    const handleUpgrade = async () => {
        if(user) {
          console.log("Initiating upgrade for user:", user.id);
          alert("A simular o checkout do Stripe... Após a confirmação, o seu plano será atualizado.");
          
          setTimeout(async () => {
            try {
              await updateUser({ plan: 'Pro' });
              alert("Parabéns! O seu plano foi atualizado para Pro.");
            } catch (error) {
              console.error("Failed to upgrade plan", error);
              alert("Ocorreu um erro ao atualizar o seu plano.");
            }
          }, 2000);
        }
    };
    
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Olá, {user?.name}!</h1>
                    <div className="flex-shrink-0">
                        {user?.plan === 'Gratuito' && (
                            <div className="text-sm text-center md:text-right bg-white p-3 rounded-lg shadow-md">
                                <p className="font-semibold text-gray-700">Plano Gratuito ({transactions.length}/30)</p>
                                <button onClick={handleUpgrade} className="mt-1 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full hover:opacity-90 transition-opacity">
                                    Atualizar para o Pro
                                </button>
                            </div>
                        )}
                        {user?.plan === 'Pro' && (
                            <div className="text-sm text-center md:text-right bg-white p-3 rounded-lg shadow-md">
                                <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Plano Pro</p>
                            </div>
                        )}
                    </div>
                </div>
                <LevelProgressBar transactionCount={transactions.length} />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title="Receitas" value={receitas} type="receita" />
                <SummaryCard title="Despesas" value={despesas} type="despesa" />
                <SummaryCard title="Saldo" value={saldo} type="saldo" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setIsTxModalOpen(true)} className="flex items-center justify-center gap-3 p-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    <PlusCircleIcon />
                    Adicionar Lançamento
                </button>
                <button onClick={() => navigate('/fixed-expenses')} className="flex items-center justify-center gap-3 p-6 text-lg font-semibold text-gray-700 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    <DocumentTextIcon />
                    Gastos Fixos
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setIsMinicourseOpen(true)} className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Comece por aqui!</h3>
                    <p className="text-gray-600">Aprenda a poupar e a investir o seu dinheiro com o nosso minicurso financeiro gratuito.</p>
                    <span className="inline-block mt-3 font-semibold text-blue-600">Iniciar curso &rarr;</span>
                </div>
                <div onClick={() => navigate('/reports')} className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center">
                    <ChartBarIcon />
                    <h3 className="font-bold text-xl text-gray-800 mt-2 mb-2">Ver Relatórios</h3>
                    <p className="text-gray-600">Analise os seus gastos e receitas com gráficos detalhados.</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Últimos Lançamentos</h2>
                    <button onClick={() => navigate('/transactions')} className="font-semibold text-blue-600 hover:underline">Ver todos</button>
                </div>
                {loading ? <p>A carregar...</p> : <TransactionList transactions={recentTransactions} limit={5} />}
            </div>

            {isTxModalOpen && <TransactionModal onClose={() => setIsTxModalOpen(false)} />}
            {isMinicourseOpen && <Minicourse onClose={() => setIsMinicourseOpen(false)} />}
        </div>
    );
};

export default DashboardPage;