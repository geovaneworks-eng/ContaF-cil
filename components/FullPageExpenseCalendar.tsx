import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';

const DayCell: React.FC<{ day: Date; isCurrentMonth: boolean; transactions: Transaction[] }> = ({ day, isCurrentMonth, transactions }) => {
    const isToday = new Date().toDateString() === day.toDateString();
    const hasTransactions = transactions.length > 0;

    const dayNumberClasses = () => {
        if (isToday) return 'bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center';
        if (isCurrentMonth) return 'text-gray-900';
        return 'text-gray-400';
    };

    const backgroundClass = isCurrentMonth 
        ? hasTransactions ? 'bg-red-100' : 'bg-white' 
        : 'bg-gray-50';

    return (
        <div className={`relative h-24 border-t border-l border-gray-200 p-2 flex flex-col group ${backgroundClass}`}>
            <span className={`self-start text-sm ${dayNumberClasses()}`}>
                {day.getDate()}
            </span>
            
            {hasTransactions && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-10 w-64 p-3 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
                     <h4 className="font-bold text-sm mb-2 border-b border-gray-600 pb-1 capitalize">Dia {day.toLocaleDateString('pt-BR', {day: '2-digit'})}</h4>
                     <ul className="space-y-1 text-xs max-h-48 overflow-y-auto">
                        {transactions.map(tx => (
                            <li key={tx.id} className="flex justify-between items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${tx.type === TransactionType.Receita ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                <span className="flex-1 truncate pr-2">{tx.description}</span>
                                <span className={`font-semibold whitespace-nowrap ${tx.type === TransactionType.Receita ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(tx.amount)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800"></div>
                </div>
            )}
        </div>
    );
};

const FullPageExpenseCalendar: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const transactionsByDate = useMemo(() => {
        const map = new Map<string, Transaction[]>();
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
            const dateKey = adjustedDate.toDateString();
            const existing = map.get(dateKey) || [];
            map.set(dateKey, [...existing, tx]);
        });
        return map;
    }, [transactions]);

    const monthDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push(new Date(year, month, 1 - i));
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        const totalCells = Math.ceil(days.length / 7) * 7;
        const remainingCells = totalCells > 35 ? 42 - days.length : 35 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push(new Date(year, month + 1, i));
        }
        
        return days;
    }, [currentDate]);
    
    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="bg-white">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 text-lg font-bold">&larr;</button>
                <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 text-lg font-bold">&rarr;</button>
            </div>
            <div className="grid grid-cols-7 border-r border-b border-gray-200">
                {weekDays.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2 border-t border-l border-gray-200 bg-gray-50">{day}</div>
                ))}
                {monthDays.map((day, index) => (
                    <DayCell 
                        key={index}
                        day={day}
                        isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                        transactions={transactionsByDate.get(day.toDateString()) || []}
                    />
                ))}
            </div>
        </div>
    );
};

export default FullPageExpenseCalendar;