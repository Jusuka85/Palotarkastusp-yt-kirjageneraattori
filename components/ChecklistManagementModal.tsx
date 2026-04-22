
import React, { useState, useEffect, useMemo } from 'react';
import { ChecklistCategory, checklistData as defaultChecklistData } from '../data/checklistData';
import { defaultProfiles } from '../data/profiles';


interface ChecklistManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    profiles: Record<string, string[]>;
    activeProfile: string;
    checklist: ChecklistCategory[];
    onSave: (
        newChecklist: ChecklistCategory[],
        newProfiles: Record<string, string[]>, 
        newActiveProfile: string
    ) => void;
}

const getAllTopics = (checklist: ChecklistCategory[]): string[] => {
    return checklist.flatMap(category => 
        category.subCategories.flatMap(subCat => subCat.items || [subCat.name])
    );
};

const CategoryView: React.FC<{
    category: ChecklistCategory;
    tempVisibleItems: Set<string>;
    handleToggleGroup: (topics: string[], groupChecked: boolean) => void;
    handleToggleItem: (topic: string, checked: boolean) => void;
}> = ({ category, tempVisibleItems, handleToggleGroup, handleToggleItem }) => {
    const categoryTopics = useMemo(() => getAllTopics([category]), [category]);
    const isAllCategorySelected = useMemo(() => categoryTopics.every(t => tempVisibleItems.has(t)), [categoryTopics, tempVisibleItems]);

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 py-2">
            <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-700/50 rounded-t-md">
                <input
                    type="checkbox"
                    id={`cat-${category.name}`}
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    checked={isAllCategorySelected}
                    onChange={(e) => handleToggleGroup(categoryTopics, e.target.checked)}
                />
                <label htmlFor={`cat-${category.name}`} className="ml-3 text-lg font-semibold">{category.name}</label>
            </div>
            <div className="p-2 space-y-2">
                {category.subCategories.map(subCat => {
                    const subCatTopics = subCat.items || [subCat.name];
                    const isAllSubCatSelected = subCatTopics.every(t => tempVisibleItems.has(t));
                    return (
                        <div key={subCat.name} className="pl-4">
                             <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`subcat-${subCat.name}`}
                                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    checked={isAllSubCatSelected}
                                    onChange={(e) => handleToggleGroup(subCatTopics, e.target.checked)}
                                />
                                <label htmlFor={`subcat-${subCat.name}`} className="ml-3 font-semibold text-slate-700 dark:text-slate-300">{subCat.name}</label>
                            </div>
                            <div className="pl-6 mt-1 space-y-1">
                                {subCatTopics.map(item => (
                                    <div key={item} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`item-${item}`}
                                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            checked={tempVisibleItems.has(item)}
                                            onChange={(e) => handleToggleItem(item, e.target.checked)}
                                        />
                                        <label htmlFor={`item-${item}`} className="ml-3 text-sm text-slate-600 dark:text-slate-400">{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const ChecklistManagementModal: React.FC<ChecklistManagementModalProps> = ({ isOpen, onClose, profiles, activeProfile, checklist, onSave }) => {
    const [view, setView] = useState<'profiles' | 'structure'>('profiles');
    const [selectedProfile, setSelectedProfile] = useState(activeProfile);
    const [tempVisibleItems, setTempVisibleItems] = useState<Set<string>>(new Set());
    const [newProfileName, setNewProfileName] = useState('');
    const [localProfiles, setLocalProfiles] = useState(profiles);
    const [localChecklist, setLocalChecklist] = useState<ChecklistCategory[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [addingTo, setAddingTo] = useState<{ type: 'category' | 'subCategory' | 'item', categoryIndex?: number, subCategoryIndex?: number } | null>(null);


    useEffect(() => {
        if (isOpen) {
            setLocalChecklist(JSON.parse(JSON.stringify(checklist))); // Deep copy
            setLocalProfiles(profiles);
            setSelectedProfile(activeProfile);
            setTempVisibleItems(new Set(profiles[activeProfile] || []));
            setView('profiles');
        }
    }, [isOpen, activeProfile, profiles, checklist]);

    const handleProfileSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const profileName = e.target.value;
        setSelectedProfile(profileName);
        setTempVisibleItems(new Set(localProfiles[profileName] || []));
    };

    const handleToggleItem = (topic: string, checked: boolean) => {
        setTempVisibleItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(topic);
            } else {
                newSet.delete(topic);
            }
            return newSet;
        });
    };

    const handleToggleGroup = (topics: string[], groupChecked: boolean) => {
         setTempVisibleItems(prev => {
            const newSet = new Set(prev);
            if (groupChecked) {
                topics.forEach(topic => newSet.add(topic));
            } else {
                topics.forEach(topic => newSet.delete(topic));
            }
            return newSet;
        });
    };

    const handleSaveNewProfile = () => {
        if (!newProfileName.trim() || localProfiles[newProfileName.trim()]) {
            alert('Anna uniikki nimi profiilille.');
            return;
        }
        const name = newProfileName.trim();
        const updatedProfiles = {
            ...localProfiles,
            [name]: Array.from(tempVisibleItems)
        };
        setLocalProfiles(updatedProfiles);
        setSelectedProfile(name);
        setNewProfileName('');
    };

    const handleUpdateProfile = () => {
        if (selectedProfile === 'Oletus') {
            alert('Oletusprofiilia ei voi muokata. Tallenna muutokset uutena profiilina.');
            return;
        }
        const updatedProfiles = {
            ...localProfiles,
            [selectedProfile]: Array.from(tempVisibleItems)
        };
        setLocalProfiles(updatedProfiles);
        alert(`Profiili '${selectedProfile}' päivitetty.`);
    };

    const handleDeleteProfile = () => {
         if (selectedProfile === 'Oletus') {
            alert('Oletusprofiilia ei voi poistaa.');
            return;
        }
        if (window.confirm(`Haluatko varmasti poistaa profiilin '${selectedProfile}'?`)) {
            // FIX: Refactor to explicitly create a new object and delete the property
            const updatedProfiles = { ...localProfiles };
            delete updatedProfiles[selectedProfile];
            setLocalProfiles(updatedProfiles);
            setSelectedProfile('Oletus');
            setTempVisibleItems(new Set(localProfiles['Oletus'] || []));
        }
    };

    const handleApply = () => {
        // First, update the currently selected profile with the latest changes from the UI
        const updatedProfiles = {
            ...localProfiles,
            [selectedProfile]: Array.from(tempVisibleItems)
        };

        // Then, clean up all profiles to ensure they only contain topics that actually exist in the new checklist
        const allNewTopics = new Set(getAllTopics(localChecklist));
        const cleanedProfiles: Record<string, string[]> = {};
        for (const profileName in updatedProfiles) {
            cleanedProfiles[profileName] = updatedProfiles[profileName].filter(topic => allNewTopics.has(topic));
        }

        // Pass the updated data to the parent
        onSave(localChecklist, cleanedProfiles, selectedProfile);
    };

    // --- Structure editing handlers ---
    const handleAddNew = () => {
        if (!newItemName.trim() || !addingTo) return;
        const name = newItemName.trim();

        setLocalChecklist(prev => {
            const newChecklist = JSON.parse(JSON.stringify(prev));
            if (addingTo.type === 'category') {
                newChecklist.push({ name, subCategories: [] });
            } else if (addingTo.type === 'subCategory' && addingTo.categoryIndex !== undefined) {
                newChecklist[addingTo.categoryIndex].subCategories.push({ name, items: [] });
            } else if (addingTo.type === 'item' && addingTo.categoryIndex !== undefined && addingTo.subCategoryIndex !== undefined) {
                const subCat = newChecklist[addingTo.categoryIndex].subCategories[addingTo.subCategoryIndex];
                if (!subCat.items) subCat.items = [];
                subCat.items.push(name);
                // Also add to current profile
                setTempVisibleItems(p => new Set(p).add(name));
            }
            return newChecklist;
        });
        setNewItemName('');
        setAddingTo(null);
    };
    
    const handleDelete = (type: 'category' | 'subCategory' | 'item', indices: {cat: number, subCat?: number, item?: number}) => {
        if (!window.confirm("Haluatko varmasti poistaa tämän? Tämä poistaa myös kaikki sen sisältämät kohteet.")) return;

        setLocalChecklist(prev => {
            const newChecklist = JSON.parse(JSON.stringify(prev));
            if (type === 'item' && indices.subCat !== undefined && indices.item !== undefined) {
                const subCat = newChecklist[indices.cat].subCategories[indices.subCat];
                if (subCat.items) {
                    subCat.items.splice(indices.item, 1);
                }
            } else if (type === 'subCategory' && indices.subCat !== undefined) {
                newChecklist[indices.cat].subCategories.splice(indices.subCat, 1);
            } else if (type === 'category') {
                newChecklist.splice(indices.cat, 1);
            }
            return newChecklist;
        });
    };
    
    const handleResetToDefaults = () => {
        if (window.confirm("Haluatko varmasti palauttaa tarkistuslistan ja kaikki profiilit alkuperäiseen tilaansa? Kaikki omat muutoksesi menetetään.")) {
            // The onSave function will handle updating the state in App.tsx
            onSave(defaultChecklistData, defaultProfiles, 'Oletus');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">Muokkaa tarkistuslistaa ja profiileja</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 space-y-4">
                    <div className="flex border-b border-slate-300 dark:border-slate-600">
                        <button onClick={() => setView('profiles')} className={`px-4 py-2 font-semibold ${view === 'profiles' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Profiilit</button>
                        <button onClick={() => setView('structure')} className={`px-4 py-2 font-semibold ${view === 'structure' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Rakenne</button>
                    </div>

                    {view === 'profiles' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                            <div className="flex flex-col">
                                <label htmlFor="profile-select" className="text-sm font-medium mb-1">Aktiivinen profiili:</label>
                                <select id="profile-select" value={selectedProfile} onChange={handleProfileSelectionChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {Object.keys(localProfiles).map(name => <option key={name} value={name}>{name}</option>)}
                                </select>
                            </div>
                             <div className="flex flex-col">
                                <label htmlFor="new-profile-name" className="text-sm font-medium mb-1">Tallenna uusi profiili:</label>
                                 <div className="flex">
                                    <input
                                        type="text"
                                        id="new-profile-name"
                                        value={newProfileName}
                                        onChange={e => setNewProfileName(e.target.value)}
                                        placeholder="Uuden profiilin nimi"
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={handleSaveNewProfile} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 disabled:bg-blue-300" disabled={!newProfileName.trim()}>Tallenna</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <button onClick={handleUpdateProfile} disabled={selectedProfile === 'Oletus'} className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-slate-400 dark:disabled:bg-slate-600">Päivitä valittu</button>
                                 <button onClick={handleDeleteProfile} disabled={selectedProfile === 'Oletus'} className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-slate-400 dark:disabled:bg-slate-600">Poista valittu</button>
                            </div>
                        </div>
                    )}
                </div>

                <main className="overflow-y-auto flex-grow p-4">
                    {view === 'profiles' ? (
                        <>
                            <p className="text-sm text-slate-500 mb-4">Valitse ne kohdat, jotka haluat näyttää tarkistuslistalla.</p>
                            {localChecklist.map(category => 
                                <CategoryView 
                                    key={category.name} 
                                    category={category} 
                                    tempVisibleItems={tempVisibleItems}
                                    handleToggleGroup={handleToggleGroup}
                                    handleToggleItem={handleToggleItem}
                                />
                            )}
                        </>
                    ) : (
                        <div className="space-y-4">
                             <p className="text-sm text-slate-500">Lisää, muokkaa ja poista tarkistuslistan osioita. Muutokset vaikuttavat kaikkiin profiileihin.</p>
                             {localChecklist.map((category, catIndex) => (
                                 <div key={`${category.name}-${catIndex}`} className="p-2 border border-slate-200 dark:border-slate-700 rounded">
                                     <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700/50 rounded-t">
                                        <span className="font-bold text-lg">{category.name}</span>
                                        <button onClick={() => handleDelete('category', {cat: catIndex})} className="p-1 text-red-500 hover:text-red-700">Poista kategoria</button>
                                     </div>
                                     <div className="pl-4 pt-2 space-y-2">
                                         {category.subCategories.map((subCat, subCatIndex) => (
                                             <div key={`${subCat.name}-${subCatIndex}`} className="p-2 border-l-2 border-slate-200 dark:border-slate-600">
                                                 <div className="flex justify-between items-center">
                                                     <span className="font-semibold">{subCat.name}</span>
                                                     <button onClick={() => handleDelete('subCategory', {cat: catIndex, subCat: subCatIndex})} className="p-1 text-red-500 hover:text-red-700 text-sm">Poista</button>
                                                 </div>
                                                 <ul className="pl-4 mt-1 space-y-1 text-sm list-disc list-inside">
                                                     {subCat.items && subCat.items.length > 0 ? (
                                                        subCat.items.map((item, itemIndex) => (
                                                            <li key={`${item}-${itemIndex}`} className="flex justify-between items-center group">
                                                                <span>{item}</span>
                                                                <button onClick={() => handleDelete('item', {cat: catIndex, subCat: subCatIndex, item: itemIndex})} className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Poista</button>
                                                            </li>
                                                        ))
                                                     ) : (
                                                        subCat.items === undefined ? null :
                                                        <li className="text-slate-500 italic">
                                                            (Ei erillisiä tarkistuskohteita)
                                                        </li>
                                                     )}
                                                 </ul>
                                                 <button onClick={() => setAddingTo({ type: 'item', categoryIndex: catIndex, subCategoryIndex: subCatIndex })} className="text-blue-600 text-sm mt-1 hover:underline">+ Lisää tarkistuskohde</button>
                                             </div>
                                         ))}
                                         <button onClick={() => setAddingTo({ type: 'subCategory', categoryIndex: catIndex })} className="text-blue-600 text-sm mt-2 hover:underline">+ Lisää alakategoria</button>
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => setAddingTo({ type: 'category' })} className="mt-4 px-3 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700">+ Lisää pääkategoria</button>
                             
                             {addingTo && (
                                <div className="mt-4 p-4 border-t-2 border-blue-500 bg-slate-50 dark:bg-slate-900/50 rounded">
                                    <h4 className="font-semibold mb-2">
                                        {addingTo.type === 'category' && 'Lisää uusi pääkategoria'}
                                        {addingTo.type === 'subCategory' && `Lisää alakategoria kategoriaan "${localChecklist[addingTo.categoryIndex!].name}"`}
                                        {addingTo.type === 'item' && `Lisää tarkistuskohde alakategoriaan "${localChecklist[addingTo.categoryIndex!].subCategories[addingTo.subCategoryIndex!].name}"`}
                                    </h4>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={newItemName} 
                                            onChange={e => setNewItemName(e.target.value)} 
                                            placeholder="Nimi..." 
                                            className="flex-grow px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onKeyDown={e => e.key === 'Enter' && handleAddNew()}
                                        />
                                        <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Lisää</button>
                                        <button onClick={() => setAddingTo(null)} className="px-4 py-2 bg-slate-300 dark:bg-slate-600 rounded-md">Peruuta</button>
                                    </div>
                                </div>
                             )}

                            <div className="p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg mt-8">
                                <h4 className="font-bold text-red-800 dark:text-red-200">Palauta oletusasetukset</h4>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Tämä poistaa kaikki tekemäsi muutokset tarkistuslistan rakenteeseen sekä kaikki itse luomasi profiilit. Toimintoa ei voi perua.</p>
                                <button 
                                    onClick={handleResetToDefaults} 
                                    className="mt-3 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
                                >
                                    Palauta oletukset
                                </button>
                            </div>
                        </div>
                    )}
                </main>
                
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Peruuta</button>
                    <button onClick={handleApply} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Ota käyttöön</button>
                </footer>
            </div>
        </div>
    );
};

export default ChecklistManagementModal;
