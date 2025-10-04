import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Conta Fácil
            </h1>
            <p className="mt-4 text-gray-600">A verificar a sua sessão...</p>
        </div>
    );
};

export default SplashScreen;