
import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    suggestedPrompt: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, suggestedPrompt }) => {
    return (
        <div className="w-full p-6 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg flex flex-col gap-4">
            <div>
                <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-white/80">
                    Describe your desired edit
                </label>
                <textarea
                    id="prompt"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-white bg-black/30 rounded-lg border border-white/30 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-colors"
                    placeholder="e.g., Make the background a cinematic beach at sunset..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
            </div>
            {suggestedPrompt && (
                <div>
                    <h4 className="text-sm font-medium text-white/80 mb-2">Suggestion:</h4>
                    <button
                        onClick={() => setPrompt(suggestedPrompt)}
                        className="w-full text-left p-3 bg-white/10 rounded-lg text-sm text-white/80 hover:bg-white/20 transition-colors"
                    >
                        <span className="font-semibold text-[#1E90FF]">Try this: </span>{suggestedPrompt}
                    </button>
                </div>
            )}
        </div>
    );
};
