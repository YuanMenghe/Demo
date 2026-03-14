import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import { ArrowLeft, FileText, BarChart2, MessageSquare, AlertCircle, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function RecommendationExpand() {
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('exec');

  const sections = [
    { id: 'exec', label: 'Executive Summary', icon: FileText },
    { id: 'data', label: 'Key Data', icon: BarChart2 },
    { id: 'talking', label: 'Talking Points', icon: MessageSquare },
    { id: 'limits', label: 'Limitations', icon: AlertCircle },
    { id: 'qa', label: 'Q&A Prep', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 items-start">
        {/* Left Navigation / TOC */}
        <div className="w-64 border-r border-slate-200 bg-white h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col pt-6">
          <div className="px-6 mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h2 className="font-semibold text-slate-900">Analysis Sections</h2>
          </div>
          <nav className="space-y-1 px-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-medical-teal-50 text-medical-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-4 h-4", activeSection === section.id ? "text-medical-teal-600" : "text-slate-400")} />
                  {section.label}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-medical-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">New Publication</span>
                    <span className="text-slate-400 text-sm">•</span>
                    <span className="text-slate-500 text-sm">ASCO 2025</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mb-2">
                    Phase 3 STELLAR Trial: Sotatercept for the Treatment of Pulmonary Arterial Hypertension
                  </h1>
                  <p className="text-slate-600 text-sm">
                    Dr. Kelly Chin presented new subgroup analysis data demonstrating consistent efficacy across all demographic groups.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
              <div className="p-8 prose prose-slate max-w-none">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100 mb-6">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                
                <div className="space-y-6 text-slate-800 leading-relaxed">
                  <p>
                    <span 
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-1' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-1')}
                    >
                      The primary endpoint was met with high statistical significance (P{'<'}0.001), showing a 40.8m improvement in 6MWD.
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[1]</sup>
                    </span>
                  </p>
                  
                  <p>
                    <span 
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-2' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-2')}
                    >
                      Adverse events were generally mild to moderate, with telangiectasia being the most common adverse event reported in the treatment group.
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[2]</sup>
                    </span>
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 my-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Takeaway</h4>
                    <p className="text-sm text-slate-600">
                      This data supports the use of sotatercept as an add-on therapy for patients already on background therapy, regardless of their initial risk status.
                    </p>
                  </div>

                  <p>
                     <span 
                      className={cn("cursor-pointer hover:bg-medical-teal-50 rounded px-1 transition-colors", activeEvidenceId === 'ev-4' && "bg-yellow-100 ring-2 ring-yellow-200")}
                      onClick={() => setActiveEvidenceId('ev-4')}
                    >
                      Long-term extension data suggests sustained clinical benefit up to 24 months.
                      <sup className="text-medical-teal-600 font-semibold ml-0.5">[3]</sup>
                    </span>
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex gap-3">
                <button className="flex-1 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-medical-teal-300 transition-all shadow-sm flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-medical-teal-600" />
                  Generate 3-min Oral Brief
                </button>
                <button className="flex-1 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-medical-teal-300 transition-all shadow-sm flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-medical-teal-600" />
                  Generate 1-page Summary
                </button>
              </div>
            </div>
          </div>
        </main>

        <EvidencePanel evidenceId={activeEvidenceId} onClose={() => setActiveEvidenceId(null)} />
      </div>
    </div>
  );
}
