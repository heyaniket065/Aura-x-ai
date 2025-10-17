
import React from 'react';

interface GeneratedImageViewProps {
    imageUrl: string;
    onClose: () => void;
}

export const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({ imageUrl, onClose }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `aura-x-edit-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative max-w-3xl max-h-[90vh] bg-white/10 p-4 border border-white/20 rounded-2xl shadow-2xl shadow-blue-500/20"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image card
            >
                <img src={imageUrl} alt="Generated edit" className="rounded-xl object-contain max-w-full max-h-[calc(90vh-80px)]" />

                <button 
                    onClick={onClose} 
                    className="absolute -top-4 -right-4 w-10 h-10 bg-black border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Close"
                >
                    &times;
                </button>
                
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleDownload}
                        className="bg-[#1E90FF] text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};
