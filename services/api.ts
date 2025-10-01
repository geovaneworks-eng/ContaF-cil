import { supabase } from '../integrations/supabase/client';
import { Transaction, FixedExpense, WishlistItem } from '../types';

// --- Transactions ---
export const apiGetTransactions = async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const apiAddTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase
        .from('transactions')
        .insert(tx)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiUpdateTransaction = async (tx: Transaction): Promise<Transaction> => {
    const { id, ...txData } = tx;
    const { data, error } = await supabase
        .from('transactions')
        .update(txData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiDeleteTransaction = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

// --- Fixed Expenses ---
export const apiGetFixedExpenses = async (userId: string): Promise<FixedExpense[]> => {
    const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data || [];
};

export const apiAddFixedExpense = async (fe: Omit<FixedExpense, 'id'>): Promise<FixedExpense> => {
    const { data, error } = await supabase
        .from('fixed_expenses')
        .insert(fe)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiUpdateFixedExpense = async (fe: FixedExpense): Promise<FixedExpense> => {
    const { id, ...feData } = fe;
    const { data, error } = await supabase
        .from('fixed_expenses')
        .update(feData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiDeleteFixedExpense = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

// --- Wishlist Items ---
export const apiGetWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data || [];
};

export const apiAddWishlistItem = async (wi: Omit<WishlistItem, 'id'>): Promise<WishlistItem> => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .insert(wi)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiUpdateWishlistItem = async (wi: WishlistItem): Promise<WishlistItem> => {
    const { id, ...wiData } = wi;
    const { data, error } = await supabase
        .from('wishlist_items')
        .update(wiData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const apiDeleteWishlistItem = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);
    if (error) throw error;
};