import React from 'react';
import { FireInspectionReport } from '../types';

interface ReportManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    reports: FireInspectionReport[];
    onLoad: (reportId: string) => void;
    onDelete: (reportId: string) => void;
}

const ReportManagementModal: React.FC<ReportManagementModalProps> = ({ isOpen, onClose, reports, onLoad, onDelete }) => {
    if (!isOpen) return null;

    const sortedReports = [...reports].sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Hallitse raportteja</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-4">
                    {sortedReports.length > 0 ? (
                        <ul className="space-y-3">
                            {sortedReports.map(report => (
                                <li key={report.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-200 dark:border-slate-700">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{report.target || 'Nimetön raportti'}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Päivämäärä: {report.inspectionDate}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onLoad(report.id)} className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Lataa</button>
                                        <button onClick={() => onDelete(report.id)} className="p-2 text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="http://www.w3.org/2000/svg" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">Ei tallennettuja raportteja.</p>
                    )}
                </main>
                 <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Sulje</button>
                </footer>
            </div>
        </div>
    );
};

export default ReportManagementModal;
