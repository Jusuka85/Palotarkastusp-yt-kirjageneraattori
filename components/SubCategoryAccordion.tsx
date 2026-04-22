

import React, { useState } from 'react';

interface SubCategoryAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasDeficiency?: boolean;
  hasRecommendation?: boolean;
  isOk?: boolean;
  onHide?: () => void;
}

const SubCategoryAccordion: React.FC<SubCategoryAccordionProps> = ({ title, children, defaultOpen = false, hasDeficiency = false, hasRecommendation = false, isOk = false, onHide }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const baseButtonClasses = "w-full text-left p-3 flex justify-between items-center transition-colors rounded-md";
  const defaultBgClasses = "bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700";
  const deficiencyBgClasses = "bg-red-100 dark:bg-red-900/40 hover:bg-red-200/70 dark:hover:bg-red-900/60";
  const recommendationBgClasses = "bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-200/70 dark:hover:bg-yellow-900/60";
  const okBgClasses = "bg-green-100 dark:bg-green-900/40 hover:bg-green-200/70 dark:hover:bg-green-900/60";
  const buttonClasses = `${baseButtonClasses} ${hasDeficiency ? deficiencyBgClasses : hasRecommendation ? recommendationBgClasses : isOk ? okBgClasses : defaultBgClasses}`;

  const baseTitleClasses = "text-lg font-semibold";
  const defaultTitleClasses = "text-slate-700 dark:text-slate-300";
  const deficiencyTitleClasses = "text-red-800 dark:text-red-200";
  const recommendationTitleClasses = "text-yellow-800 dark:text-yellow-200";
  const okTitleClasses = "text-green-800 dark:text-green-200";
  const titleClasses = `${baseTitleClasses} ${hasDeficiency ? deficiencyTitleClasses : hasRecommendation ? recommendationTitleClasses : isOk ? okTitleClasses : defaultTitleClasses}`;


  return (
    <div className="mb-4 last:mb-0">
      <div className={`${buttonClasses} flex items-center justify-between group cursor-pointer`}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex-grow flex items-center justify-between"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
              {hasDeficiency && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
              )}
              {hasRecommendation && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" viewBox="http://www.w3.org/2000/svg" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
              )}
              {!hasDeficiency && !hasRecommendation && isOk && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
              )}
              <h4 className={titleClasses}>{title}</h4>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform text-slate-500 dark:text-slate-400 ml-2 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-2 pr-2">
            {onHide && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onHide(); }} 
                    className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                    aria-label={`Piilota ${title}`}
                    title={`Piilota ${title}`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
            )}
        </div>
      </div>
      {isOpen && (
        <div className="pt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-600 ml-2 mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default SubCategoryAccordion;