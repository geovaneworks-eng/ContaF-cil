import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { FixedExpense, Months } from '@/types';
import { useAuth } from '@/context/AuthContext';
import ConfirmationModal from '@/components/ConfirmationModal';
import { formatCurrency } from '@/utils/formatters';
import { TrashIcon, PencilIcon, PlusIcon } from '@/components/icons';

const FixedExpensesPage: React.FC = () => {
    const { user } = useAuth();
    const { fixedExpenses, loading, addFixedExpense, updateFixedExpense, deleteFixedExpense } = useData();
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const currentMonth = Months[new Date().getMonth()];
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    useEffect(() => {
        if (editingExpense) {
            setDescription(editingExpense.description);
            setAmount(String(editingExpense.amount));
            setSelectedMonth(editingExpense.month);
        }
    }, [editingExpense]);

    const filteredExpenses = useMemo(() => {
        return fixedExpenses.filter(fe => fe.month === selectedMonth);
    }, [fixedExpenses, selectedMonth]);

    const totalForMonth = useMemo(() => {
        return filteredExpenses.reduce((sum, fe) => sum + fe.amount, 0);
    }, [filteredExpenses]);

    const handleClearForm = () => {
        setDescription('');
        setAmount('');
        setEditingExpense(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !description || !amount) return;

        const expenseData = {
            description,
            amount: parseFloat(amount),
            month: selectedMonth,
        };

        if (editingExpense) {
            await updateFixedExpense({ ...expenseData, id: editingExpense.id, userId: user.id });
        } else {
            await addFixedExpense(expenseData);
        }
        handleClearForm();
    };

    const handleDelete = async () => {
        if(deletingId) {
            await deleteFixedExpense(deletingId);
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Gastos Fixos</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingExpense ? 'Editar Gasto Fixo' : 'Adicionar Gasto Fixo'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="md:col-span-2 w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Valor"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                        >
                            {Months.map(month => <option key={month} value={month}>{month}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <button type="submit" className="flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300">
                             <PlusIcon /> {editingExpense ? 'Salvar Alterações' : 'Adicionar'}
                        </button>
                        {(editingExpense || description || amount) && (
                            <button type="button" onClick={handleClearForm} className="text-gray-600 hover:underline">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {loading ? <p>A carregar...</p> : (
                    <div>
                        <ul className="space-y-3">
                            {filteredExpenses.map(fe => (
                                <li key={fe.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{fe.description}</p>
                                    </div>
                                    <p className="font-bold text-red-500 text-lg w-32 text-right">{formatCurrency(fe.amount)}</p>
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => setEditingExpense(fe)} className="text-gray-500 hover:text-blue-600"><PencilIcon/></button>
                                        <button onClick={() => setDeletingId(fe.id)} className="text-gray-500 hover:text-red-600"><TrashIcon/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                         {filteredExpenses.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum gasto fixo para {selectedMonth}.</p>}
                    </div>
                )}
                <div className="mt-8 pt-4 border-t flex justify-end items-center">
                    <span className="text-lg font-semibold text-gray-600 mr-4">Total para {selectedMonth}:</span>
                    <span className="text-2xl font-bold text-red-600">{formatCurrency(totalForMonth)}</span>
                </div>
            </div>
            {deletingId && <ConfirmationModal
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este gasto fixo?"
                onConfirm={handleDelete}
                onCancel={() => setDeletingId(null)}
            />}
        </div>
    );
};

export default FixedExpensesPage;