
import React from 'react';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-8">{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
