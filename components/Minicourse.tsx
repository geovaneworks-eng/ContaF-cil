
import React, { useState } from 'react';

const courseContent = [
    { title: "Bem-vindo ao Minicurso!", content: "Vamos dar o primeiro passo para uma vida financeira mais saudável. O objetivo? Aprender a poupar uma parte do seu salário todos os meses." },
    { title: "Por que poupar?", content: "Poupar cria uma reserva de emergência, permite realizar sonhos (como uma viagem ou um carro) e é o primeiro passo para investir e fazer o seu dinheiro render." },
    { title: "A Meta: 5%, 10% ou 20%", content: "A sua primeira meta pode ser poupar 5% do seu salário. Se o seu salário é R$ 3.000, isso significa R$ 150 por mês. Parece pouco, mas é um começo poderoso!" },
    { title: "Como começar: O Orçamento", content: "Anote TODAS as suas despesas por um mês. Use a 'Conta Fácil' para isso! Você vai descobrir para onde o seu dinheiro realmente está a ir." },
    { title: "Identificando Cortes", content: "Depois de analisar o seu orçamento, veja onde pode cortar. Aquele café diário? A assinatura que não usa? Pequenos cortes somam muito no final do ano." },
    { title: "Aumentando a Meta: 10%", content: "Conseguiu poupar 5%? Ótimo! Agora, tente aumentar para 10%. Com um salário de R$ 3.000, isso são R$ 300 por mês. Em um ano, são R$ 3.600!" },
    { title: "O poder dos 20%", content: "Poupar 20% acelera drasticamente os seus objetivos. São R$ 600 por mês, ou R$ 7.200 por ano. Isso pode ser a entrada para um imóvel ou um grande investimento." },
    { title: "Automatize a sua Poupança", content: "A melhor forma de garantir que você vai poupar é automatizar. Configure uma transferência automática para uma conta poupança assim que receber o seu salário." },
    { title: "Pague-se Primeiro", content: "Não espere o fim do mês para ver o que sobrou. A sua poupança deve ser a primeira 'conta' a ser paga. Trate-a como uma despesa fixa obrigatória." },
    { title: "Continue a jornada", content: "Este é só o começo. Continue a aprender sobre finanças, investimentos e como fazer o seu dinheiro trabalhar para você. A consistência é a chave do sucesso!" },
];

const Minicourse: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [page, setPage] = useState(0);
    const [showCongrats, setShowCongrats] = useState(false);

    const handleNext = () => {
        if (page < courseContent.length - 1) {
            setPage(p => p + 1);
        } else {
            setShowCongrats(true);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage(p => p - 1);
        }
    };
    
    if (showCongrats) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Parabéns!</h2>
                    <p className="text-gray-700 mb-6">Você já deu o primeiro passo que muitos brasileiros não têm coragem de dar.</p>
                    <button onClick={onClose} className="py-2 px-6 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">Fechar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg flex flex-col" style={{minHeight: '350px'}}>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{courseContent[page].title}</h2>
                    <p className="text-gray-600 text-lg">{courseContent[page].content}</p>
                </div>
                <div className="mt-8">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((page + 1) / courseContent.length) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={handlePrev} disabled={page === 0} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Anterior</button>
                        <span className="text-sm font-semibold text-gray-500">Página {page + 1} de {courseContent.length}</span>
                        <button onClick={handleNext} className="py-2 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">{page === courseContent.length - 1 ? 'Concluir' : 'Próximo'}</button>
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
            </div>
        </div>
    );
};

export default Minicourse;
