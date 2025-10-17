
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { PromptInput } from './components/PromptInput';
import { GeneratedImageView } from './components/GeneratedImageView';
import { Loader } from './components/Loader';
import { generateEdit } from './services/geminiService';
import { getSuggestedPrompt } from './constants';
import type { UploadedFile } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const suggestedPrompt = useMemo(() => getSuggestedPrompt(uploadedFiles.length), [uploadedFiles.length]);

    const handleFilesChange = useCallback((files: File[]) => {
        const newUploadedFiles = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setUploadedFiles(newUploadedFiles);
        // Auto-select suggested prompt when files are uploaded
        if (files.length > 0) {
            setPrompt(getSuggestedPrompt(files.length));
        } else {
            setPrompt('');
        }
    }, []);

    const handleGenerate = async () => {
        if (uploadedFiles.length === 0 || !prompt) {
            setError('Please upload at least one photo and provide a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateEdit(uploadedFiles.map(f => f.file), prompt);
            setGeneratedImage(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center p-4 sm:p-6 lg:p-8">
                <div className="absolute inset-0 w-full h-full bg-black bg-[linear-gradient(to_right,#1E90FF33_1px,transparent_1px),linear-gradient(to_bottom,#1E90FF33_1px,transparent_1px)] bg-[size:70px_70px]"></div>
                <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_200px,#1e8fff22,transparent)]"></div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
                    <Header />

                    <main className="w-full flex flex-col gap-8">
                        <FileUpload onFilesChange={handleFilesChange} />

                        {uploadedFiles.length > 0 && (
                            <PromptInput
                                prompt={prompt}
                                setPrompt={setPrompt}
                                suggestedPrompt={suggestedPrompt}
                            />
                        )}

                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-2xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || uploadedFiles.length === 0 || !prompt}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1E90FF] text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-blue-500 enabled:shadow-[0_0_15px_rgba(30,144,255,0.8)] enabled:hover:shadow-[0_0_25px_rgba(30,144,255,1)]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon />
                                        <span>Generate</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </main>
                </div>
                 {generatedImage && (
                    <GeneratedImageView
                        imageUrl={generatedImage}
                        onClose={() => setGeneratedImage(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
