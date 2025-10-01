import React, { useState } from 'react';
import { CalculatorIcon } from './icons';
import CalculatorModal from './CalculatorModal';

const FloatingCalculatorButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 z-30 w-16 h-16 rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
                aria-label="Abrir calculadora"
            >
                <CalculatorIcon />
            </button>
            {isModalOpen && <CalculatorModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default FloatingCalculatorButton;