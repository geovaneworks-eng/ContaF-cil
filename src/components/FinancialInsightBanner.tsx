import React, { useState, useEffect } from 'react';

const FinancialInsightBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasBeenDismissed = localStorage.getItem('hideFinancialInsightBanner') === 'true';
        if (!hasBeenDismissed) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hideFinancialInsightBanner', 'true');
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="w-full flex justify-center p-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 w-11/12 max-w-2xl animate-fade-in-up">
                <p className="text-sm md:text-base font-medium text-center flex-grow">
                    <strong>Você sabia?</strong> Apenas 28% dos brasileiros controlam suas finanças. Você está no caminho certo!
                </p>
                <button 
                    onClick={handleClose} 
                    className="text-white hover:bg-white/20 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Fechar mensagem"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default FinancialInsightBanner;
