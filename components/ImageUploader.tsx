
import React from 'react';

interface ImageUploaderProps {
    id: string;
    onImageSelect: (base64: string, mimeType: string) => void;
    currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, onImageSelect, currentImage }) => {
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                onImageSelect(base64String, file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lisää valokuva
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {currentImage ? (
                         <img src={currentImage} alt="Esikatselu" className="mx-auto h-24 w-auto object-contain rounded-md" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                        <label htmlFor={id} className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Lataa tiedosto</span>
                            <input id={id} name={id} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">tai vedä ja pudota</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        PNG, JPG, GIF enintään 10MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
