
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionCategories } from '../types';
import { useData } from '../context/DataContext';

interface TransactionModalProps {
    onClose: () => void;
    transaction?: Transaction;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ onClose, transaction }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.Despesa);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState(TransactionCategories[0]);
    const { addTransaction, updateTransaction } = useData();
    const isEditing = !!transaction;

    useEffect(() => {
        if (isEditing) {
            setType(transaction.type);
            setDescription(transaction.description);
            setAmount(String(transaction.amount));
            setDate(transaction.date);
            setCategory(transaction.category);
        }
    }, [isEditing, transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = {
            type,
            description,
            amount: parseFloat(amount),
            date,
            category,
        };
        
        try {
            if (isEditing) {
                await updateTransaction({ ...transactionData, id: transaction.id, userId: transaction.userId });
            } else {
                await addTransaction(transactionData);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save transaction", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Lançamento' : 'Adicionar Lançamento'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setType(TransactionType.Receita)} className={`flex-1 py-2 rounded-lg ${type === TransactionType.Receita ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Receita</button>
                            <button type="button" onClick={() => setType(TransactionType.Despesa)} className={`flex-1 py-2 rounded-lg ${type === TransactionType.Despesa ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Despesa</button>
                        </div>
                    </div>
                     <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Descrição</label>
                        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                     <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="amount">Valor</label>
                        <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                     <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="date">Data</label>
                        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">Categoria</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-white" required>
                            {TransactionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="py-2 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">{isEditing ? 'Salvar Alterações' : 'Salvar Lançamento'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
