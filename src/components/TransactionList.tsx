import React, { useState } from 'react';
import { Transaction, TransactionType, AllTransactionCategories } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { TrashIcon, PencilIcon } from '@/components/icons';
import TransactionModal from '@/components/TransactionModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useData } from '@/context/DataContext';

interface TransactionListProps {
    transactions: Transaction[];
    limit?: number;
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteTransaction } = useData();

    const handleDelete = async () => {
        await deleteTransaction(transaction.id);
        setIsDeleting(false);
    };

    const isIncome = transaction.type === TransactionType.Receita;
    const category = AllTransactionCategories.find(cat => cat.name === transaction.category);
    const categoryEmoji = category ? category.emoji : '';

    return (
        <>
            <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <div className={`w-2 h-10 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{categoryEmoji} {transaction.category} - {formatDate(transaction.date)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-center">
                    <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100"><PencilIcon/></button>
                        <button onClick={() => setIsDeleting(true)} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100"><TrashIcon/></button>
                    </div>
                </div>
            </li>
            {isEditing && <TransactionModal transaction={transaction} onClose={() => setIsEditing(false)} />}
            {isDeleting && <ConfirmationModal 
                title="Confirmar Exclusão" 
                message="Tem certeza que deseja excluir este lançamento?" 
                onConfirm={handleDelete} 
                onCancel={() => setIsDeleting(false)} 
            />}
        </>
    );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, limit }) => {
    const data = limit ? transactions.slice(0, limit) : transactions;

    if (data.length === 0) {
        return <p className="text-center text-gray-500 py-8">Nenhum lançamento encontrado.</p>;
    }

    return (
        <ul className="divide-y">
            {data.map(tx => <TransactionItem key={tx.id} transaction={tx} />)}
        </ul>
    );
};

export default TransactionList;