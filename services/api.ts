import { supabase } from '@/src/integrations/supabase/client';
import { Transaction, FixedExpense, WishlistItem } from '@/types';

// Helper para converter de camelCase (app) para snake_case (db)
const toSupabase = (item: { userId: string; [key: string]: any }) => {
    const { userId, ...rest } = item;
    return { ...rest, user_id: userId };
};

// Helper para converter de snake_case (db) para camelCase (app)
const fromSupabase = (item: { user_id: string; [key: string]: any }) => {
    const { user_id, ...rest } = item;
    return { ...rest, userId: user_id };
};

// --- Transactions ---
export const apiGetTransactions = async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromSupabase);
};

export const apiAddTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase
        .from('transactions')
        .insert(toSupabase(tx))
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
};

export const apiUpdateTransaction = async (tx: Transaction): Promise<Transaction> => {
    const { id, ...txData } = tx;
    const { data, error } = await supabase
        .from('transactions')
        .update(toSupabase(txData))
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
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
    return (data || []).map(fromSupabase);
};

export const apiAddFixedExpense = async (fe: Omit<FixedExpense, 'id'>): Promise<FixedExpense> => {
    const { data, error } = await supabase
        .from('fixed_expenses')
        .insert(toSupabase(fe))
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
};

export const apiUpdateFixedExpense = async (fe: FixedExpense): Promise<FixedExpense> => {
    const { id, ...feData } = fe;
    const { data, error } = await supabase
        .from('fixed_expenses')
        .update(toSupabase(feData))
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
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
    return (data || []).map(fromSupabase);
};

export const apiAddWishlistItem = async (wi: Omit<WishlistItem, 'id'>): Promise<WishlistItem> => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .insert(toSupabase(wi))
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
};

export const apiUpdateWishlistItem = async (wi: WishlistItem): Promise<WishlistItem> => {
    const { id, ...wiData } = wi;
    const { data, error } = await supabase
        .from('wishlist_items')
        .update(toSupabase(wiData))
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return fromSupabase(data);
};

export const apiDeleteWishlistItem = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);
    if (error) throw error;
};