
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Transaction, FixedExpense, WishlistItem } from '../types';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

interface DataContextType {
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  wishlistItems: WishlistItem[];
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addFixedExpense: (fe: Omit<FixedExpense, 'id' | 'userId'>) => Promise<void>;
  updateFixedExpense: (fe: FixedExpense) => Promise<void>;
  deleteFixedExpense: (id: string) => Promise<void>;
  addWishlistItem: (wi: Omit<WishlistItem, 'id' | 'userId' | 'purchased'>) => Promise<void>;
  updateWishlistItem: (wi: WishlistItem) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  refetchData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const [txs, fes, wis] = await Promise.all([
          api.apiGetTransactions(user.id),
          api.apiGetFixedExpenses(user.id),
          api.apiGetWishlistItems(user.id)
        ]);
        setTransactions(txs);
        setFixedExpenses(fes);
        setWishlistItems(wis);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    } else {
        setTransactions([]);
        setFixedExpenses([]);
        setWishlistItems([]);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetchData = fetchData;

  // Transactions
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    const newTx = await api.apiAddTransaction({ ...tx, userId: user.id });
    setTransactions(prev => [...prev, newTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  const updateTransaction = async (tx: Transaction) => {
    const updatedTx = await api.apiUpdateTransaction(tx);
    setTransactions(prev => prev.map(t => (t.id === updatedTx.id ? updatedTx : t)));
  };
  const deleteTransaction = async (id: string) => {
    await api.apiDeleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  // Fixed Expenses
  const addFixedExpense = async (fe: Omit<FixedExpense, 'id' | 'userId'>) => {
    if (!user) return;
    const newFe = await api.apiAddFixedExpense({ ...fe, userId: user.id });
    setFixedExpenses(prev => [...prev, newFe]);
  };
  const updateFixedExpense = async (fe: FixedExpense) => {
    const updatedFe = await api.apiUpdateFixedExpense(fe);
    setFixedExpenses(prev => prev.map(f => (f.id === updatedFe.id ? updatedFe : f)));
  };
  const deleteFixedExpense = async (id: string) => {
    await api.apiDeleteFixedExpense(id);
    setFixedExpenses(prev => prev.filter(fe => fe.id !== id));
  };

  // Wishlist
  const addWishlistItem = async (wi: Omit<WishlistItem, 'id' | 'userId' | 'purchased'>) => {
    if (!user) return;
    const newWi = await api.apiAddWishlistItem({ ...wi, userId: user.id, purchased: false });
    setWishlistItems(prev => [...prev, newWi]);
  };
  const updateWishlistItem = async (wi: WishlistItem) => {
    const updatedWi = await api.apiUpdateWishlistItem(wi);
    setWishlistItems(prev => prev.map(w => (w.id === updatedWi.id ? updatedWi : w)));
  };
  const deleteWishlistItem = async (id: string) => {
    await api.apiDeleteWishlistItem(id);
    setWishlistItems(prev => prev.filter(wi => wi.id !== id));
  };


  return (
    <DataContext.Provider value={{ 
        transactions, 
        fixedExpenses, 
        wishlistItems,
        loading, 
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addFixedExpense,
        updateFixedExpense,
        deleteFixedExpense,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        refetchData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};