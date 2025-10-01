import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { ChevronDownIcon } from '../components/icons';
import ExpenseCalendar from '../components/ExpenseCalendar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsPage: React.FC = () => {
    const { transactions, loading } = useData();
    const [timeFilter, setTimeFilter] = useState<'month' | 'week' | 'year'>('month');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const filteredData = useMemo(() => {
        const now = new Date();
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            if (timeFilter === 'month') {
                return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
            }
            if (timeFilter === 'year') {
                return txDate.getFullYear() === now.getFullYear();
            }
            if (timeFilter === 'week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return txDate >= oneWeekAgo;
            }
            return true;
        });
    }, [transactions, timeFilter]);

    const pieChartData = useMemo(() => {
        const categoryTotals: { [key: string]: number } = {};
        filteredData
            .filter(tx => tx.type === TransactionType.Despesa)
            .forEach(tx => {
                categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
            });
        
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [filteredData]);
    
    const barChartData = useMemo(() => {
        const income = filteredData.filter(tx => tx.type === TransactionType.Receita).reduce((sum, tx) => sum + tx.amount, 0);
        const expense = filteredData.filter(tx => tx.type === TransactionType.Despesa).reduce((sum, tx) => sum + tx.amount, 0);
        return [{ name: `Balanço - ${timeFilter}`, Receitas: income, Despesas: expense }];
    }, [filteredData, timeFilter]);

    if (loading) return <p className="p-8 text-center">A carregar relatórios...</p>;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Relatórios</h1>
                <div className="flex gap-2 mb-8">
                    <button onClick={() => setTimeFilter('week')} className={`px-4 py-2 rounded-lg font-semibold ${timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Semana</button>
                    <button onClick={() => setTimeFilter('month')} className={`px-4 py-2 rounded-lg font-semibold ${timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Mês</button>
                    <button onClick={() => setTimeFilter('year')} className={`px-4 py-2 rounded-lg font-semibold ${timeFilter === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Ano</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-96">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Despesas por Categoria</h2>
                        {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        ) : <p className="text-center text-gray-500 pt-16">Sem dados de despesa para este período.</p>}
                    </div>
                     <div className="h-96">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Receitas vs. Despesas</h2>
                        {barChartData[0].Receitas > 0 || barChartData[0].Despesas > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="Receitas" fill="#22c55e" />
                                <Bar dataKey="Despesas" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                        ) : <p className="text-center text-gray-500 pt-16">Sem dados para este período.</p>}
                    </div>
                </div>
            </div>

            {/* New Calendar Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition-colors"
                    aria-expanded={isCalendarOpen}
                >
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span role="img" aria-label="Calendário" className="mr-3 text-2xl">📅</span>
                        Calendário de Gastos
                    </h2>
                    <div className={`transform transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                    </div>
                </button>
                {isCalendarOpen && (
                    <div className="px-6 pb-6 border-t border-gray-200">
                        <ExpenseCalendar transactions={transactions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;