
import React, { useState, useEffect } from 'react';

interface GuidanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onSave: (title: string, newContent: string) => void;
    initialEditMode?: boolean; // New prop
}

const GuidanceModal: React.FC<GuidanceModalProps> = ({ isOpen, onClose, title, content, onSave, initialEditMode = false }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [editedContent, setEditedContent] = useState(content);

    useEffect(() => {
        if (isOpen) {
            setEditedContent(content);
            setIsEditing(initialEditMode); // Reset to view mode or initial edit mode when modal is reopened
        }
    }, [isOpen, content, initialEditMode]); // Add initialEditMode to dependency array

    const handleSave = () => {
        onSave(title, editedContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(content); // Revert changes
        setIsEditing(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Tarkastusohje: {title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-6 flex-grow">
                    {isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-full min-h-[300px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{content}</p>
                    )}
                </main>
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
                                Peruuta
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                                Tallenna
                            </button>
                        </>
                    ) : (
                        <>
                             <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                                Muokkaa
                            </button>
                            <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
                                Sulje
                            </button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default GuidanceModal;
