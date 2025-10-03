import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardProps {
    title: string;
    value: number;
    type: 'receita' | 'despesa' | 'saldo';
}

const colorClasses = {
    receita: 'text-green-600',
    despesa: 'text-red-600',
    saldo: 'text-blue-600',
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-gray-500 font-medium">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${colorClasses[type]}`}>
                {formatCurrency(value)}
            </p>
        </div>
    );
};

export default SummaryCard;