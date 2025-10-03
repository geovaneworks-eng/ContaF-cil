import React from 'react';

interface LevelProgressBarProps {
    transactionCount: number;
}

const levels = [
    { name: 'Bronze', min: 0, max: 10, gradient: 'from-amber-600 to-yellow-700', textColor: 'text-amber-700' },
    { name: 'Prata', min: 11, max: 20, gradient: 'from-slate-400 to-gray-300', textColor: 'text-slate-500' },
    { name: 'Ouro', min: 21, max: 30, gradient: 'from-yellow-400 to-amber-500', textColor: 'text-yellow-500' },
    { name: 'Diamante', min: 31, max: Infinity, gradient: 'from-purple-500 to-indigo-600', textColor: 'text-purple-600' },
];

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ transactionCount }) => {
    const currentLevel = levels.find(l => transactionCount >= l.min && transactionCount <= l.max) || levels[levels.length - 1];
    
    let progress = 0;
    let transactionsInLevel = 0;
    let levelMax = 0;

    if (currentLevel.max !== Infinity) {
        const levelStart = currentLevel.min === 0 ? 0 : currentLevel.min - 1;
        transactionsInLevel = transactionCount - levelStart;
        levelMax = currentLevel.max - levelStart;
        progress = (transactionsInLevel / levelMax) * 100;
    } else {
        progress = 100;
        transactionsInLevel = transactionCount;
        levelMax = transactionCount;
    }
    
    return (
        <div className="mt-4 max-w-md">
            <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold ${currentLevel.textColor}`}>
                    Nível {currentLevel.name}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                    {currentLevel.max !== Infinity ? `${transactionsInLevel}/${levelMax} transações` : `${transactionCount} transações`}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${currentLevel.gradient}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default LevelProgressBar;