import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import { ArrowLeft, FileText, BarChart2, MessageSquare, AlertCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function RecommendationExpand() {
  const { t } = useTranslation();
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('exec');

  const sections = [
    { id: 'exec', labelKey: 'recommendation.execSummary' as const, icon: FileText },
    { id: 'data', labelKey: 'recommendation.keyData' as const, icon: BarChart2 },
    { id: 'talking', labelKey: 'recommendation.talkingPoints' as const, icon: MessageSquare },
    { id: 'limits', labelKey: 'recommendation.limitations' as const, icon: AlertCircle },
    { id: 'qa', labelKey: 'recommendation.qaPrep' as const, icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1 items-start">
        <div className="w-64 border-r border-slate-200 bg-white h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col pt-6">
          <div className="px-6 mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('recommendation.backToDashboard')}
            </Link>
            <h2 className="font-semibold text-slate-900">{t('recommendation.analysisSections')}</h2>
          </div>
          <nav className="space-y-1 px-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-medical-teal-50 text-medical-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-4 h-4", activeSection === section.id ? "text-medical-teal-600" : "text-slate-400")} />
                  {t(section.labelKey)}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-medical-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 min-w-0 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{t('recommendation.newPublication')}</span>
                    <span className="text-slate-400 text-sm">•</span>
                    <span className="text-slate-500 text-sm">ASCO 2025</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mb-2">
                    {t('recommendation.recommendationTitle')}
                  </h1>
                  <p className="text-slate-600 text-sm">
                    {t('recommendation.recommendationSubtitle')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
              <div className="p-8 prose prose-slate max-w-none">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100 mb-6">
                  {t(sections.find(s => s.id === activeSection)?.labelKey ?? 'recommendation.execSummary')}
                </h3>

                <div className="space-y-6 text-slate-800 leading-relaxed">
                  <p>
                    <span
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-1' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-1')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveEvidenceId('ev-1')}
                    >
                      {t('recommendation.paragraph1')}
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[1]</sup>
                    </span>
                  </p>

                  <p>
                    <span
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-2' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-2')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveEvidenceId('ev-2')}
                    >
                      {t('recommendation.paragraph2')}
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[2]</sup>
                    </span>
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 my-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">{t('recommendation.keyTakeaway')}</h4>
                    <p className="text-sm text-slate-600">
                      {t('recommendation.keyTakeawayText')}
                    </p>
                  </div>

                  <p>
                    <span
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-4' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-4')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveEvidenceId('ev-4')}
                    >
                      {t('recommendation.paragraph3')}
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[3]</sup>
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex gap-3">
                <button type="button" className="flex-1 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-medical-teal-300 transition-all shadow-sm flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-medical-teal-600" />
                  {t('recommendation.generateOralBrief')}
                </button>
                <button type="button" className="flex-1 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-medical-teal-300 transition-all shadow-sm flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-medical-teal-600" />
                  {t('recommendation.generateSummary')}
                </button>
              </div>
            </div>
          </div>
        </main>

        <EvidencePanel
          evidenceId={activeEvidenceId}
          referenceIds={['ev-1', 'ev-2', 'ev-4']}
          onClose={() => setActiveEvidenceId(null)}
          onSelectEvidence={setActiveEvidenceId}
        />
      </div>
    </div>
  );
}
