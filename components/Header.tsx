
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
    return (
        <header className="w-full text-center py-4">
            <div className="flex items-center justify-center gap-3">
                <SparklesIcon className="w-8 h-8 text-[#1E90FF]" />
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    AURA <span className="text-[#1E90FF]">X</span>
                </h1>
            </div>
            <p className="text-white/70 mt-2">Your AI Photo Editing Assistant</p>
        </header>
    );
};
