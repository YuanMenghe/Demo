import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import { MOCK_DOCTORS, MOCK_SUMMARY_SEGMENTS } from '@/data/mock';
import { Sparkles, Download, Share2, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function HCPInsights() {
  const [selectedDoctorId, setSelectedDoctorId] = useState('1');
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === selectedDoctorId) || MOCK_DOCTORS[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowSummary(false);
    setActiveEvidenceId(null);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 items-start">
        <Sidebar selectedDoctorId={selectedDoctorId} onSelectDoctor={setSelectedDoctorId} />
        
        <main className="flex-1 min-w-0 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Doctor Header */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedDoctor.name}</h1>
                  <div className="text-sm text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">{selectedDoctor.org}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Party ID: <span className="font-mono text-slate-700">{selectedDoctor.partyId}</span></span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span>NPI: <span className="font-mono text-slate-700">{selectedDoctor.npi}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-medical-teal-600 hover:bg-medical-teal-50 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-medical-teal-600 hover:bg-medical-teal-50 rounded-full transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sparkles className="w-4 h-4 text-medical-teal-600" />
                  <span>AI Summary</span>
                </div>
                {showSummary && (
                   <span className="text-xs text-slate-400">Generated just now</span>
                )}
              </div>

              <div className="p-6 flex-1">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-medical-teal-200 border-t-medical-teal-600 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm animate-pulse">Analyzing recent publications and CRM data...</p>
                  </div>
                ) : !showSummary ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-medical-teal-50 rounded-full flex items-center justify-center mb-4">
                      <BotIcon className="w-8 h-8 text-medical-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to generate insights</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      I can analyze Dr. {selectedDoctor.name.split(',')[0]}'s recent activities, publications, and trial data to prepare you for your upcoming meeting.
                    </p>
                    <div className="grid gap-3 w-full">
                      <SuggestionButton 
                        onClick={handleGenerate}
                        text={`Please provide a summary of what has changed in Dr. ${selectedDoctor.name.split(',')[0]}'s profile in the past 3 months.`}
                      />
                      <SuggestionButton 
                        onClick={handleGenerate}
                        text="It's my first meeting, please provide a scientific expert summary."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="space-y-4 leading-relaxed text-slate-800">
                      <p>
                        {MOCK_SUMMARY_SEGMENTS.map((segment, index) => (
                          <span
                            key={index}
                            onClick={() => setActiveEvidenceId(segment.evidenceId)}
                            className={cn(
                              "cursor-pointer transition-colors rounded px-0.5 mx-[-2px] hover:bg-medical-teal-50",
                              activeEvidenceId === segment.evidenceId ? "bg-yellow-100 ring-2 ring-yellow-200 hover:bg-yellow-100" : ""
                            )}
                          >
                            {segment.text}
                            <sup className="text-medical-teal-600 font-semibold ml-0.5 cursor-pointer hover:underline">
                              [{index + 1}]
                            </sup>
                            {' '}
                          </span>
                        ))}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Explanation</h4>
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        <InfoIcon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <p>
                          Response is powered by AI. It identifies and summarizes any changes in the scientific expert's profile over the last 3 months, such as new publications, clinical trials, medical interactions or medical events, to inform the user of recent updates before their meeting.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    disabled={isGenerating}
                    placeholder="Ask a follow-up question..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all disabled:opacity-50"
                  />
                  <button 
                    disabled={isGenerating}
                    className="absolute right-2 top-2 p-1.5 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {showSummary && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <SuggestionChip text="What publications in the last 6 months?" />
                    <SuggestionChip text="Draft an email based on this summary" />
                    <SuggestionChip text="Show recent clinical trials" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <EvidencePanel evidenceId={activeEvidenceId} onClose={() => setActiveEvidenceId(null)} />
      </div>
    </div>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-medical-teal-100 bg-medical-teal-50/50 hover:bg-medical-teal-50 hover:border-medical-teal-200 text-medical-teal-800 text-sm font-medium transition-all flex items-center justify-between group"
    >
      <span>{text}</span>
      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-medical-teal-600" />
    </button>
  );
}

function SuggestionChip({ text }: { text: string }) {
  return (
    <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-medical-teal-200 hover:text-medical-teal-700 hover:bg-medical-teal-50 transition-colors">
      {text}
    </button>
  );
}

function BotIcon({ className }: { className?: string }) {
  return <Sparkles className={className} />;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
