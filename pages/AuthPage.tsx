import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FinancialInsightBanner from '../components/FinancialInsightBanner';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="flex-grow flex items-center justify-center w-full">
                <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-2xl overflow-hidden md:grid md:grid-cols-2">
                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {isLogin ? 'Faça login para gerir as suas finanças.' : 'Comece a organizar a sua vida financeira hoje.'}
                        </p>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                                        Como gostaria de ser chamado?
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Registar')}
                            </button>
                        </form>
                        <p className="text-center text-gray-600 mt-8">
                            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline font-semibold">
                                {isLogin ? 'Registe-se' : 'Faça login'}
                            </button>
                        </p>
                    </div>
                    <div className="hidden md:block relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1642052528449-b8923485b00c?q=80&w=1374&auto=format&fit=crop')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                        <div className="relative h-full flex flex-col justify-end p-12 text-white">
                            <blockquote className="text-2xl font-semibold italic">
                                "Este aplicativo mudou a minha vida! Finalmente sinto que tenho controle sobre cada centavo. É simples, intuitivo e prático."
                            </blockquote>
                            <div className="mt-6 flex items-center">
                                <img className="w-14 h-14 rounded-full object-cover" src="https://i.pravatar.cc/150?img=32" alt="Foto de Maria S." />
                                <div className="ml-4">
                                    <p className="font-bold">Ana Pereira</p>
                                    <p className="text-sm text-gray-300">Cliente Pro</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FinancialInsightBanner />
        </div>
    );
};

export default AuthPage;