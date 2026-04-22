import React, { useState } from 'react';
import { checklistData } from '../data/checklistData';

interface ChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (itemText: string) => void;
}

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <h3 className="text-lg font-semibold">{title}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-4 bg-white dark:bg-slate-800">{children}</div>}
        </div>
    );
};

const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, onAddItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Lisää havainto tarkistuslistasta</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto">
                    {checklistData.map((category) => (
                        <AccordionItem key={category.name} title={category.name}>
                            <div className="space-y-4">
                                {category.subCategories.map((subCategory) => (
                                    <div key={subCategory.name} className="pl-4 border-l-2 border-slate-200 dark:border-slate-600">
                                        {subCategory.items && subCategory.items.length > 0 ? (
                                            <div>
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{subCategory.name}</h4>
                                                <ul className="space-y-1 mt-2">
                                                    {subCategory.items.map((item) => (
                                                        <li key={item}>
                                                            <button onClick={() => onAddItem(item)} className="text-blue-600 dark:text-blue-400 hover:underline text-left flex items-center group w-full">
                                                                <span className="mr-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">+</span> {item}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <button onClick={() => onAddItem(subCategory.name)} className="text-blue-600 dark:text-blue-400 hover:underline w-full text-left flex items-center group">
                                                <span className="mr-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">+</span> {subCategory.name}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default ChecklistModal;
