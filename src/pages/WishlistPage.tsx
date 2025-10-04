import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { WishlistItem, ExpenseCategories } from '@/types';
import { useAuth } from '@/context/AuthContext';
import ConfirmationModal from '@/components/ConfirmationModal';
import { formatCurrency } from '@/utils/formatters';
import { TrashIcon, PencilIcon, PlusIcon } from '@/components/icons';

const WishlistPage: React.FC = () => {
    const { user } = useAuth();
    const { wishlistItems, loading, addWishlistItem, updateWishlistItem, deleteWishlistItem } = useData();
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(ExpenseCategories.find(c => c.name === 'Compras')?.name || ExpenseCategories[0].name);
    const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (editingItem) {
            setDescription(editingItem.description);
            setAmount(String(editingItem.amount));
            setCategory(editingItem.category);
        }
    }, [editingItem]);

    const totalWishlistValue = useMemo(() => {
        return wishlistItems.reduce((sum, item) => sum + item.amount, 0);
    }, [wishlistItems]);

    const handleClearForm = () => {
        setDescription('');
        setAmount('');
        setCategory(ExpenseCategories.find(c => c.name === 'Compras')?.name || ExpenseCategories[0].name);
        setEditingItem(null);
    };
    
    const handleTogglePurchased = (item: WishlistItem) => {
        updateWishlistItem({ ...item, purchased: !item.purchased });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !description || !amount) return;

        const itemData = {
            description,
            amount: parseFloat(amount),
            category,
        };

        if (editingItem) {
            await updateWishlistItem({ ...itemData, id: editingItem.id, userId: user.id, purchased: editingItem.purchased });
        } else {
            await addWishlistItem(itemData);
        }
        handleClearForm();
    };

    const handleDelete = async () => {
        if(deletingId) {
            await deleteWishlistItem(deletingId);
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Desejos</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingItem ? 'Editar Item' : 'Adicionar Item de Desejo'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Descrição do item"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="md:col-span-2 w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Valor estimado"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                        >
                            {ExpenseCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <button type="submit" className="flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300">
                             <PlusIcon /> {editingItem ? 'Salvar Alterações' : 'Adicionar'}
                        </button>
                        {(editingItem || description || amount) && (
                            <button type="button" onClick={handleClearForm} className="text-gray-600 hover:underline">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {loading ? <p>A carregar...</p> : (
                    <div>
                        <ul className="space-y-3">
                            {wishlistItems.map(item => {
                                const categoryEmoji = ExpenseCategories.find(c => c.name === item.category)?.emoji || '';
                                return (
                                <li key={item.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center flex-1">
                                         <input 
                                            type="checkbox"
                                            checked={item.purchased}
                                            onChange={() => handleTogglePurchased(item)}
                                            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div className="ml-4">
                                            <p className={`font-semibold ${item.purchased ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item.description}</p>
                                            <p className={`text-sm ${item.purchased ? 'text-gray-400 line-through' : 'text-gray-500'}`}>{categoryEmoji} {item.category}</p>
                                        </div>
                                    </div>
                                    <p className={`font-bold text-lg w-32 text-right ${item.purchased ? 'text-gray-400 line-through' : 'text-blue-600'}`}>{formatCurrency(item.amount)}</p>
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => setEditingItem(item)} className="text-gray-500 hover:text-blue-600" disabled={item.purchased}><PencilIcon/></button>
                                        <button onClick={() => setDeletingId(item.id)} className="text-gray-500 hover:text-red-600"><TrashIcon/></button>
                                    </div>
                                </li>
                            )})}
                        </ul>
                         {wishlistItems.length === 0 && <p className="text-center text-gray-500 py-8">A sua lista de desejos está vazia.</p>}
                    </div>
                )}
                <div className="mt-8 pt-4 border-t flex justify-end items-center">
                    <span className="text-lg font-semibold text-gray-600 mr-4">Valor Total dos Desejos:</span>
                    <span className="text-2xl font-bold text-blue-700">{formatCurrency(totalWishlistValue)}</span>
                </div>
            </div>
            {deletingId && <ConfirmationModal
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este item da sua lista de desejos?"
                onConfirm={handleDelete}
                onCancel={() => setDeletingId(null)}
            />}
        </div>
    );
};

export default WishlistPage;