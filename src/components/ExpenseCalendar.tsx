import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const DayCell: React.FC<{ day: Date; isCurrentMonth: boolean; expenses: Transaction[] }> = ({ day, isCurrentMonth, expenses }) => {
    const isToday = new Date().toDateString() === day.toDateString();
    const hasExpenses = expenses.length > 0;

    return (
        <div className={`relative h-24 border-t border-l border-gray-200 p-2 flex flex-col group ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}>
            <span className={`self-start text-sm ${isToday ? 'bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                {day.getDate()}
            </span>
            {hasExpenses && (
                <div className="mt-1 flex-grow flex items-end">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto" title={`${expenses.length} despesa(s)`}></div>
                </div>
            )}
            {hasExpenses && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-10 w-64 p-3 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
                     {/* FIX: Corrected typo from `toLocaleDate-string` to `toLocaleDateString`. */}
                     <h4 className="font-bold text-sm mb-2 border-b border-gray-600 pb-1">Despesas do dia {day.toLocaleDateString('pt-BR')}</h4>
                     <ul className="space-y-1 text-xs">
                        {expenses.map(exp => (
                            <li key={exp.id} className="flex justify-between">
                                <span className="truncate pr-2">{exp.description}</span>
                                <span className="font-semibold whitespace-nowrap">{formatCurrency(exp.amount)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800"></div>
                </div>
            )}
        </div>
    );
};

const ExpenseCalendar: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const expensesByDate = useMemo(() => {
        const map = new Map<string, Transaction[]>();
        transactions
            .filter(tx => tx.type === TransactionType.Despesa)
            .forEach(tx => {
                // Adjust for timezone before getting date string
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
        // Previous month's padding
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push(new Date(year, month, 1 - i));
        }
        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        // Next month's padding
        const remainingCells = 42 - days.length; // 6 rows * 7 days
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
        <div className="bg-white pt-4">
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
                        expenses={expensesByDate.get(day.toDateString()) || []}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseCalendar;