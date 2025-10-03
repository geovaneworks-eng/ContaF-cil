import React from 'react';
import { useData } from '@/context/DataContext';
import FullPageExpenseCalendar from '@/components/FullPageExpenseCalendar';

const CalendarPage: React.FC = () => {
    const { transactions, loading } = useData();

    return (
        <div className="p-4 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendário de Movimentações</h1>
                {loading ? (
                    <p className="text-center py-10 text-gray-500">A carregar calendário...</p>
                ) : (
                    <FullPageExpenseCalendar transactions={transactions} />
                )}
            </div>
        </div>
    );
};

export default CalendarPage;