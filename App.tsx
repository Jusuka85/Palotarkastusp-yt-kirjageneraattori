
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { deflate, inflate } from 'pako';
import Header from './components/Header';
import Section from './components/Section';
import InputField from './components/InputField';
import TextareaField from './components/TextareaField';
import ObservationItem from './components/ObservationItem';
import StatementView from './components/StatementView';
import SubCategoryAccordion from './components/SubCategoryAccordion';
import ChecklistManagementModal from './components/ChecklistManagementModal';
import ReportManagementModal from './components/ReportManagementModal';
import StandardTextModal from './components/StandardTextModal';
import InfoDisplayModal from './components/InfoDisplayModal';
import GuidanceModal from './components/GuidanceModal';
import CategorizedStandardTextManagerModal from './components/CategorizedStandardTextManagerModal';
import UserGuideModal from './components/UserGuideModal';
import ShareModal from './components/ShareModal';
import ReportPreview from './components/ReportPreview';

import { FireInspectionReport, Observation } from './types';
import { checklistData, ChecklistCategory } from './data/checklistData';
import { guidanceData as defaultGuidanceData } from './data/guidanceData';
import { defaultStandardTexts } from './data/standardTexts';
import { defaultCategorizedCorrectionOrders } from './data/categorizedCorrectionOrders';
import { correctionOrderMappings } from './data/correctionOrderMappings';
import { defaultProfiles } from './data/profiles';

const getAllTopicsFromChecklist = (checklist: ChecklistCategory[]): string[] => {
    if (!Array.isArray(checklist)) return [];
    
    return checklist.flatMap(category => 
        (category.subCategories || []).flatMap(subCategory => 
            subCategory.items !== undefined ? subCategory.items : [subCategory.name]
        )
    );
};

const getInitialObservations = (currentChecklist: ChecklistCategory[]): Observation[] => {
  const observations: Observation[] = [];
  currentChecklist.forEach(category => {
    (category.subCategories || []).forEach(subCategory => {
      const items = subCategory.items !== undefined ? subCategory.items : [subCategory.name];
      items.forEach(topic => {
        observations.push({
          id: uuidv4(),
          topic: topic,
          category: category.name,
          subCategory: subCategory.name,
          status: 'unchecked',
          description: '',
        });
      });
    });
  });
  return observations;
};

const App: React.FC = () => {
    const [checklist, setChecklist] = useState<ChecklistCategory[]>(() => {
    try {
        const saved = localStorage.getItem('customChecklistData');
        return saved ? JSON.parse(saved) : checklistData;
    } catch (e) {
        console.error("Failed to parse checklist from localStorage", e);
        return checklistData;
    }
  });

  const createNewReport = (): FireInspectionReport => ({
    id: uuidv4(),
    target: '',
    address: '',
    businessId: '',
    description: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspector: [''],
    representative: [''],
    inspectionProcess: '',
    observations: getInitialObservations(checklist),
    correctionOrders: [''],
    recommendations: [''],
    hearing: '',
    appendices: '',
  });

  const [report, setReport] = useState<FireInspectionReport>(createNewReport);

  useEffect(() => {
     const urlParams = new URLSearchParams(window.location.search);
     const data = urlParams.get('data');

     if (data) {
       if (window.confirm('Havaitsimme esitäytetyn raportin linkissä. Haluatko ladata sen? Tämä korvaa nykyisen, tallentamattoman työn.')) {
         try {
           const decodedData = decodeURIComponent(data);
           const binaryString = atob(decodedData);
           const len = binaryString.length;
           const bytes = new Uint8Array(len);
           for (let i = 0; i < len; i++) {
             bytes[i] = binaryString.charCodeAt(i);
           }
           
           const decompressed = inflate(bytes);
           const jsonString = new TextDecoder().decode(decompressed);
           const loadedReport = JSON.parse(jsonString);

           if (loadedReport && loadedReport.id && Array.isArray(loadedReport.observations)) {
               setReport(loadedReport);
           } else {
               throw new Error("Invalid report data structure.");
           }

         } catch (error) {
           console.error("Failed to load report from URL:", error);
           alert("Raportin lataaminen linkistä epäonnistui. Varmista, että linkki on kokonainen ja oikein.");
         } finally {
           window.history.replaceState({}, document.title, window.location.pathname);
         }
       } else {
            window.history.replaceState({}, document.title, window.location.pathname);
       }
     } else {
        try {
          const savedReport = localStorage.getItem('currentReport');
          if(savedReport) {
            setReport(JSON.parse(savedReport));
          }
        } catch (e) {
          console.error("Failed to parse report from localStorage", e);
        }
     }
  }, []);

  const [showStatement, setShowStatement] = useState(false);
  const [isChecklistMgmtOpen, setIsChecklistMgmtOpen] = useState(false);
  const [isReportMgmtOpen, setIsReportMgmtOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [standardTextModal, setStandardTextModal] = useState({ isOpen: false, storageKey: '', title: '', onInsert: (text: string) => {} });
  const [isCategorizedManagerOpen, setIsCategorizedManagerOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', content: '' });
  const [guidanceModal, setGuidanceModal] = useState<{ isOpen: boolean; topic: string; initialEditMode?: boolean }>({ isOpen: false, topic: '' }); // Updated type for initialEditMode
  const [tempOkIds, setTempOkIds] = useState<Set<string>>(new Set());
  const [isCorrectionsOpen, setIsCorrectionsOpen] = useState(true);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(true);
  
  const [guidance, setGuidance] = useState<Record<string, string>>(() => {
    try {
        const savedGuidance = localStorage.getItem('customGuidanceData');
        return savedGuidance ? JSON.parse(savedGuidance) : defaultGuidanceData;
    } catch (e) {
        console.error("Failed to parse guidance from localStorage", e);
        return defaultGuidanceData;
    }
  });

  const [allStandardTexts, setAllStandardTexts] = useState<Record<string, string[]>>(() => {
    const allKeys = Object.keys(defaultStandardTexts);
    const loadedTexts: Record<string, string[]> = {};
    allKeys.forEach(key => {
        try {
            const stored = localStorage.getItem(key);
            loadedTexts[key] = stored ? JSON.parse(stored) : (defaultStandardTexts[key] || []);
        } catch (e) {
            console.error(`Failed to parse standard texts for key ${key}`, e);
            loadedTexts[key] = defaultStandardTexts[key] || [];
        }
    });
    return loadedTexts;
  });

   const [categorizedCorrectionOrders, setCategorizedCorrectionOrders] = useState<Record<string, string[]>>(() => {
    try {
        const saved = localStorage.getItem('categorizedCorrectionOrders');
        return saved ? JSON.parse(saved) : defaultCategorizedCorrectionOrders;
    } catch (e) {
        console.error("Failed to parse categorized correction orders from localStorage", e);
        return defaultCategorizedCorrectionOrders;
    }
  });

  const [checklistProfiles, setChecklistProfiles] = useState<Record<string, string[]>>(() => {
    try {
        const saved = localStorage.getItem('checklistProfiles');
        return saved ? { ...defaultProfiles, ...JSON.parse(saved) } : defaultProfiles;
    } catch(e) {
        console.error("Failed to parse profiles from localStorage", e);
        return defaultProfiles;
    }
  });

  const [activeProfile, setActiveProfile] = useState(() => localStorage.getItem('activeChecklistProfile') || 'Oletus');
  const visibleTopics = useMemo(() => new Set(checklistProfiles[activeProfile] || defaultProfiles['Oletus']), [checklistProfiles, activeProfile]);
  const [temporarilyHiddenTopics, setTemporarilyHiddenTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('currentReport', JSON.stringify(report));
  }, [report]);

  useEffect(() => {
    localStorage.setItem('checklistProfiles', JSON.stringify(checklistProfiles));
    localStorage.setItem('activeChecklistProfile', activeProfile);
  }, [checklistProfiles, activeProfile]);

  useEffect(() => {
    localStorage.setItem('customGuidanceData', JSON.stringify(guidance));
  }, [guidance]);
  
  useEffect(() => {
    localStorage.setItem('customChecklistData', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('categorizedCorrectionOrders', JSON.stringify(categorizedCorrectionOrders));
  }, [categorizedCorrectionOrders]);


  const handleSaveStandardTexts = (storageKey: string, newTexts: string[]) => {
      setAllStandardTexts(prev => {
          const newAllTexts = { ...prev, [storageKey]: newTexts };
          try {
              localStorage.setItem(storageKey, JSON.stringify(newTexts));
          } catch (e) {
              console.error("Failed to save standard texts to localStorage", e);
          }
          return newAllTexts;
      });
  };

  const handleSaveCategorizedCorrectionOrders = (newOrders: Record<string, string[]>) => {
    setCategorizedCorrectionOrders(newOrders);
  };

  const flatCorrectionOrders = useMemo(() => {
    return Object.values(categorizedCorrectionOrders).flat();
  }, [categorizedCorrectionOrders]);


  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (field: 'inspector' | 'representative' | 'correctionOrders' | 'recommendations', index: number, value: string) => {
    setReport(prev => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field: 'inspector' | 'representative' | 'correctionOrders' | 'recommendations', value: string = '') => {
    setReport(prev => ({ ...prev, [field]: [...prev[field].filter(item => item.trim() !== ''), value, ''] }));
  };

  const removeListItem = (field: 'inspector' | 'representative' | 'correctionOrders' | 'recommendations', index: number) => {
    setReport(prev => {
      const list = [...prev[field]];
      if (list.length > 1) {
        list.splice(index, 1);
        return { ...prev, [field]: list.filter(item => item.trim() !== '') }; // Filter out empty strings after removal
      }
      return { ...prev, [field]: [''] };
    });
  };

  const handleTempOkChange = (observationId: string, isTempOk: boolean) => {
    setTempOkIds(prev => {
      const newSet = new Set(prev);
      if (isTempOk) {
        newSet.add(observationId);
      } else {
        newSet.delete(observationId);
      }
      return newSet;
    });
  };

  const handleObservationUpdate = (updatedObservation: Observation) => {
    // If a permanent status is set (ok, deficiency, recommendation), it overrides any temporary status.
    if (updatedObservation.status !== 'unchecked') {
      handleTempOkChange(updatedObservation.id, false);
    }
    setReport(prev => ({
      ...prev,
      observations: prev.observations.map(obs =>
        obs.id === updatedObservation.id ? updatedObservation : obs
      ),
    }));
  };

  const handleAddCorrectionOrder = (order: string) => {
    if (!order.trim()) return;
    setReport(prev => {
      const currentOrders = prev.correctionOrders.filter(o => o.trim() !== '');
      return { ...prev, correctionOrders: [...currentOrders, order, ''] };
    });
  };

  const handleAddRecommendation = (recommendation: string) => {
    if (!recommendation.trim()) return;
    setReport(prev => {
      const currentRecs = prev.recommendations.filter(r => r.trim() !== '');
      return { ...prev, recommendations: [...currentRecs, recommendation, ''] };
    });
  };

    const handleOpenYtj = () => {
        if (!report.businessId.trim()) return;
        const url = `https://tietopalvelu.ytj.fi/yritys/${report.businessId.trim()}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

  // The original code was encountering a TypeScript error "Spread types may only be created from object types"
 // when initializing a Set with the result of `getAllTopicsFromChecklist`.
 // Although `getAllTopicsFromChecklist` is typed to return `string[]`, in some TypeScript configurations,
 // the iterable argument might be misinterpreted. Explicitly spreading the array (`...`)
 // ensures that the Set constructor receives individual elements, resolving the type inference issue.
 // This also removes the redundant `as string[]` assertion, relying on the function's strong return type.
 const handleSaveChecklistAndProfiles = (
    newChecklist: ChecklistCategory[],
    newProfilesFromModal: Record<string, string[]>,
    newActiveProfile: string
  ) => {
    const allTopicsInNewChecklist = new Set(getAllTopicsFromChecklist(newChecklist || []));

    // 2. Reconcile observations based on the new structure.
    setReport(prevReport => {
      const existingObservationsMap = new Map((prevReport.observations || []).map(obs => [obs.topic, obs]));
      const newObservations: Observation[] = [];

      newChecklist.forEach(category => {
        (category.subCategories || []).forEach(subCategory => {
            const topics = subCategory.items !== undefined ? subCategory.items : [subCategory.name];
            (topics || []).forEach(topic => {
                if (existingObservationsMap.has(topic)) {
                    // Preserve and update existing observation
                    newObservations.push({
                        ...existingObservationsMap.get(topic)!,
                        category: category.name,
                        subCategory: subCategory.name,
                    });
                } else {
                    // Create a new observation for a brand new topic
                    newObservations.push({
                        id: uuidv4(),
                        topic: topic,
                        category: category.name,
                        subCategory: subCategory.name,
                        status: 'unchecked',
                        description: '',
                    });
                }
            });
        });
      });
      return { ...prevReport, observations: newObservations };
    });

    // 3. Update profiles.
    // Start with the profiles returned from the modal.
    const finalProfiles = { ...newProfilesFromModal };
    
    // Clean every profile to ensure it only contains topics that exist in the new checklist.
    Object.keys(finalProfiles).forEach(profileName => {
        finalProfiles[profileName] = (finalProfiles[profileName] || []).filter(topic => allTopicsInNewChecklist.has(topic));
    });

    // Determine topics that were newly created in the modal.
    const allTopicsInOldChecklist = new Set(getAllTopicsFromChecklist(checklist));
    const newlyCreatedTopics = [...allTopicsInNewChecklist].filter(topic => !allTopicsInOldChecklist.has(topic));

    // Explicitly add these newly created topics to the active profile to guarantee visibility.
    if (newlyCreatedTopics.length > 0) {
        const activeProfileTopics = new Set(finalProfiles[newActiveProfile] || []);
        newlyCreatedTopics.forEach(topic => activeProfileTopics.add(topic));
        finalProfiles[newActiveProfile] = Array.from(activeProfileTopics);
    }
    
    // 4. Update the state with the finalized data.
    setChecklist(newChecklist);
    setChecklistProfiles(finalProfiles);
    setActiveProfile(newActiveProfile);
    setIsChecklistMgmtOpen(false);
  };
  
  // Report Management
  const [savedReports, setSavedReports] = useState<FireInspectionReport[]>(() => {
    try {
        const reports = localStorage.getItem('savedReports');
        return reports ? JSON.parse(reports) : [];
    } catch (e) {
        return [];
    }
  });

  const handleSaveReport = () => {
    const reportToSave = { ...report, id: report.id || uuidv4() };
    const existingIndex = savedReports.findIndex(r => r.id === reportToSave.id);
    let newReports;
    if (existingIndex > -1) {
      newReports = [...savedReports];
      newReports[existingIndex] = reportToSave;
    } else {
      newReports = [...savedReports, reportToSave];
    }
    setSavedReports(newReports);
    localStorage.setItem('savedReports', JSON.stringify(newReports));
    alert('Raportti tallennettu!');
  };

  const handleSaveAsNewReport = () => {
    const newReport: FireInspectionReport = {
      ...JSON.parse(JSON.stringify(report)), // Simple deep copy
      id: uuidv4(),
      target: report.target ? `${report.target} (kopio)` : 'Nimetön raportti (kopio)'
    };

    const newReports = [...savedReports, newReport];
    setSavedReports(newReports);
    localStorage.setItem('savedReports', JSON.stringify(newReports));

    // Update the current working report to be the new one
    setReport(newReport);

    alert('Raportti tallennettu uutena!');
  };


  const handleLoadReport = (reportId: string) => {
    const reportToLoad = savedReports.find(r => r.id === reportId);
    if (reportToLoad) {
      setReport(reportToLoad);
      setIsReportMgmtOpen(false);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Haluatko varmasti poistaa tämän raportin? Tätä ei voi perua.')) {
      const newReports = savedReports.filter(r => r.id !== reportId);
      setSavedReports(newReports);
      localStorage.setItem('savedReports', JSON.stringify(newReports));
      if (report.id === reportId) {
        setReport(createNewReport());
      }
    }
  };

   const handleShareReport = () => {
      try {
        const jsonString = JSON.stringify(report);
        const compressed = deflate(new TextEncoder().encode(jsonString));
        const base64String = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
        const url = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(base64String)}`;
        setShareUrl(url);
        setIsShareModalOpen(true);
      } catch (error) {
        console.error("Failed to create share link:", error);
        alert("Esitäytetyn linkin luonti epäonnistui.");
      }
    };
  
  const handleClearForm = () => {
    if (window.confirm('Haluatko varmasti tyhjentää koko lomakkeen ja aloittaa alusta? Kaikki tallentamattomat tiedot menetetään.')) {
        // Reset the main report data
        setReport(createNewReport());
        
        // Reset UI state to its initial condition
        setShowStatement(false);
        setTempOkIds(new Set());
        setActiveProfile('Oletus'); // Reset to default checklist profile
        setTemporarilyHiddenTopics(new Set()); // Reset temporary hidden topics

        // Reset accordion states
        setIsCorrectionsOpen(true);
        setIsRecommendationsOpen(true);
        
        // Scroll to the top for a fresh start
        window.scrollTo(0, 0);
    }
  };

  const handleTemporarilyHideTopics = (topicsToHide: string[]) => {
    setTemporarilyHiddenTopics(prev => {
        const newSet = new Set(prev);
        topicsToHide.forEach(topic => newSet.add(topic));
        return newSet;
    });
  };

  const handleTemporarilyHideTopic = (topic: string) => {
    setTemporarilyHiddenTopics(prev => {
        const newSet = new Set(prev);
        newSet.add(topic);
        return newSet;
    });
  };


  const openStandardTextModal = (field: 'inspectionProcess' | 'hearing' | 'appendices' | 'recommendations' | 'correctionOrders' | 'inspector' | 'representative', title: string) => {
      const onInsert = (text: string) => {
          if (field === 'recommendations' || field === 'correctionOrders' || field === 'inspector' || field === 'representative') {
              setReport(prev => {
                  const key = field as 'recommendations' | 'correctionOrders' | 'inspector' | 'representative';
                  const currentList = prev[key].filter(item => item.trim() !== '');
                  return {...prev, [key]: [...currentList, text, '']};
              });
          } else {
              setReport(prev => ({...prev, [field]: prev[field] ? `${prev[field]}\n${text}` : text}));
          }
      };
      setStandardTextModal({ isOpen: true, storageKey: `std-text-${field}`, title, onInsert });
  };

  const handleQuickAddStandardText = (field: 'inspectionProcess' | 'hearing' | 'appendices') => {
    const storageKey = `std-text-${field}`;
    const defaultText = allStandardTexts[storageKey]?.[0];

    if (defaultText) {
        setReport(prev => {
            const currentText = prev[field] || '';
            const newText = currentText ? `${currentText}\n${defaultText}` : defaultText;
            return { ...prev, [field]: newText };
        });
    }
  };

  const handleShowGuidance = (topic: string, initialEditMode: boolean = false) => { // Added initialEditMode
    setGuidanceModal({ isOpen: true, topic: topic, initialEditMode: initialEditMode }); // Pass initialEditMode
  };

  const handleSaveGuidance = (topic: string, newContent: string) => {
    setGuidance(prev => ({
        ...prev,
        [topic]: newContent
    }));
  };

  const renderList = (field: 'inspector' | 'representative' | 'correctionOrders' | 'recommendations', label: string) => (
    <>
      {report[field].map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <TextareaField
            label={`${label} ${index + 1}`}
            id={`${field}-${index}`}
            value={item}
            onChange={(e) => handleListChange(field, index, e.target.value)}
            rows={field === 'inspector' || field === 'representative' ? 1 : 2}
            wrapperClassName="flex-grow" // Use wrapperClassName to allow expansion
          />
          <button
            onClick={() => removeListItem(field, index)}
            className="p-2 text-red-500 hover:text-red-700 rounded-full self-end mb-4"
            aria-label={`Poista ${label} ${index + 1}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="http://www.w3.org/2000/svg" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
          </button>
        </div>
      ))}
      <button onClick={() => addListItem(field)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
        Lisää {label}
      </button>
       {field === 'correctionOrders' ? (
            <button 
                onClick={() => setIsCategorizedManagerOpen(true)} 
                className="ml-2 px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600"
            >
                Vakiomääräysten hallinta
            </button>
        ) : null}
    </>
  );

  const observationBasedOrders = useMemo(() => {
    return report.observations
      .filter(obs => obs.status === 'deficiency')
      .map(obs => ({
        id: obs.id,
        topic: obs.topic,
        text: obs.correctionAction || obs.description
      }))
      .filter(item => item.text && item.text.trim() !== '');
  }, [report.observations]);

  const observationBasedRecommendations = useMemo(() => {
    return report.observations
      .filter(obs => obs.status === 'recommendation')
      .map(obs => ({
        id: obs.id,
        topic: obs.topic,
        text: obs.recommendationAction || obs.description
      }))
      .filter(item => item.text && item.text.trim() !== '');
  }, [report.observations]);

  return showStatement ? (
    <StatementView report={report} onBack={() => setShowStatement(false)} />
  ) : (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <button onClick={() => setShowStatement(false)} className={`px-4 py-2 rounded-l-lg font-semibold ${!showStatement ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-100'}`}>Lomake</button>
            <button onClick={() => setShowStatement(true)} className={`px-4 py-2 rounded-r-lg font-semibold ${showStatement ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-100'}`}>Lausunto</button>
          </div>
           <div className="flex gap-2 flex-wrap">
              <button onClick={() => setIsUserGuideOpen(true)} className="px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Käyttöohje
              </button>
              <button onClick={() => setIsReportMgmtOpen(true)} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700">Tallennetut raportit</button>
              <button onClick={handleShareReport} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                Jaa esitäytettynä
              </button>
              <button onClick={handleSaveAsNewReport} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Tallenna uutena</button>
              <button onClick={handleSaveReport} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">Tallenna nykyinen</button>
              <button onClick={handleClearForm} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">Tyhjennä lomake</button>
           </div>
        </div>

        <Section title="1. Perustiedot" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <InputField label="Tarkastuskohde" id="target" name="target" value={report.target} onChange={handleReportChange} />
                <div className="mb-4">
                    <label htmlFor="businessId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Y-tunnus
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="businessId"
                            name="businessId"
                            value={report.businessId}
                            onChange={handleReportChange}
                            placeholder="1234567-8"
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                         <button 
                            onClick={handleOpenYtj}
                            disabled={!report.businessId.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex-shrink-0"
                            title="Avaa Y-tunnus YTJ-tietopalvelussa uuteen välilehteen"
                         >
                            Tarkista YTJ:stä
                         </button>
                    </div>
                </div>
                <InputField label="Osoite" id="address" name="address" value={report.address} onChange={handleReportChange} />
                <TextareaField label="Kohteen kuvaus" id="description" name="description" value={report.description} onChange={handleReportChange} rows={2} />
              </div>
              <InputField label="Tarkastuspäivämäärä" id="inspectionDate" name="inspectionDate" type="date" value={report.inspectionDate} onChange={handleReportChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
            <div>{renderList('inspector', 'Tarkastaja')}</div>
            <div>{renderList('representative', 'Kohteen edustaja')}</div>
          </div>
        </Section>

        <Section title="2. Tarkastuksen kulku">
            <TextareaField label="" id="inspectionProcess" name="inspectionProcess" value={report.inspectionProcess} onChange={handleReportChange} rows={5} />
            <div className="flex items-center gap-2 mt-2">
                <button onClick={() => openStandardTextModal('inspectionProcess', 'Valitse vakioteksti: Tarkastuksen kulku')} className="px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600">Lisää vakioteksti</button>
                <button 
                    onClick={() => handleQuickAddStandardText('inspectionProcess')}
                    disabled={!allStandardTexts['std-text-inspectionProcess']?.[0]}
                    className="p-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Lisää oletusteksti"
                    aria-label="Lisää oletusteksti tarkastuksen kulkuun"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </Section>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md my-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-center p-4 flex-wrap gap-4">
                 <h2 className="text-2xl font-bold">3. Tarkistuslista</h2>
                 <div className="flex items-center gap-4 flex-wrap">
                    {temporarilyHiddenTopics.size > 0 && (
                        <button 
                            onClick={() => setTemporarilyHiddenTopics(new Set())} 
                            className="px-3 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 text-sm"
                        >
                            Palauta piilotetut ({temporarilyHiddenTopics.size})
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <label htmlFor="checklist-profile-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">Profiili:</label>
                        <select
                            id="checklist-profile-select"
                            value={activeProfile}
                            onChange={(e) => setActiveProfile(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            {Object.keys(checklistProfiles).sort().map(profileName => (
                                <option key={profileName} value={profileName}>
                                    {profileName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => setIsChecklistMgmtOpen(true)} className="px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600">Muokkaa listaa</button>
                 </div>
            </div>
        </div>
        
        {checklist.map(category => {
          const visibleSubCategories = category.subCategories.filter(subCat => {
            const topics = subCat.items || [subCat.name];
            return topics.some(topic => visibleTopics.has(topic) && !temporarilyHiddenTopics.has(topic));
          });

          const categoryObservations = report.observations.filter(o => o.category === category.name && visibleTopics.has(o.topic) && !temporarilyHiddenTopics.has(o.topic));
          const hasDeficiency = categoryObservations.some(o => o.status === 'deficiency');
          const hasRecommendation = categoryObservations.some(o => o.status === 'recommendation');
          const isOk = !hasDeficiency && !hasRecommendation && categoryObservations.length > 0 && categoryObservations.every(o => o.status === 'ok' || tempOkIds.has(o.id));
          const categoryTopics = category.subCategories.flatMap(sc => sc.items || [sc.name]);

          return (
            <Section 
              key={category.name} 
              title={category.name} 
              hasDeficiency={hasDeficiency} 
              hasRecommendation={!hasDeficiency && hasRecommendation}
              isOk={isOk}
              onHide={() => handleTemporarilyHideTopics(categoryTopics)}
            >
              {visibleSubCategories.length > 0 ? (
                visibleSubCategories.map(subCategory => {
                  const subCategoryTopics = subCategory.items || [subCategory.name];
                  const subCategoryObservations = report.observations.filter(o => 
                      o.subCategory === subCategory.name && 
                      visibleTopics.has(o.topic) && 
                      !temporarilyHiddenTopics.has(o.topic)
                  );
                  // if (subCategoryObservations.length === 0) return null; // <--- This line hides the subcategory entirely if it has no visible observations.

                  const hasSubCatDeficiency = subCategoryObservations.some(o => o.status === 'deficiency');
                  const hasSubCatRecommendation = subCategoryObservations.some(o => o.status === 'recommendation');
                  const isSubCatOk = !hasSubCatDeficiency && !hasSubCatRecommendation && subCategoryObservations.every(o => o.status === 'ok' || tempOkIds.has(o.id));
                  
                  return (
                    <SubCategoryAccordion 
                      key={subCategory.name} 
                      title={subCategory.name} 
                      hasDeficiency={hasSubCatDeficiency} 
                      hasRecommendation={!hasSubCatDeficiency && hasSubCatRecommendation}
                      isOk={isSubCatOk}
                      onHide={() => handleTemporarilyHideTopics(subCategoryTopics)}
                    >
                      {subCategoryObservations.length > 0 ? (
                        subCategoryObservations.map(obs => (
                          <ObservationItem
                            key={obs.id}
                            observation={obs}
                            onUpdate={handleObservationUpdate}
                            onAddCorrectionOrder={handleAddCorrectionOrder}
                            onAddRecommendation={handleAddRecommendation}
                            guidance={guidance[obs.topic]}
                            onShowGuidance={handleShowGuidance} // Pass the updated handler
                            isTemporarilyOk={tempOkIds.has(obs.id)}
                            onTempOkChange={handleTempOkChange}
                            onTemporarilyHide={handleTemporarilyHideTopic}
                            flatStandardCorrectionOrders={flatCorrectionOrders}
                            categorizedCorrectionOrders={categorizedCorrectionOrders}
                          />
                        ))
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">Tässä alakategoriassa ei ole tällä hetkellä näkyviä tarkistuskohteita valitun profiilin tai piilotettujen kohteiden vuoksi.</p>
                      )}
                    </SubCategoryAccordion>
                  );
                })
              ) : (
                // This message is for the main category if no subcategories are visible.
                <p className="text-slate-500 dark:text-slate-400 italic">Tässä kategoriassa ei ole tällä hetkellä näkyviä tarkistuskohteita valitun profiilin tai piilotettujen kohteiden vuoksi.</p>
              )}
            </Section>
          );
        })}
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md my-6 border-t-4 border-blue-500 overflow-hidden">
            <button
                onClick={() => setIsCorrectionsOpen(!isCorrectionsOpen)}
                className="w-full text-left p-4 flex justify-between items-center"
                aria-expanded={isCorrectionsOpen}
            >
                 <h2 className="text-2xl font-bold">4. Korjausmääräykset</h2>
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transform transition-transform text-slate-800 dark:text-slate-200 ${isCorrectionsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isCorrectionsOpen && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                    {observationBasedOrders.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300 uppercase mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                Tarkistuslistasta nousevat määräykset
                            </h3>
                            <ul className="space-y-2">
                                {observationBasedOrders.map((obs, idx) => (
                                    <li key={obs.id} className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">{idx + 1}. {obs.topic}:</span> {obs.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Muut korjausmääräykset</h3>
                    {renderList('correctionOrders', 'Määräys')}
                </div>
            )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md my-6 border-t-4 border-blue-500 overflow-hidden">
            <button
                onClick={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
                className="w-full text-left p-4 flex justify-between items-center"
                aria-expanded={isRecommendationsOpen}
            >
                 <h2 className="text-2xl font-bold">5. Suositukset</h2>
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transform transition-transform text-slate-800 dark:text-slate-200 ${isRecommendationsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isRecommendationsOpen && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  {observationBasedRecommendations.length > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 uppercase mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                Tarkistuslistasta nousevat suositukset
                            </h3>
                            <ul className="space-y-2">
                                {observationBasedRecommendations.map((obs, idx) => (
                                    <li key={obs.id} className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">{idx + 1}. {obs.topic}:</span> {obs.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Muut suositukset</h3>
                  {renderList('recommendations', 'Suositus')}
                </div>
            )}
        </div>
        
        <Section title="6. Kuuleminen">
            <TextareaField label="Kohteen edustajan selvitys mahdollisista puutteista ja niiden korjaamisesta" id="hearing" name="hearing" value={report.hearing} onChange={handleReportChange} rows={4} />
            <div className="flex items-center gap-2 mt-2">
                <button onClick={() => openStandardTextModal('hearing', 'Valitse vakioteksti: Kuuleminen')} className="px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600">Lisää vakioteksti</button>
                <button 
                    onClick={() => handleQuickAddStandardText('hearing')}
                    disabled={!allStandardTexts['std-text-hearing']?.[0]}
                    className="p-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Lisää oletusteksti"
                    aria-label="Lisää oletusteksti kuulemiseen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </Section>
        
        <Section title="7. Liitteet">
            <TextareaField label="Raportin liitteet" id="appendices" name="appendices" value={report.appendices} onChange={handleReportChange} rows={2} />
            <div className="flex items-center gap-2 mt-2">
                <button onClick={() => openStandardTextModal('appendices', 'Valitse vakioteksti: Liitteet')} className="px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600">Lisää vakioteksti</button>
                <button 
                    onClick={() => handleQuickAddStandardText('appendices')}
                    disabled={!allStandardTexts['std-text-appendices']?.[0]}
                    className="p-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Lisää oletusteksti"
                    aria-label="Lisää oletusteksti liitteisiin"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </Section>
      </main>
      
      <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Suunnittelija: Juha Raitolampi</p>
      </footer>

      {isChecklistMgmtOpen && <ChecklistManagementModal isOpen={isChecklistMgmtOpen} onClose={() => setIsChecklistMgmtOpen(false)} profiles={checklistProfiles} activeProfile={activeProfile} checklist={checklist} onSave={handleSaveChecklistAndProfiles} />}
      {isReportMgmtOpen && <ReportManagementModal isOpen={isReportMgmtOpen} onClose={() => setIsReportMgmtOpen(false)} reports={savedReports} onLoad={handleLoadReport} onDelete={handleDeleteReport} />}
      {isShareModalOpen && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={shareUrl} />}
      {standardTextModal.isOpen && (
          <StandardTextModal 
            {...standardTextModal} 
            texts={allStandardTexts[standardTextModal.storageKey] || []}
            onSave={(newTexts) => handleSaveStandardTexts(standardTextModal.storageKey, newTexts)}
            onClose={() => setStandardTextModal(prev => ({...prev, isOpen: false}))} 
          />
      )}
      {isCategorizedManagerOpen && <CategorizedStandardTextManagerModal 
        isOpen={isCategorizedManagerOpen} 
        onClose={() => setIsCategorizedManagerOpen(false)} 
        initialCategories={categorizedCorrectionOrders}
        onSave={handleSaveCategorizedCorrectionOrders}
      />}
      {infoModal.isOpen && <InfoDisplayModal {...infoModal} onClose={() => setInfoModal(prev => ({...prev, isOpen: false}))} />}
      <GuidanceModal
          isOpen={guidanceModal.isOpen}
          onClose={() => setGuidanceModal({ isOpen: false, topic: '' })}
          title={guidanceModal.topic}
          content={guidance[guidanceModal.topic] || 'Ohjetta ei löytynyt.'}
          onSave={handleSaveGuidance}
          initialEditMode={guidanceModal.initialEditMode} // Pass initialEditMode
      />
      <UserGuideModal isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />
    </>
  );
};

export default App;
