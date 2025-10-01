
import { User, Transaction, FixedExpense, TransactionType, WishlistItem } from '../types';

// Mock Database
let users: User[] = [
    { id: '1', name: 'Usuário Teste', email: 'teste@contafacil.com', plan: 'Gratuito' }
];
let transactions: Transaction[] = [
    { id: 't1', userId: '1', type: TransactionType.Receita, description: 'Salário', amount: 5000, date: new Date(new Date().setDate(1)).toISOString().split('T')[0], category: 'Salário' },
    { id: 't2', userId: '1', type: TransactionType.Despesa, description: 'Aluguel', amount: 1500, date: new Date(new Date().setDate(5)).toISOString().split('T')[0], category: 'Moradia' },
    { id: 't3', userId: '1', type: TransactionType.Despesa, description: 'Supermercado', amount: 800, date: new Date(new Date().setDate(10)).toISOString().split('T')[0], category: 'Alimentação' },
];
let fixedExpenses: FixedExpense[] = [
    { id: 'f1', userId: '1', description: 'Plano de Saúde', amount: 450, month: 'Julho' },
    { id: 'f2', userId: '1', description: 'Internet', amount: 120, month: 'Julho' },
];
let wishlistItems: WishlistItem[] = [
    { id: 'w1', userId: '1', description: 'Novo Smartphone', amount: 4500, purchased: false },
    { id: 'w2', userId: '1', description: 'Curso de Inglês', amount: 1200, purchased: false },
    { id: 'w3', userId: '1', description: 'Tênis de Corrida', amount: 550, purchased: true },
];


const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Auth ---
export const apiLogin = async (email: string, password_not_used: string): Promise<User> => {
    await simulateDelay(500);
    const user = users.find(u => u.email === email);
    if (user) {
        return user;
    }
    throw new Error('E-mail ou palavra-passe inválidos');
};

export const apiRegister = async (name: string, email: string, password_not_used: string): Promise<User> => {
    await simulateDelay(500);
    if (users.find(u => u.email === email)) {
        throw new Error('E-mail já registado');
    }
    const newUser: User = { id: String(users.length + 1), name, email, plan: 'Gratuito' };
    users.push(newUser);
    return newUser;
};

// --- Transactions ---
export const apiGetTransactions = async (userId: string): Promise<Transaction[]> => {
    await simulateDelay(500);
    return transactions.filter(t => t.userId === userId);
};

export const apiAddTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await simulateDelay(300);
    const newTx = { ...tx, id: `t${Date.now()}` };
    transactions.push(newTx);
    return newTx;
};

export const apiUpdateTransaction = async (tx: Transaction): Promise<Transaction> => {
    await simulateDelay(300);
    const index = transactions.findIndex(t => t.id === tx.id);
    if (index !== -1) {
        transactions[index] = tx;
        return tx;
    }
    throw new Error('Lançamento não encontrado');
};

export const apiDeleteTransaction = async (id: string): Promise<void> => {
    await simulateDelay(300);
    transactions = transactions.filter(t => t.id !== id);
};

// --- Fixed Expenses ---
export const apiGetFixedExpenses = async (userId: string): Promise<FixedExpense[]> => {
    await simulateDelay(500);
    return fixedExpenses.filter(fe => fe.userId === userId);
};

export const apiAddFixedExpense = async (fe: Omit<FixedExpense, 'id'>): Promise<FixedExpense> => {
    await simulateDelay(300);
    const newFe = { ...fe, id: `f${Date.now()}` };
    fixedExpenses.push(newFe);
    return newFe;
};

export const apiUpdateFixedExpense = async (fe: FixedExpense): Promise<FixedExpense> => {
    await simulateDelay(300);
    const index = fixedExpenses.findIndex(f => f.id === fe.id);
    if (index !== -1) {
        fixedExpenses[index] = fe;
        return fe;
    }
    throw new Error('Gasto fixo não encontrado');
};

export const apiDeleteFixedExpense = async (id: string): Promise<void> => {
    await simulateDelay(300);
    fixedExpenses = fixedExpenses.filter(fe => fe.id !== id);
};

// --- Wishlist Items ---
export const apiGetWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
    await simulateDelay(500);
    return wishlistItems.filter(wi => wi.userId === userId);
};

export const apiAddWishlistItem = async (wi: Omit<WishlistItem, 'id'>): Promise<WishlistItem> => {
    await simulateDelay(300);
    const newWi = { ...wi, id: `w${Date.now()}` };
    wishlistItems.push(newWi);
    return newWi;
};

export const apiUpdateWishlistItem = async (wi: WishlistItem): Promise<WishlistItem> => {
    await simulateDelay(300);
    const index = wishlistItems.findIndex(w => w.id === wi.id);
    if (index !== -1) {
        wishlistItems[index] = wi;
        return wi;
    }
    throw new Error('Item da lista de desejos não encontrado');
};

export const apiDeleteWishlistItem = async (id: string): Promise<void> => {
    await simulateDelay(300);
    wishlistItems = wishlistItems.filter(wi => wi.id !== id);
};


// --- Subscription ---
export const apiUpgradeToPro = async (userId: string): Promise<User> => {
    await simulateDelay(1500);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.plan = 'Pro';
        return { ...user };
    }
    throw new Error('Usuário não encontrado');
};