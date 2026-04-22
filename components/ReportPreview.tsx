
import React from 'react';
import { FireInspectionReport } from '../types';

interface ReportPreviewProps {
  report: FireInspectionReport;
  onBack: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, onBack }) => {

    const allMarkedObservations = report.observations.filter(o => o.status === 'ok' || o.status === 'deficiency' || o.status === 'recommendation');

    const formatListToString = (list: string[] | string | undefined): string => {
        if (!list) return 'Ei määritetty';
        if (Array.isArray(list)) {
            const filteredList = list.filter(item => item && item.trim() !== '');
            return filteredList.length > 0 ? filteredList.join(', ') : 'Ei määritetty';
        }
        return list || 'Ei määritetty';
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
                <h2 className="text-2xl font-bold">Raportin esikatselu</h2>
                <div className="flex gap-4">
                    <button onClick={onBack} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75">
                        Takaisin muokkaamaan
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75">
                        Tulosta PDF
                    </button>
                </div>
            </div>
            
            <header className="text-center border-b-2 border-slate-800 dark:border-slate-300 pb-4 mb-8">
                <h1 className="text-4xl font-bold">Palotarkastuspöytäkirja</h1>
            </header>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">1. Perustiedot</h2>
                <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-2">
                    <strong>Tarkastuskohde:</strong><span>{report.target || 'Ei määritetty'}</span>
                    <strong>Osoite:</strong><span>{report.address || 'Ei määritetty'}</span>
                    <strong>Kohteen kuvaus:</strong><span className="whitespace-pre-wrap">{report.description || 'Ei määritetty'}</span>
                    <strong>Tarkastuspäivämäärä:</strong><span>{report.inspectionDate || 'Ei määritetty'}</span>
                    <strong>Tarkastaja(t):</strong><span>{formatListToString(report.inspector)}</span>
                    <strong>Kohteen edustaja(t):</strong><span>{formatListToString(report.representative)}</span>
                </div>
            </section>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">2. Havainnot</h2>
                
                {allMarkedObservations.length > 0 ? (
                    <ol className="list-decimal list-outside space-y-2 ml-4">
                        {allMarkedObservations.map((obs) => {
                             let displayTopic = obs.topic;
                             if (obs.subCategory && obs.subCategory !== obs.topic) {
                                 displayTopic = `${obs.subCategory} – ${obs.topic}`;
                             }
                             return (
                                <li key={obs.id}>
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
                    <p>Ei pöytäkirjaan merkittyjä havaintoja.</p>
                )}
            </section>

            <section className="mb-8 break-after-page">
                <h2 className="text-2xl font-semibold border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">3. Tarkastuksen johtopäätökset, korjausmääräykset ja suositukset</h2>

                <div className="mb-4 break-inside-avoid">
                    <h3 className="text-lg font-bold mb-2">Korjausmääräykset</h3>
                    {hasAnyOrders ? (
                        <ol className="list-decimal list-outside space-y-1 ml-4">
                             {/* Specific Orders with Independent Numbers */}
                             {allMarkedObservations.map((obs) => {
                                 if (obs.status === 'deficiency') {
                                    const orderText = obs.correctionAction || obs.description;
                                    if (orderText && orderText.trim() !== '') {
                                        return <li key={obs.id}>{orderText}</li>;
                                    }
                                 }
                                 return null;
                             })}
                             
                             {/* General Orders with Independent Numbers */}
                             {report.correctionOrders.map((order, index) => (
                                 order.trim() !== '' && <li key={`gen-order-${index}`}>{order}</li>
                             ))}
                        </ol>
                    ) : (
                        <p>Ei korjausmääräyksiä.</p>
                    )}
                </div>

                <div className="break-inside-avoid">
                    <h3 className="text-lg font-bold mb-2">Suositukset</h3>
                    {hasAnyRecs ? (
                        <ol className="list-decimal list-outside space-y-1 ml-4">
                            {/* Specific Recommendations with Independent Numbers */}
                             {allMarkedObservations.map((obs) => {
                                 if (obs.status === 'recommendation') {
                                    const recText = obs.recommendationAction || obs.description;
                                    if (recText && recText.trim() !== '') {
                                        return <li key={obs.id}>{recText}</li>;
                                    }
                                 }
                                 return null;
                             })}

                            {/* General Recommendations with Independent Numbers */}
                            {report.recommendations.map((rec, index) => (
                                rec.trim() !== '' && <li key={`gen-rec-${index}`}>{rec}</li>
                            ))}
                        </ol>
                    ) : (
                        <p>Ei suosituksia.</p>
                    )}
                </div>
            </section>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">4. Kohteen edustajan selvitys</h2>
                <p className="whitespace-pre-wrap">{report.hearing || 'Ei kuulemistietoja.'}</p>
            </section>

             <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">5. Liitteet</h2>
                <p className="whitespace-pre-wrap">{report.appendices || 'Ei liitteitä.'}</p>
            </section>
        </div>
    );
};

export default ReportPreview;
