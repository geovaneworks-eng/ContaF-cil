import React from 'react';

const QuoteIcon: React.FC = () => (
    <svg className="w-10 h-10 text-purple-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
    </svg>
);


const TestimonialCard: React.FC = () => {
    return (
        <figure className="max-w-md w-full mx-auto text-center bg-white p-8 rounded-2xl shadow-xl">
            <QuoteIcon />
            <blockquote>
                <p className="text-lg font-medium text-gray-700">"Depois que passei a utilizar esse aplicativo minha vida financeira mudou para melhor já recomendei para todos da minha família aplicativo bom pratico e intuitivo."</p>
            </blockquote>
            <figcaption className="flex items-center justify-center mt-6 space-x-3">
                <img 
                    className="w-10 h-10 rounded-full object-cover" 
                    src="https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Foto de Juliana S." 
                />
                <div className="flex items-center divide-x-2 divide-gray-500">
                    <cite className="pr-3 font-medium text-gray-900">Juliana S.</cite>
                    <cite className="pl-3 text-sm text-gray-500">Utilizadora Verificada</cite>
                </div>
            </figcaption>
        </figure>
    );
};

export default TestimonialCard;