export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Gratuito' | 'Pro';
  avatarUrl?: string | null;
}

export enum TransactionType {
  Receita = 'Receita',
  Despesa = 'Despesa',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface FixedExpense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  month: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  description: string;
  amount: number;
  purchased: boolean;
}

export interface Category {
  name: string;
  emoji: string;
}

export const ExpenseCategories: Category[] = [
    { name: 'Alimentação', emoji: '🍴' },
    { name: 'Assinatura', emoji: '💵' },
    { name: 'Cabeleireiro', emoji: '💇' },
    { name: 'Cachorro', emoji: '🐾' },
    { name: 'Casa', emoji: '🏠' },
    { name: 'Compras', emoji: '🛒' },
    { name: 'Educação', emoji: '📖' },
    { name: 'Lazer', emoji: '💃' },
    { name: 'Operação bancária', emoji: '🏦' },
    { name: 'Pix', emoji: '💸' },
    { name: 'Saúde', emoji: '🏥' },
    { name: 'Serviços', emoji: '📄' },
    { name: 'Supermercado', emoji: '🛒' },
    { name: 'Transporte', emoji: '🚗' },
    { name: 'Viagem', emoji: '✈️' },
    { name: 'Outros', emoji: '...' },
];

export const IncomeCategories: Category[] = [
    { name: 'Salário', emoji: '💰' },
    { name: 'Investimentos', emoji: '📈' },
    { name: 'Presente', emoji: '🎁' },
    { name: 'Renda Extra', emoji: '🤑' },
    { name: 'Outros', emoji: '...' },
];

const allCategories = [...IncomeCategories, ...ExpenseCategories];
export const AllTransactionCategories: Category[] = allCategories.filter((category, index, self) =>
  index === self.findIndex((c) => c.name === category.name)
);

export const Months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];