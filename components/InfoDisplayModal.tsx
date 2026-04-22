import React, { useState } from 'react';

interface InfoDisplayModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const InfoDisplayModal: React.FC<InfoDisplayModalProps> = ({ isOpen, onClose, title, content }) => {
    const [copySuccess, setCopySuccess] = useState('');

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopySuccess('Kopioitu!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Kopiointi epäonnistui.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-6">
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{content}</p>
                </main>
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-4">
                    {copySuccess && <span className="text-sm text-green-600 dark:text-green-400 transition-colors">{copySuccess}</span>}
                    <button
                        onClick={handleCopy}
                        disabled={!content}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 flex items-center gap-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Kopioi
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
                        Sulje
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InfoDisplayModal;
