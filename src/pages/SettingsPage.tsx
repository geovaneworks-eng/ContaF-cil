import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Avatar from '@/components/Avatar';

const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await updateUser({ name });
            setMessage({ type: 'success', text: 'Nome atualizado com sucesso!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: `Erro ao atualizar o nome: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }
        if (password.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            // 1. Atualiza a senha do utilizador
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;

            // 2. Reautentica com a nova senha para manter a sessão ativa
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: password,
            });
            if (signInError) throw signInError;

            setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: `Erro ao atualizar a senha: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Profile Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Informações do Perfil</h2>
                <form onSubmit={handleNameUpdate} className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar size={100} />
                        <div className="flex-grow">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || name === user?.name}
                            className="py-2 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'A guardar...' : 'Guardar Nome'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Segurança</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nova Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmar Nova Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="py-2 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'A guardar...' : 'Mudar Senha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;