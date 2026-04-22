import React, { useState, useEffect } from 'react';

interface CategorizedStandardTextManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategories: Record<string, string[]>;
    onSave: (updatedCategories: Record<string, string[]>) => void;
}

const CategorizedStandardTextManagerModal: React.FC<CategorizedStandardTextManagerModalProps> = ({ isOpen, onClose, initialCategories, onSave }) => {
    const [categories, setCategories] = useState<Record<string, string[]>>(initialCategories);
    const [editingText, setEditingText] = useState<{ category: string; index: number; text: string } | null>(null);
    const [movingText, setMovingText] = useState<{ category: string; index: number } | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [newText, setNewText] = useState('');
    const [newTextCategory, setNewTextCategory] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCategories(initialCategories);
            // Set the first category as the default for adding new texts
            const firstCategory = Object.keys(initialCategories)[0] || '';
            setNewTextCategory(firstCategory);
        }
    }, [isOpen, initialCategories]);
    
    if (!isOpen) return null;

    const handleSave = () => {
        onSave(categories);
        onClose();
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories[newCategory.trim()]) {
            setCategories(prev => ({ ...prev, [newCategory.trim()]: [] }));
            setNewCategory('');
        }
    };
    
    const handleDeleteCategory = (category: string) => {
        if (window.confirm(`Haluatko varmasti poistaa kategorian "${category}" ja kaikki sen sisältämät tekstit?`)) {
            setCategories(prev => {
                const { [category]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleAddText = () => {
        if (newText.trim() && newTextCategory) {
            setCategories(prev => ({
                ...prev,
                [newTextCategory]: [...(prev[newTextCategory] || []), newText.trim()]
            }));
            setNewText('');
        }
    };
    
    const handleDeleteText = (category: string, index: number) => {
        setCategories(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const handleStartEdit = (category: string, index: number, text: string) => {
        setEditingText({ category, index, text });
    };

    const handleSaveEdit = () => {
        if (!editingText) return;
        const { category, index, text } = editingText;
        if (text.trim()) {
            setCategories(prev => {
                const newTexts = [...prev[category]];
                newTexts[index] = text.trim();
                return { ...prev, [category]: newTexts };
            });
        }
        setEditingText(null);
    };

    const handleMoveText = (newCategory: string) => {
        if (!movingText) return;
        const { category: oldCategory, index } = movingText;
        const textToMove = categories[oldCategory][index];

        setCategories(prev => {
            const newOldCategoryTexts = prev[oldCategory].filter((_, i) => i !== index);
            const newNewCategoryTexts = [...(prev[newCategory] || []), textToMove];
            return {
                ...prev,
                [oldCategory]: newOldCategoryTexts,
                [newCategory]: newNewCategoryTexts
            };
        });
        setMovingText(null);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">Hallitse vakiomääräyksiä</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="overflow-y-auto p-4 flex-grow space-y-4">
                    {categories && typeof categories === 'object' && Object.entries(categories).map(([category, texts]) => (
                        <details key={category} open className="border border-slate-200 dark:border-slate-700 rounded-lg">
                            <summary className="p-3 font-semibold text-lg cursor-pointer flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                                {category}
                                <button onClick={(e) => { e.preventDefault(); handleDeleteCategory(category); }} className="p-1 text-red-500 hover:text-red-700 text-sm">Poista kategoria</button>
                            </summary>
                            <div className="p-3 space-y-2">
                                {Array.isArray(texts) && texts.map((text, index) => (
                                    <div key={index} className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded flex justify-between items-start gap-2">
                                        <p className="flex-grow text-sm whitespace-pre-wrap">{text}</p>
                                        <div className="flex-shrink-0 flex gap-2">
                                            <button onClick={() => setMovingText({ category, index })} className="p-1 text-slate-500 hover:text-blue-600" title="Siirrä"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></button>
                                            <button onClick={() => handleStartEdit(category, index, text)} className="p-1 text-slate-500 hover:text-green-600" title="Muokkaa"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                                            <button onClick={() => handleDeleteText(category, index)} className="p-1 text-slate-500 hover:text-red-600" title="Poista"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </main>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4 flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <h4 className="font-semibold mb-2">Lisää uusi kategoria</h4>
                             <div className="flex">
                                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Kategorian nimi" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700">Lisää</button>
                             </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Lisää uusi vakioteksti</h4>
                            <div className="flex">
                                <select value={newTextCategory} onChange={e => setNewTextCategory(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {categories && typeof categories === 'object' && Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <input type="text" value={newText} onChange={e => setNewText(e.target.value)} placeholder="Uusi teksti" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-y border-r border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <button onClick={handleAddText} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700">Lisää</button>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end gap-4">
                        <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Peruuta</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">Tallenna ja sulje</button>
                    </div>
                </footer>

                {editingText && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Muokkaa tekstiä</h3>
                            <textarea value={editingText.text} onChange={e => setEditingText(prev => prev ? {...prev, text: e.target.value} : null)} rows={5} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={() => setEditingText(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded font-semibold">Peruuta</button>
                                <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-600 text-white rounded font-semibold">Tallenna</button>
                            </div>
                        </div>
                    </div>
                )}
                 {movingText && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Siirrä teksti kategoriaan</h3>
                             <select onChange={e => handleMoveText(e.target.value)} defaultValue="" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>Valitse uusi kategoria</option>
                                {Object.keys(categories).filter(c => c !== movingText.category).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setMovingText(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded font-semibold">Peruuta</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorizedStandardTextManagerModal;