
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsView from './components/ResultsView';
import { fetchBusinessData } from './services/geminiService';
import { BusinessResult, AppStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<BusinessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string, useLocation: boolean) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    let locationData;

    if (useLocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (err) {
        console.warn("Geolocation failed or denied, continuing without it.", err);
      }
    }

    try {
      const data = await fetchBusinessData(query, locationData);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please check your API key and try again.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find leads with <span className="text-indigo-600">Precision.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our AI-powered tool connects directly to Google Maps to extract business names, phone numbers, and addresses for your next outreach campaign.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={status === AppStatus.LOADING} />

        {status === AppStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center space-x-4 mb-8">
            <div className="bg-red-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div>
              <p className="font-bold text-red-800">Something went wrong</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <ResultsView result={result} />

        {status === AppStatus.IDLE && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center opacity-60">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h4 className="font-bold text-slate-800">Phone Numbers</h4>
              <p className="text-sm text-slate-500">Extract direct business lines accurately.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h4 className="font-bold text-slate-800">Physical Address</h4>
              <p className="text-sm text-slate-500">Get verified locations from Google Maps.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h4 className="font-bold text-slate-800">Website & Social</h4>
              <p className="text-sm text-slate-500">Direct links to business sites and profiles.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="glass px-6 py-3 rounded-full shadow-2xl flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest border-slate-200">
            <span>Powered by Gemini 2.5</span>
            <div className="flex space-x-4">
              <span className="text-emerald-500 flex items-center"><div className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></div> System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
