
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Gratuito' | 'Pro';
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

export const TransactionCategories = [
    'Moradia',
    'Transporte',
    'Alimentação',
    'Saúde',
    'Lazer',
    'Educação',
    'Salário',
    'Investimentos',
    'Outros',
];

export const Months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];