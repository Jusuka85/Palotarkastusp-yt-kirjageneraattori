
import React, { useState } from 'react';
import { FireInspectionReport } from '../types';

interface StatementViewProps {
  report: FireInspectionReport;
  onBack: () => void;
}

const StatementView: React.FC<StatementViewProps> = ({ report, onBack }) => {
    
    const [copySuccess, setCopySuccess] = useState('');
    const [copyParticipantsSuccess, setCopyParticipantsSuccess] = useState('');
    // Use all observations to determine index, but filtering is needed for the list content
    const allObservations = report.observations;
    const allMarkedObservations = report.observations.filter(o => o.status === 'ok' || o.status === 'deficiency' || o.status === 'recommendation');

    const formatDate = (dateString: string) => {
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return '';
        }
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };
    
    const formattedDate = formatDate(report.inspectionDate);

    const generatePlainTextContent = () => {
        let content = `Kohteessa suoritettiin ${formattedDate} Satakunnan pelastuslaitoksen valvontasuunnitelman mukainen määräaikainen palotarkastus.\n\n`;
        content += `KOHTEEN TIEDOT\n`;
        content += `Tarkastuskohde: ${report.target || 'Ei määritetty'}\n`;
        content += `Osoite: ${report.address || 'Ei määritetty'}\n`;
        if (report.businessId) {
            content += `Y-tunnus: ${report.businessId}\n`;
        }
        if (report.description) {
            content += `\n${report.description}\n`;
        }
        content += `\n`;
        content += `TARKASTUKSEN KULKU\n`;
        content += `${report.inspectionProcess || 'Ei kuvailtu'}\n\n`;
        content += `TARKASTUKSESSA TEHDYT HAVAINNOT\n`;
        
        if (allMarkedObservations.length > 0) {
            allMarkedObservations.forEach((obs) => {
                // Find original index from full list to maintain consistent numbering if needed, 
                // OR just use current index in filtered list. 
                // The prompt asks for "same sequence number". Usually this means 1, 2, 3 in the observation list.
                const index = allMarkedObservations.indexOf(obs); 
                
                let displayTopic = obs.topic;
                if (obs.subCategory && obs.subCategory !== obs.topic) {
                    displayTopic = `${obs.subCategory} – ${obs.topic}`;
                }

                if (obs.status === 'deficiency' || obs.status === 'recommendation') {
                    content += `${index + 1}. ${displayTopic}: ${obs.description || '(Ei kuvausta)'}\n`;
                } else {
                    content += `${index + 1}. ${obs.description || `${displayTopic} kunnossa`}\n`;
                }
            });
        } else {
            content += `Tarkastuksessa ei tehty pöytäkirjaan merkittäviä havaintoja.\n`;
        }
        content += `\n`;

        content += `TARKASTUKSEN JOHTOPÄÄTÖKSET, JOHTOPÄÄTÖKSIEN PERUSTELUT, KORJAUSMÄÄRÄYKSET JA SUOSITUKSET\n\n`;

        content += `Annetut korjausmääräykset\n`;
        
        // 1. Collect orders tied to observations
        let hasOrders = false;
        let orderCounter = 1;
        allMarkedObservations.forEach((obs) => {
            if (obs.status === 'deficiency') {
                const orderText = obs.correctionAction || obs.description; // Fallback to description if action not empty
                if (orderText && orderText.trim() !== '') {
                     content += `${orderCounter}. ${orderText}\n`;
                     orderCounter++;
                     hasOrders = true;
                }
            }
        });

        // 2. Append general orders (legacy/manual list)
        if (report.correctionOrders?.length > 0 && report.correctionOrders.some(o => o.trim() !== '')) {
            report.correctionOrders.forEach((order) => {
                const trimmedOrder = order.trim();
                if(trimmedOrder !== '') {
                    content += `${orderCounter}. ${trimmedOrder}\n`;
                    orderCounter++;
                    hasOrders = true;
                }
            });
        }
        
        if (!hasOrders) {
             content += `Ei annettuja korjausmääräyksiä.\n`;
        }

        content += `\n`;

        content += `Annetut suositukset\n`;
        let hasRecommendations = false;
        let recCounter = 1;
        allMarkedObservations.forEach((obs) => {
             if (obs.status === 'recommendation') {
                const recText = obs.recommendationAction || obs.description;
                if (recText && recText.trim() !== '') {
                     content += `${recCounter}. ${recText}\n`;
                     recCounter++;
                     hasRecommendations = true;
                }
            }
        });

        if (report.recommendations?.length > 0 && report.recommendations.some(r => r.trim() !== '')) {
             report.recommendations.forEach((rec) => {
                const trimmedRec = rec.trim();
                if(trimmedRec !== '') {
                    content += `${recCounter}. ${trimmedRec}\n`;
                    recCounter++;
                    hasRecommendations = true;
                }
            });
        }
        
        if (!hasRecommendations) {
            content += `Ei annettuja suosituksia.\n`;
        }
        content += `\n`;

        content += `KOHTEEN EDUSTAJAN SELVITYS\n`;
        content += `${report.hearing || 'Ei kuulemistietoja.'}\n\n`;

        content += `LIITTEET\n`;
        content += `${report.appendices || 'Ei liitteitä.'}\n\n`;

        content += `TARKASTUKSEN OSAPUOLET\n\n`;

        const inspectors = report.inspector.filter(name => name && name.trim() !== '');
        content += `Tarkastajat:\n`;
        if (inspectors.length > 0) {
            inspectors.forEach(name => {
                content += `- ${name}\n`;
            });
        } else {
            content += `Ei ilmoitettu.\n`;
        }
        content += `\n`;
        
        const representatives = report.representative.filter(name => name && name.trim() !== '');
        content += `Kohteen edustajat:\n`;
        if (representatives.length > 0) {
            representatives.forEach(name => {
                content += `- ${name}\n`;
            });
        } else {
            content += `Ei ilmoitettu.\n`;
        }


        return content;
    }

    const handleCopyText = () => {
        const content = generatePlainTextContent();
        navigator.clipboard.writeText(content).then(() => {
            setCopySuccess('Teksti kopioitu!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error("Could not copy text: ", err);
            setCopySuccess('Kopiointi epäonnistui.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    const handleCopyParticipants = () => {
        const inspectors = report.inspector.filter(name => name && name.trim() !== '');
        const representatives = report.representative.filter(name => name && name.trim() !== '');
        const participantsList = [...inspectors, ...representatives].join('\n');

        if (participantsList) {
            navigator.clipboard.writeText(participantsList).then(() => {
                setCopyParticipantsSuccess('Osallistujat kopioitu!');
                setTimeout(() => setCopyParticipantsSuccess(''), 2000);
            }, (err) => {
                console.error("Could not copy participants: ", err);
                setCopyParticipantsSuccess('Kopiointi epäonnistui.');
                setTimeout(() => setCopyParticipantsSuccess(''), 2000);
            });
        } else {
            setCopyParticipantsSuccess('Ei osallistujia kopioitavaksi.');
            setTimeout(() => setCopyParticipantsSuccess(''), 2000);
        }
    };

    const handleEmail = () => {
        const subject = `Palotarkastuspöytäkirjan lausunto: ${report.target || 'Nimetön kohde'}`;
        const body = generatePlainTextContent();
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };
    
    // Check if there are any orders or recommendations to display titles
    const hasSpecificOrders = allMarkedObservations.some(o => o.status === 'deficiency' && (o.correctionAction || o.description));
    const hasGeneralOrders = report.correctionOrders?.some(o => o.trim() !== '');
    const hasAnyOrders = hasSpecificOrders || hasGeneralOrders;

    const hasSpecificRecs = allMarkedObservations.some(o => o.status === 'recommendation' && (o.recommendationAction || o.description));
    const hasGeneralRecs = report.recommendations?.some(r => r.trim() !== '');
    const hasAnyRecs = hasSpecificRecs || hasGeneralRecs;


    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h2 className="text-2xl font-bold">Lausunto</h2>
                <div className="flex items-center gap-4 flex-wrap">
                    {copySuccess && <span className="text-sm text-green-600 dark:text-green-400">{copySuccess}</span>}
                    {copyParticipantsSuccess && <span className="text-sm text-green-600 dark:text-green-400">{copyParticipantsSuccess}</span>}
                    <button onClick={onBack} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75">
                        Takaisin
                    </button>
                     <button onClick={handleCopyParticipants} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Kopioi osallistujat
                    </button>
                    <button onClick={handleEmail} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Lähetä sähköpostitse
                    </button>
                    <button onClick={handleCopyText} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
                        Kopioi teksti
                    </button>
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>Kohteessa suoritettiin {formattedDate}{' '}Satakunnan pelastuslaitoksen valvontasuunnitelman mukainen määräaikainen palotarkastus.</p>

                <h3 className="font-bold mt-6">Kohteen tiedot</h3>
                <p>Tarkastuskohde: {report.target || 'Ei määritetty'}</p>
                <p>Osoite: {report.address || 'Ei määritetty'}</p>
                {report.businessId && <p>Y-tunnus: {report.businessId}</p>}
                {report.description && <p className="whitespace-pre-wrap">{report.description}</p>}


                <h3 className="font-bold mt-6">Tarkastuksen kulku</h3>
                <p className="whitespace-pre-wrap">{report.inspectionProcess || 'Ei kuvailtu'}</p>
                
                <h3 className="font-bold mt-6">Tarkastuksessa tehdyt havainnot</h3>
                
                {allMarkedObservations.length > 0 ? (
                    <ol style={{ listStyleType: 'decimal' }} className="pl-5">
                        {allMarkedObservations.map((obs) => {
                            // Using the index from the filtered list to keep numbers contiguous
                            // This corresponds to "1, 2, 3..." in the generated statement
                            let displayTopic = obs.topic;
                            if (obs.subCategory && obs.subCategory !== obs.topic) {
                                displayTopic = `${obs.subCategory} – ${obs.topic}`;
                            }
                            return (
                                <li key={obs.id} className="mb-1 pl-2">
                                    {obs.status === 'deficiency' || obs.status === 'recommendation' ? (
                                        <><strong>{displayTopic}:</strong> {obs.description || '(Ei kuvausta)'}</>
                                    ) : (
                                        <span>{obs.description || `${displayTopic} kunnossa`}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                ) : (
                    <p>Tarkastuksessa ei tehty pöytäkirjaan merkittäviä havaintoja.</p>
                )}

                <h3 className="font-bold mt-6 uppercase">Tarkastuksen johtopäätökset, johtopäätöksien perustelut, korjausmääräykset ja suositukset</h3>

                <h4 className="font-bold mt-4">Annetut korjausmääräykset</h4>
                {hasAnyOrders ? (
                    <ol className="list-decimal pl-5">
                         {/* Specific Orders with Independent Numbers */}
                         {allMarkedObservations.map((obs) => {
                             if (obs.status === 'deficiency') {
                                const orderText = obs.correctionAction || obs.description;
                                if (orderText && orderText.trim() !== '') {
                                    return <li key={obs.id} className="mb-1">{orderText}</li>;
                                }
                             }
                             return null;
                         })}
                         
                         {/* General Orders with Independent Numbers */}
                         {report.correctionOrders.map((order, index) => (
                             order.trim() !== '' && <li key={`gen-order-${index}`} className="mb-1">{order}</li>
                         ))}
                    </ol>
                ) : (
                    <p>Ei annettuja korjausmääräyksiä.</p>
                )}

                <h4 className="font-bold mt-4">Annetut suositukset</h4>
                {hasAnyRecs ? (
                    <ol className="list-decimal pl-5">
                        {/* Specific Recommendations with Independent Numbers */}
                         {allMarkedObservations.map((obs) => {
                             if (obs.status === 'recommendation') {
                                const recText = obs.recommendationAction || obs.description;
                                if (recText && recText.trim() !== '') {
                                    return <li key={obs.id} className="mb-1">{recText}</li>;
                                }
                             }
                             return null;
                         })}

                        {/* General Recommendations with Independent Numbers */}
                        {report.recommendations.map((rec, index) => (
                            rec.trim() !== '' && <li key={`gen-rec-${index}`} className="mb-1">{rec}</li>
                        ))}
                    </ol>
                ) : (
                    <p>Ei annettuja suosituksia.</p>
                )}


                <h3 className="font-bold mt-6">Kohteen edustajan selvitys</h3>
                <p className="whitespace-pre-wrap">{report.hearing || 'Ei kuulemistietoja.'}</p>

                <h3 className="font-bold mt-6">Liitteet</h3>
                <p className="whitespace-pre-wrap">{report.appendices || 'Ei liitteitä.'}</p>

                <h3 className="font-bold mt-6">Tarkastuksen osapuolet</h3>
                
                <h4 className="font-bold mt-2">Tarkastajat</h4>
                <ul className="list-disc pl-5">
                    {report.inspector.filter(i => i.trim()).length > 0 ? (
                        report.inspector.filter(i => i.trim()).map((name, i) => (
                            <li key={i}>{name}</li>
                        ))
                    ) : (
                        <li>Ei ilmoitettu</li>
                    )}
                </ul>

                <h4 className="font-bold mt-2">Kohteen edustajat</h4>
                <ul className="list-disc pl-5">
                     {report.representative.filter(r => r.trim()).length > 0 ? (
                        report.representative.filter(r => r.trim()).map((name, i) => (
                            <li key={i}>{name}</li>
                        ))
                    ) : (
                        <li>Ei ilmoitettu</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default StatementView;
