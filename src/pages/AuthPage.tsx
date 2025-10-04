import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import FinancialInsightBanner from '@/components/FinancialInsightBanner';

interface AuthFormProps {
    isLogin: boolean;
    onSubmit: (e: React.FormEvent) => void;
    fullName: string;
    setFullName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
    isLogin,
    onSubmit,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
}) => (
    <form onSubmit={onSubmit} className="space-y-6">
        {!isLogin && (
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Como gostaria de ser chamado?
                </label>
                <div className="mt-1">
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
        )}
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
            </label>
            <div className="mt-1">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>

        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
            </label>
            <div className="mt-1">
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>

        <div>
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? (isLogin ? 'A entrar...' : 'A registar...') : (isLogin ? 'Entrar' : 'Registar')}
            </button>
        </div>
    </form>
);

const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            if (error.message === 'Invalid login credentials') {
                setError('Email ou senha inválidos.');
            } else if (error.message === 'Email not confirmed') {
                setError('Por favor, confirme o seu email para fazer o login. Verifique a sua caixa de entrada.');
            } else {
                setError('Ocorreu um erro ao tentar fazer login.');
            }
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        setLoading(false);

        if (error) {
            if (error.message === 'User already registered') {
                setError('Este email já está registado. Tente fazer login.');
            } else {
                setError(error.message);
            }
            return;
        }

        if (data.session) {
            return;
        }

        if (data.user) {
            alert('Registo efetuado! Por favor, verifique o seu email para confirmar a sua conta.');
            setIsLoginView(true);
        }
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setError(null);
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        clearForm();
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="absolute top-0 left-0 p-4 md:p-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Conta Fácil
                </h1>
            </div>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-left mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            {isLoginView ? 'Bem-Vindo!' : 'Crie sua conta'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isLoginView ? 'Faça login para gerir as suas finanças.' : 'Comece a organizar a sua vida financeira hoje.'}
                        </p>
                    </div>
                    
                    <AuthForm 
                        isLogin={isLoginView}
                        onSubmit={isLoginView ? handleLogin : handleSignUp}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                    />

                    {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                            <button onClick={toggleView} className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                                {isLoginView ? 'Registe-se' : 'Faça login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full">
                <FinancialInsightBanner />
            </div>
        </div>
    );
};

export default AuthPage;