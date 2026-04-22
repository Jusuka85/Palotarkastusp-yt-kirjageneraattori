
import React, { useState } from 'react';
import { Observation } from '../types';
import TextareaField from './TextareaField';
import CheckboxField from './CheckboxField';
import StandardOrderSelectionModal from './StandardOrderSelectionModal';

interface ObservationItemProps {
    observation: Observation;
    onUpdate: (updatedObservation: Observation) => void;
    onFetchCorrectionOrder: (observation: Observation, guidance?: string) => Promise<string[] | null>;
    onFetchSafetyObservation: (observation: Observation, guidance?: string) => Promise<string[] | null>;
    onFetchPositiveObservation: (observation: Observation) => Promise<string[] | null>;
    onAddCorrectionOrder: (order: string) => void; // Kept for compatibility but used less
    onAddRecommendation: (recommendation: string) => void; // Kept for compatibility but used less
    isGenerating: boolean;
    guidance?: string;
    onShowGuidance: (topic: string, initialEditMode?: boolean) => void;
    isTemporarilyOk: boolean;
    onTempOkChange: (id: string, isOk: boolean) => void;
    onTemporarilyHide: (topic: string) => void;
    categorizedCorrectionOrders: Record<string, string[]>;
    flatStandardCorrectionOrders: string[];
}

// Explicit mapping to ensure correct categories are opened
const manualCategoryMapping: Record<string, string> = {
    // Tulityöt ja tulen käsittely
    'Tulen käsittely': 'Tulityöt',
    'Tulityöt': 'Tulityöt',

    // Tilojen käyttö ja palokuorma
    'Tavaran säilyttäminen': 'Tilojen käyttö ja palokuorma',
    'Sähkölaitteiden/-laitteistojen kunto ja käyttö': 'Tilojen käyttö ja palokuorma',
    'Akkujen lataus': 'Tilojen käyttö ja palokuorma',
    'Muut havaitut onnettomuusriskit': 'Tilojen käyttö ja palokuorma',

    // Poistuminen
    'Poistumisreittien kulkukelpoisuus ja esteettömyys': 'Poistuminen ja opasteet',
    'Poistumisreittien riittävyys': 'Poistuminen ja opasteet',
    'Lukitukset ja ovien toiminta': 'Poistuminen ja opasteet',
    'Jälkiheijastavat poistumisopasteet': 'Poistuminen ja opasteet',
    'Turva- ja merkkivalaistuksen sijoittelu ja näkyvyys': 'Poistuminen ja opasteet',
    'Turva- ja merkkivalaistuksen huolto ja kunnossapito': 'Poistuminen ja opasteet',

    // Palo-osastoinnit
    'Osastoivat rakenteet': 'Palo-osastoinnit',
    'Ilmanvaihtokanavien osastointi': 'Palo-osastoinnit',
    'Läpivientien tiivistykset': 'Palo-osastoinnit',
    'Palo-ovien huolto- ja kunnossapito': 'Palo-osastoinnit',

    // Ilmanvaihto
    'Huolto ja puhdistus': 'Ilmanvaihto',
    'Kohdepoistojen huolto ja puhdistus': 'Ilmanvaihto',

    // Nuohous
    'Tulisijojen ja savunhormien rakenteet ja kunto': 'Nuohous ja tulisijat',
    'Nuohous': 'Nuohous ja tulisijat',
    'Nuohoustyön turvallisuus': 'Nuohous ja tulisijat',
    'Tulisijojen ja ja savunhormien rakenteet ja kunto': 'Nuohous ja tulisijat', // Typo handling if present in data
    'Kattilahuone': 'Nuohous ja tulisijat',
    'Lämmityslaitteiston rakenteet ja kunto': 'Nuohous ja tulisijat',
    'Huolto- ja kunnossapito (sis. nuohous)': 'Nuohous ja tulisijat',

    // Merkinnät (Yleinen)
    'Osoitemerkintä': 'Merkinnät ja opasteet (Yleinen)',
    'Kiinteistötekniikan merkinnät ja opasteet': 'Merkinnät ja opasteet (Yleinen)',
    'Pelastushenkilöstölle vaarallisten tilojen ja laitteiden merkintä': 'Merkinnät ja opasteet (Yleinen)',
    'Luvaton pelastustiemerkintä': 'Merkinnät ja opasteet (Yleinen)',
    'Merkintä': 'Merkinnät ja opasteet (Yleinen)', // Pelastustie context usually
    'Ajokelpoisuus ja esteettömyys': 'Merkinnät ja opasteet (Yleinen)', // Pelastustie context

    // Paloilmoittimet
    'Palovaroittimet': 'Paloilmoittimet ja -varoittimet',
    'Sähköverkkoon kytketyt palovaroittimet': 'Paloilmoittimet ja -varoittimet',
    'Palovaroitinjärjestelmä': 'Paloilmoittimet ja -varoittimet',
    'Paloilmoitin ilman hätäkeskusyhteyttä': 'Paloilmoittimet ja -varoittimet',
    'Hätäkeskukseen kytketty paloilmoitin': 'Paloilmoittimet ja -varoittimet',

    // Automaattiset sammutuslaitteistot
    'Automaattinen sammutuslaitteisto': 'Automaattiset sammutuslaitteistot',
    'Kaasusammutuslaitteisto': 'Automaattiset sammutuslaitteistot',
    'Kiinteät sammutusvesiputkistot': 'Automaattiset sammutuslaitteistot',

    // Väestönsuojat (Note: "Merkinnät ja opasteet" appearing in VSS subcategory maps here)
    'Väestönsuojan rakenteet ja kunto': 'Väestönsuojat',
    'Poikkeusolojen ilmanvaihto': 'Väestönsuojat',
    'Väestönsuojan varusteet': 'Väestönsuojat',
    'Suojelumateriaalit': 'Väestönsuojat',
    'Käyttöönoton suunnittelu': 'Väestönsuojat',
    
    // Savunpoisto
    'Savunpoisto': 'Savunpoisto',

    // Pelastussuunnitelma
    'Pelastussuunnitelma': 'Pelastussuunnitelma',
    'Vaarojen ja riskien arviointi': 'Pelastussuunnitelma',
    
    // Alkusammutuskalusto
    'Alkusammutuskalusto': 'Alkusammutuskalusto'
};


const ObservationItem: React.FC<ObservationItemProps> = ({
    observation,
    onUpdate,
    onFetchCorrectionOrder,
    onFetchSafetyObservation,
    onFetchPositiveObservation,
    onAddCorrectionOrder,
    onAddRecommendation,
    isGenerating,
    guidance,
    onShowGuidance,
    isTemporarilyOk,
    onTempOkChange,
    onTemporarilyHide,
    categorizedCorrectionOrders
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionType, setSuggestionType] = useState<'correction' | 'recommendation' | 'ok' | null>(null);
    const [isStandardOrderModalOpen, setIsStandardOrderModalOpen] = useState(false);

    const handleStatusChange = (status: Observation['status']) => {
        if (observation.status === status) {
            onUpdate({ ...observation, status: 'unchecked', description: '', correctionAction: '', recommendationAction: '' });
        } else {
            // Reset actions when changing status to keep UI clean, or keep them if needed? 
            // Clearing avoids confusion.
            onUpdate({ ...observation, status, correctionAction: '', recommendationAction: '' });
        }
        setSuggestions([]);
        setSuggestionType(null);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...observation, description: e.target.value });
    };

    const handleCorrectionActionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...observation, correctionAction: e.target.value });
    };

    const handleRecommendationActionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...observation, recommendationAction: e.target.value });
    };

    const handleFetchSuggestions = async () => {
        let result: string[] | null = null;
        setSuggestions([]);
        if (observation.status === 'deficiency') {
            result = await onFetchCorrectionOrder(observation, guidance);
            setSuggestionType('correction');
        } else if (observation.status === 'recommendation') {
            result = await onFetchSafetyObservation(observation, guidance);
            setSuggestionType('recommendation');
        } else if (observation.status === 'ok') {
            result = await onFetchPositiveObservation(observation);
            setSuggestionType('ok');
        }
        if (result) {
            setSuggestions(result);
        }
    };

    const handleUseSuggestion = (suggestion: string) => {
        if (suggestionType === 'correction') {
            // Update the specific correction action field instead of adding to global list
            onUpdate({ ...observation, correctionAction: suggestion });
        } else if (suggestionType === 'recommendation') {
            // Update the specific recommendation action field instead of adding to global list
            onUpdate({ ...observation, recommendationAction: suggestion });
        } else if (suggestionType === 'ok') {
            onUpdate({ ...observation, description: suggestion });
        }
        setSuggestions([]);
        setSuggestionType(null);
    };

    const handleSelectStandardOrder = (order: string) => {
        // Set the standard order to the correction action field
        onUpdate({ ...observation, correctionAction: order });
        setIsStandardOrderModalOpen(false);
    };

    const getInitialCategoryForStandardOrders = () => {
        const categories = Object.keys(categorizedCorrectionOrders);
        const topic = observation.topic;
        const subCat = observation.subCategory;
        const lowerTopic = topic.toLowerCase();
        const lowerSubCat = subCat.toLowerCase();

        // 0. Priority: Check strict manual mapping first
        if (manualCategoryMapping[topic] && categories.includes(manualCategoryMapping[topic])) {
            return manualCategoryMapping[topic];
        }

        // Handle generic "Merkinnät ja opasteet" based on subcategory context if strict match didn't catch it
        if (topic === 'Merkinnät ja opasteet') {
            if (subCat === 'Väestönsuojat') return 'Väestönsuojat';
            return 'Merkinnät ja opasteet (Yleinen)';
        }

        // 1. Check if the Category Name matches the Topic Name directly (e.g. "Tulityöt" -> "Tulityöt")
        const topicMatch = categories.find(category => 
            category.toLowerCase() === lowerTopic || 
            category.toLowerCase().includes(lowerTopic)
        );
        if (topicMatch) return topicMatch;

        // 2. Check if the Category Name matches the SubCategory Name
        const subCategoryMatch = categories.find(category => 
            category.toLowerCase().includes(lowerSubCat)
        );
        if (subCategoryMatch) return subCategoryMatch;

        // 3. Fallback: Find a category where the observation's topic is mentioned inside an order text.
        const textContentMatch = categories.find(category => 
            categorizedCorrectionOrders[category].some(order => order.toLowerCase().includes(lowerTopic))
        );
        if (textContentMatch) return textContentMatch;
        
        // Final fallback: just return the first category.
        return categories[0];
    };


    const baseClasses = "border-l-4 p-4 mb-4 transition-colors";
    const statusClasses = {
        unchecked: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600",
        ok: "bg-green-50 dark:bg-green-900/20 border-green-500",
        deficiency: "bg-red-50 dark:bg-red-900/20 border-red-500",
        recommendation: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500",
    };

    const currentStatus = isTemporarilyOk ? 'ok' : observation.status;
    const itemClasses = `${baseClasses} ${statusClasses[currentStatus]}`;

    return (
        <div className={itemClasses}>
            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{observation.topic}</h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                        onClick={() => onShowGuidance(observation.topic, !guidance)} 
                        className="p-1.5 rounded-full text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors" 
                        title={guidance ? "Näytä/Muokkaa ohjetta" : "Lisää ohje"} 
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => onTemporarilyHide(observation.topic)} className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600" title="Piilota väliaikaisesti">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
                <button
                    onClick={() => handleStatusChange('ok')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${observation.status === 'ok' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/80'}`}
                >
                    OK
                </button>
                <button
                    onClick={() => handleStatusChange('deficiency')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${observation.status === 'deficiency' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/80'}`}
                >
                    Puute
                </button>
                <button
                    onClick={() => handleStatusChange('recommendation')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${observation.status === 'recommendation' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:hover:bg-yellow-900/80'}`}
                >
                    Suositus
                </button>
            </div>

            {observation.status === 'unchecked' && (
                <CheckboxField
                    label="Merkitse väliaikaisesti kunnossa olevaksi (ei tule raporttiin)"
                    id={`temp-ok-${observation.id}`}
                    checked={isTemporarilyOk}
                    onChange={(e) => onTempOkChange(observation.id, e.target.checked)}
                />
            )}

            {(observation.status !== 'unchecked' || isTemporarilyOk) && (
                <div>
                    <TextareaField
                        label={observation.status === 'deficiency' ? 'Puutteen kuvaus' : observation.status === 'recommendation' ? 'Suosituksen kuvaus' : 'Havainnon kuvaus'}
                        id={`desc-${observation.id}`}
                        value={observation.description}
                        onChange={handleDescriptionChange}
                        placeholder={
                            observation.status === 'ok' 
                                ? `${observation.topic} on kunnossa.`
                                : observation.status === 'deficiency'
                                ? `Kuvaile havaittu puute...`
                                : `Kuvaile suositeltava toimenpide...`
                        }
                    />

                    {/* Correction Action Field - Only for deficiencies */}
                    {observation.status === 'deficiency' && (
                        <div className="mt-3">
                             <TextareaField
                                label="Korjausmääräys"
                                id={`correction-${observation.id}`}
                                value={observation.correctionAction || ''}
                                onChange={handleCorrectionActionChange}
                                placeholder="Kirjoita korjausmääräys tai valitse vakiomääräys..."
                                wrapperClassName="mb-1 flex-grow"
                            />
                        </div>
                    )}

                    {/* Recommendation Action Field - Only for recommendations */}
                    {observation.status === 'recommendation' && (
                        <div className="mt-3">
                             <TextareaField
                                label="Toimenpidesuositus"
                                id={`recommendation-${observation.id}`}
                                value={observation.recommendationAction || ''}
                                onChange={handleRecommendationActionChange}
                                placeholder="Kirjoita suositeltu toimenpide..."
                                wrapperClassName="mb-1 flex-grow"
                            />
                        </div>
                    )}

                    <div className="flex gap-2 mt-2 flex-wrap">
                        {observation.status === 'deficiency' && (
                            <button
                                onClick={() => setIsStandardOrderModalOpen(true)}
                                className="px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600"
                            >
                                Valitse vakiomääräys
                            </button>
                        )}
                        <button
                            onClick={handleFetchSuggestions}
                            disabled={isGenerating || (observation.status !== 'ok' && !observation.description)}
                            className="px-3 py-1 text-sm bg-violet-600 text-white font-semibold rounded shadow-sm hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                             {isGenerating && suggestionType === (observation.status === 'deficiency' ? 'correction' : observation.status === 'recommendation' ? 'recommendation' : 'ok') ? (
                                <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Luodaan...
                                </>
                            ) : `Luo ehdotuksia tekoälyllä`}
                        </button>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="mt-4 p-3 border-t border-dashed border-slate-300 dark:border-slate-600">
                            <h5 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Tekoälyn ehdotukset:</h5>
                            <ul className="space-y-2">
                                {suggestions.map((s, i) => (
                                    <li key={i} className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md flex justify-between items-start gap-2">
                                        <p className="text-sm text-slate-800 dark:text-slate-200 flex-grow">{s}</p>
                                        <button onClick={() => handleUseSuggestion(s)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex-shrink-0">
                                            Käytä
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
             {isStandardOrderModalOpen && (
                <StandardOrderSelectionModal
                    isOpen={isStandardOrderModalOpen}
                    onClose={() => setIsStandardOrderModalOpen(false)}
                    categories={categorizedCorrectionOrders}
                    onSelect={handleSelectStandardOrder}
                    initialCategory={getInitialCategoryForStandardOrders()}
                />
            )}
        </div>
    );
};

export default ObservationItem;
