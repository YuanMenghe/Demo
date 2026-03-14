import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import { useTranslation } from 'react-i18next';
import { getMockDoctors, getMockSummarySegments } from '@/data/mock';
import type { Locale } from '@/data/mock';
import { Sparkles, Download, Share2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

function getLocaleFromLanguage(lang: string): Locale {
  return lang.startsWith('zh') ? 'zh' : 'en';
}

export default function HCPInsights() {
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);
  const doctors = getMockDoctors(locale);
  const summarySegments = getMockSummarySegments(locale);

  const [selectedDoctorId, setSelectedDoctorId] = useState('1');
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const displayName = selectedDoctor.name.split(/\s|,/)[0] || selectedDoctor.name;

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowSummary(false);
    setActiveEvidenceId(null);
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
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedDoctor.name}</h1>
                  <div className="text-sm text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">{selectedDoctor.org}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{t('hcp.partyId')}: <span className="font-mono text-slate-700">{selectedDoctor.partyId}</span></span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span>{t('hcp.npi')}: <span className="font-mono text-slate-700">{selectedDoctor.npi}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-2 text-slate-400 hover:text-medical-teal-600 hover:bg-medical-teal-50 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-medical-teal-600 hover:bg-medical-teal-50 rounded-full transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sparkles className="w-4 h-4 text-medical-teal-600" />
                  <span>{t('hcp.aiSummary')}</span>
                </div>
                {showSummary && (
                  <span className="text-xs text-slate-400">{t('hcp.generatedJustNow')}</span>
                )}
              </div>

              <div className="p-6 flex-1">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-medical-teal-200 border-t-medical-teal-600 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm animate-pulse">{t('hcp.analyzing')}</p>
                  </div>
                ) : !showSummary ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-medical-teal-50 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-medical-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('hcp.readyTitle')}</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      {t('hcp.readyDesc', { name: displayName })}
                    </p>
                    <div className="grid gap-3 w-full">
                      <SuggestionButton
                        onClick={handleGenerate}
                        text={t('hcp.suggestion1', { name: displayName })}
                      />
                      <SuggestionButton
                        onClick={handleGenerate}
                        text={t('hcp.suggestion2')}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="space-y-4 leading-relaxed text-slate-800">
                      <p>
                        {summarySegments.map((segment, index) => (
                          <span
                            key={index}
                            onClick={() => setActiveEvidenceId(segment.evidenceId)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setActiveEvidenceId(segment.evidenceId)}
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
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">{t('hcp.explanation')}</h4>
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        <InfoIcon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <p>{t('hcp.explanationText')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    disabled={isGenerating}
                    placeholder={t('hcp.askFollowUp')}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={isGenerating}
                    className="absolute right-2 top-2 p-1.5 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {showSummary && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <SuggestionChip text={t('hcp.chip1')} />
                    <SuggestionChip text={t('hcp.chip2')} />
                    <SuggestionChip text={t('hcp.chip3')} />
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
      type="button"
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
    <button type="button" className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-medical-teal-200 hover:text-medical-teal-700 hover:bg-medical-teal-50 transition-colors">
      {text}
    </button>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
