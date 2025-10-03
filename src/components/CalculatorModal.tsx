import React, { useState } from 'react';

interface CalculatorModalProps {
    onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({ onClose }) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplayValue(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };

    const inputDecimal = () => {
        if (!displayValue.includes('.')) {
            setDisplayValue(displayValue + '.');
        }
    };

    const clearInput = () => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const handleOperator = (nextOperator: string) => {
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            setOperator(nextOperator);
            return;
        }

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation();
            setDisplayValue(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation = (): number => {
        const inputValue = parseFloat(displayValue);
        if (firstOperand === null || operator === null) return inputValue;
        
        switch (operator) {
            case '+': return firstOperand + inputValue;
            case '-': return firstOperand - inputValue;
            case '*': return firstOperand * inputValue;
            case '/': return firstOperand / inputValue;
            default: return inputValue;
        }
    };

    const handleEquals = () => {
        if (operator && !waitingForSecondOperand) {
            const result = performCalculation();
            setDisplayValue(String(result));
            setFirstOperand(null);
            setOperator(null);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const renderButton = (label: string, onClick: () => void, className: string = "", extraClasses: string = "") => (
        <button 
            onClick={onClick} 
            className={`text-2xl font-semibold p-4 rounded-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${className} ${extraClasses}`}
        >
            {label}
        </button>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-800 rounded-3xl shadow-2xl p-4 w-full max-w-xs relative space-y-4">
                 <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>

                {/* Display */}
                <div className="bg-gray-900 text-white text-right text-5xl font-light p-4 rounded-xl break-all h-20 flex items-end justify-end">
                    <span>{displayValue}</span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-3">
                    {renderButton('C', clearInput, 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-500', 'col-span-2')}
                    {renderButton('÷', () => handleOperator('/'), 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500')}
                    {renderButton('×', () => handleOperator('*'), 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500')}

                    {renderButton('7', () => inputDigit('7'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('8', () => inputDigit('8'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('9', () => inputDigit('9'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('-', () => handleOperator('-'), 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500')}

                    {renderButton('4', () => inputDigit('4'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('5', () => inputDigit('5'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('6', () => inputDigit('6'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('+', () => handleOperator('+'), 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500')}

                    {renderButton('1', () => inputDigit('1'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('2', () => inputDigit('2'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('3', () => inputDigit('3'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                    {renderButton('=', handleEquals, 'bg-purple-600 text-white hover:bg-purple-500 focus:ring-purple-500', 'row-span-2')}

                    {renderButton('0', () => inputDigit('0'), 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600', 'col-span-2')}
                    {renderButton('.', inputDecimal, 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600')}
                </div>
            </div>
        </div>
    );
};

export default CalculatorModal;