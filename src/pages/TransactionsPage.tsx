import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import TransactionList from '@/components/TransactionList';
import TransactionModal from '@/components/TransactionModal';
import { PlusCircleIcon } from '@/components/icons';
import { Transaction, TransactionCategories } from '@/types';

const TransactionsPage: React.FC = () => {
    const { transactions, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const filteredTransactions = useMemo(() => {
        if (selectedCategories.length === 0) {
            return transactions;
        }
        return transactions.filter(tx => selectedCategories.includes(tx.category));
    }, [transactions, selectedCategories]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
            ? prev.filter(c => c !== category)
            : [...prev, category]
        );
    };

    return (
        <div className="p-4 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Meus Lançamentos</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300">
                        <PlusCircleIcon />
                        Novo Lançamento
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Filtrar por Categoria:</h3>
                    <div className="flex flex-wrap gap-2">
                        {TransactionCategories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => handleCategoryToggle(cat)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                                    selectedCategories.includes(cat)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                     {selectedCategories.length > 0 && (
                        <button 
                            onClick={() => setSelectedCategories([])}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {loading ? <p>A carregar lançamentos...</p> : <TransactionList transactions={filteredTransactions} />}
            </div>
            {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TransactionsPage;