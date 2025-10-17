
import React, { useCallback, useState, useEffect } from 'react';
import { MAX_FILES, ACCEPTED_FILE_TYPES } from '../constants';
import type { UploadedFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
}

const ImagePreview: React.FC<{ file: UploadedFile; onRemove: () => void }> = ({ file, onRemove }) => {
    // No need for useEffect cleanup if we pass the object URL directly from the parent
    // The parent component is responsible for managing the lifecycle of these URLs.
    return (
        <div className="relative group w-28 h-28 rounded-2xl overflow-hidden shadow-lg">
            <img src={file.previewUrl} alt={file.file.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                    onClick={onRemove}
                    className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500 transition-colors"
                    aria-label="Remove image"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        // Cleanup object URLs when component unmounts or files change
        return () => {
            uploadedFiles.forEach(uploadedFile => URL.revokeObjectURL(uploadedFile.previewUrl));
        };
    }, [uploadedFiles]);

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return;
        
        const filesArray = Array.from(newFiles).slice(0, MAX_FILES);
        
        // Clean up old URLs before setting new ones
        uploadedFiles.forEach(uploadedFile => URL.revokeObjectURL(uploadedFile.previewUrl));

        const newUploadedFiles = filesArray.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        
        setUploadedFiles(newUploadedFiles);
        onFilesChange(filesArray);

    }, [onFilesChange, uploadedFiles]);

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        const removedFile = newFiles.splice(index, 1);
        URL.revokeObjectURL(removedFile[0].previewUrl);
        setUploadedFiles(newFiles);
        onFilesChange(newFiles.map(f => f.file));
    };

    return (
        <div 
            className="w-full p-6 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg"
            onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
        >
            <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${
                    dragActive ? 'border-[#1E90FF] bg-blue-500/10' : 'border-white/30 hover:border-[#1E90FF] hover:bg-white/10'
                }`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-10 h-10 mb-3 text-white/70" />
                    <p className="mb-2 text-sm text-white/70">
                        <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-white/50">Up to {MAX_FILES} images</p>
                </div>
                <input id="file-upload" type="file" multiple accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={handleFileChange} />
            </label>

            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4">Uploaded Photos:</h3>
                    <div className="flex flex-wrap gap-4">
                        {uploadedFiles.map((file, index) => (
                            <ImagePreview key={index} file={file} onRemove={() => handleRemoveFile(index)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
