import React, { useState, useEffect } from 'react';

interface StandardTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (text: string) => void;
    storageKey: string;
    title: string;
    texts: string[];
    onSave: (updatedTexts: string[]) => void;
}

const StandardTextModal: React.FC<StandardTextModalProps> = ({ isOpen, onClose, onInsert, storageKey, title, texts, onSave }) => {
    const [newText, setNewText] = useState('');

    const handleAddText = () => {
        if (newText.trim()) {
            const updatedTexts = [...texts, newText.trim()];
            onSave(updatedTexts);
            setNewText('');
        }
    };

    const handleDeleteText = (indexToDelete: number) => {
        if (window.confirm('Haluatko varmasti poistaa tämän vakiotekstin?')) {
            const updatedTexts = texts.filter((_, index) => index !== indexToDelete);
            onSave(updatedTexts);
        }
    };
    
    const handleInsertText = (text: string) => {
        onInsert(text);
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-4 flex-grow">
                    {texts.length > 0 ? (
                        <ul className="space-y-3">
                            {texts.map((text, index) => (
                                <li key={index} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg flex justify-between items-start gap-4 border border-slate-200 dark:border-slate-700">
                                    <p className="flex-grow text-sm whitespace-pre-wrap">{text}</p>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleInsertText(text)} className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Lisää</button>
                                        <button onClick={() => handleDeleteText(index)} className="p-2 text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">Ei tallennettuja vakiotekstejä.</p>
                    )}
                </main>
                 <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-2">Lisää uusi vakioteksti</h3>
                    <textarea
                        value={newText}
                        onChange={e => setNewText(e.target.value)}
                        placeholder="Kirjoita uusi vakioteksti tähän..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    />
                    <div className="flex justify-end gap-4">
                         <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Sulje</button>
                        <button onClick={handleAddText} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300" disabled={!newText.trim()}>Tallenna uusi</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default StandardTextModal;
