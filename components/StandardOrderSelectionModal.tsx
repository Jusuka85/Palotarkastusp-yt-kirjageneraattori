import React, { useEffect, useRef } from 'react';

interface StandardOrderSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Record<string, string[]>;
    onSelect: (order: string) => void;
    initialCategory?: string;
}

const StandardOrderSelectionModal: React.FC<StandardOrderSelectionModalProps> = ({ isOpen, onClose, categories, onSelect, initialCategory }) => {
    const detailsRefs = useRef<Record<string, HTMLDetailsElement | null>>({});

    useEffect(() => {
        if (isOpen && initialCategory && detailsRefs.current[initialCategory]) {
            // A small timeout allows the DOM to update after the modal opens
            setTimeout(() => {
                const element = detailsRefs.current[initialCategory];
                if (element) {
                    element.open = true;
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [isOpen, initialCategory]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">Valitse vakiomääräys</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-4 flex-grow">
                    <div className="space-y-4">
                        {categories && typeof categories === 'object' && Object.entries(categories).map(([category, orders]) => {
                            if (!Array.isArray(orders)) return null;
                            return (
                                <details 
                                    key={category} 
                                    ref={el => { detailsRefs.current[category] = el; }}
                                    className="border border-slate-200 dark:border-slate-700 rounded-lg"
                                >
                                    <summary className="p-3 font-semibold text-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50">
                                        {category}
                                    </summary>
                                    <ul className="p-3 space-y-2">
                                        {orders.map((order, index) => (
                                            <li key={index} className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded flex justify-between items-center gap-2">
                                                <p className="text-sm flex-grow whitespace-pre-wrap">{order}</p>
                                                <button 
                                                    onClick={() => onSelect(order)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex-shrink-0"
                                                >
                                                    Valitse
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            );
                        })}
                    </div>
                </main>
                 <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
                        Sulje
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default StandardOrderSelectionModal;