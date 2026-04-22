import React from 'react';
import { Observation } from '../types';
import TextareaField from './TextareaField';

interface FindingCardProps {
    finding: Observation;
    onUpdate: (updatedFinding: Observation) => void;
    onRemove: (id: string) => void;
    index: number;
}

const FindingCard: React.FC<FindingCardProps> = ({ finding, onUpdate, onRemove, index }) => {

    const handleChange = (field: keyof Observation, value: any) => {
        onUpdate({ ...finding, [field]: value });
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">Havainto #{index + 1}</h4>
                <button onClick={() => onRemove(finding.id)} className="text-red-500 hover:text-red-700 p-1">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            
            <TextareaField
                label="Puutteen kuvaus"
                id={`finding-desc-${finding.id}`}
                value={finding.description}
                onChange={e => handleChange('description', e.target.value)}
            />
        </div>
    );
};

export default FindingCard;