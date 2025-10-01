import React from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import FinancialInsightBanner from '@/components/FinancialInsightBanner';

const AuthPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Conta Fácil
                    </h1>
                    <p className="text-gray-600 mt-2">A sua vida financeira, simplificada.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        providers={[]}
                        theme="light"
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: 'Endereço de email',
                                    password_label: 'Sua senha',
                                    email_input_placeholder: 'seu.email@exemplo.com',
                                    password_input_placeholder: 'Sua senha',
                                    button_label: 'Entrar',
                                    social_provider_text: 'Entrar com {{provider}}',
                                    link_text: 'Já tem uma conta? Entre',
                                },
                                sign_up: {
                                    email_label: 'Endereço de email',
                                    password_label: 'Crie uma senha',
                                    email_input_placeholder: 'seu.email@exemplo.com',
                                    password_input_placeholder: 'Crie uma senha forte',
                                    button_label: 'Registar',
                                    social_provider_text: 'Registar com {{provider}}',
                                    link_text: 'Não tem uma conta? Registe-se',
                                },
                                forgotten_password: {
                                    email_label: 'Endereço de email',
                                    password_label: 'Sua senha',
                                    email_input_placeholder: 'seu.email@exemplo.com',
                                    button_label: 'Enviar instruções',
                                    link_text: 'Esqueceu a sua senha?',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            <div className="absolute bottom-0 w-full">
                <FinancialInsightBanner />
            </div>
        </div>
    );
};

export default AuthPage;