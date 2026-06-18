import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Activity, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  AlertCircle,
  CheckCircle2,
  Filter,
  Users,
  Shield,
  Ban,
  Sparkles,
  Stethoscope,
  Presentation,
  GitCompare,
  Download,
  Layers,
  Send
} from 'lucide-react';
import { CDSSResponse, Citation } from '../types';
import { cn } from '../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';

// Helper to render inline content (bold, citations)
const renderInlineContent = (
  text: string, 
  citations: Citation[] | undefined, 
  onClick: (c: Citation) => void, 
  onHover: ((id: string | null) => void) | undefined
) => {
  // Split by citation markers like [1]
  const parts = text.split(/(\[\d+\])/g);
  
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const index = parseInt(match[1]);
      const citation = citations?.find(c => c.index === index);
      
      if (citation) {
        return (
          <sup 
            key={i}
            className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded cursor-pointer hover:bg-indigo-100 hover:scale-110 transition-all ml-0.5 align-top"
            onClick={(e) => {
              e.stopPropagation();
              onClick(citation);
            }}
            onMouseEnter={() => onHover?.(citation.id)}
            onMouseLeave={() => onHover?.(null)}
            title={citation.title}
          >
            {index}
          </sup>
        );
      }
    }
    
    // Handle bold **text**
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={j} className="font-bold text-slate-900">{bp.slice(2, -2)}</strong>;
          }
          return bp;
        })}
      </span>
    );
  });
};

// Helper to render text with citation markers [1] and basic markdown
const RichTextRenderer = ({ 
  text, 
  citations, 
  onCitationClick,
  onCitationHover 
}: { 
  text: string, 
  citations?: Citation[], 
  onCitationClick: (c: Citation) => void,
  onCitationHover?: (id: string | null) => void
}) => {
  if (!text) return null;
  
  // Split text by newlines to handle block elements
  const lines = text.split('\n');
  
  return (
    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-1">
      {lines.map((line, lineIdx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={lineIdx} className="h-2" />; // Spacer

        // Handle Headers
        if (line.startsWith('#### ')) {
          return (
            <h4 key={lineIdx} className="text-sm font-bold text-slate-800 mt-3 mb-1 uppercase tracking-wide">
              {line.replace(/^####\s+/, '')}
            </h4>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={lineIdx} className="text-base font-bold text-slate-900 mt-4 mb-2">
              {line.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={lineIdx} className="text-lg font-bold text-slate-900 mt-5 mb-3 border-b border-slate-100 pb-2">
              {line.replace(/^##\s+/, '')}
            </h2>
          );
        }
        
        // Handle Bullet points * or -
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
           return (
             <div key={lineIdx} className="flex gap-2 pl-4 mb-1">
               <span className="text-slate-400 mt-2 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
               <div>
                 {renderInlineContent(line.replace(/^[\*\-]\s+/, ''), citations, onCitationClick, onCitationHover)}
               </div>
             </div>
           );
        }

        // Standard paragraph
        return (
          <p key={lineIdx} className="mb-1">
            {renderInlineContent(line, citations, onCitationClick, onCitationHover)}
          </p>
        );
      })}
    </div>
  );
};

interface CenterPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  isAnalyzing?: boolean;
  onCitationClick: (citation: Citation) => void;
  selectedCitationId?: string;
  onCitationHover?: (id: string | null) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ 
  logic, 
  isAnalyzing: isAnalyzingProp,
  onCitationClick,
  selectedCitationId,
  onCitationHover
}) => {
  const { response, isAnalyzing: isAnalyzingFromLogic } = logic;
  const isAnalyzing = isAnalyzingProp ?? isAnalyzingFromLogic;
  const [activeTab, setActiveTab] = useState<'integrated' | 'guidelines' | 'evidence'>('integrated');

  if (!response && !isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 px-10 py-12 gap-10">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Activity className="w-7 h-7 text-teal-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">智能诊疗方案</h2>
          <p className="text-sm text-slate-400 leading-relaxed">在左侧输入患者病历，系统将自动匹配指南、检索文献并生成个性化方案。</p>
        </div>
      </div>
    );
  }


  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            className="absolute inset-0 border-4 border-slate-100 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            <Activity className="w-8 h-8 text-indigo-500" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">正在分析病例...</h3>
        <div className="flex flex-col gap-2 text-sm text-slate-500 items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            正在匹配 CSCO/NCCN 指南...
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            正在检索真实世界数据库...
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            正在生成个性化治疗建议...
          </motion.span>
        </div>
      </div>
    );
  }

  const CitationBadge = ({ indices }: { indices?: number[] }) => {
    if (!indices || indices.length === 0) return null;
    
    return (
      <span className="inline-flex gap-1 ml-1 align-super text-[10px]">
        <Tooltip.Provider delayDuration={300}>
          {indices.map(idx => {
            const citation = response?.citations?.find(c => c.index === idx);
            if (!citation) return null;
            
            return (
              <Tooltip.Root key={idx}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCitationClick(citation);
                    }}
                    className={cn(
                      "inline-flex items-center justify-center min-w-[16px] h-[16px] px-0.5 rounded text-white font-bold transition-all hover:scale-110 cursor-pointer",
                      selectedCitationId === citation.id ? "ring-2 ring-offset-1 ring-teal-500 scale-110" : "",
                      citation.sourceType === 'guideline' ? "bg-teal-600" :
                      citation.sourceType === 'pubmed' ? "bg-blue-600" : "bg-purple-600"
                    )}
                  >
                    {idx}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="z-50 max-w-xs bg-slate-900 text-white text-xs p-2 rounded shadow-lg animate-in fade-in zoom-in-95 duration-200" sideOffset={5}>
                    <p className="font-bold mb-1">{citation.sourceType.toUpperCase()}</p>
                    <p>{citation.title}</p>
                    <Tooltip.Arrow className="fill-slate-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </Tooltip.Provider>
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Header Tabs */}
      <div className="flex-none px-6 pt-6 pb-4 border-b border-slate-100 bg-white z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            MDT_Beone 诊疗方案
          </h2>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              response?.diagnosisStatus === 'confirmed' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {response?.diagnosisStatus === 'confirmed' ? '诊断明确' : '疑似诊断'}
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-100/50 p-1 rounded-lg">
          {[
            { id: 'integrated', label: '综合', icon: Layers },
            { id: 'guidelines', label: '指南问答', icon: FileText },
            { id: 'evidence', label: 'PubMed 问答', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mx-auto w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {activeTab === 'guidelines' ? (
            <motion.div
              key="guidelines"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <h3 className="text-lg font-bold text-teal-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  参考指南
                </h3>
                <div className="space-y-2">
                  {response?.guidelines.map((g, i) => (
                    <div key={g.id ?? i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
                      <span className="font-medium text-slate-800">{g.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded font-medium",
                        g.type === 'primary' ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {g.type === 'primary' ? '主要依据' : '参考'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 各指南意见：按来源区分显示 */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  各指南意见（按来源区分）
                </h3>
                {response?.guidelines?.filter(g => g.recommendations?.length).map((g, idx) => (
                  <div key={g.id ?? idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className={cn(
                      "px-4 py-3 border-b border-slate-200 flex items-center justify-between",
                      g.type === 'primary' ? "bg-teal-50 border-teal-100" : "bg-slate-50 border-slate-100"
                    )}>
                      <span className="font-bold text-slate-900">{g.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded font-medium",
                        g.type === 'primary' ? "bg-teal-200 text-teal-800" : "bg-slate-200 text-slate-700"
                      )}>
                        {g.type === 'primary' ? '主要依据' : '参考'}
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      {g.recommendations?.map((rec, ri) => (
                        <div key={ri} className="border-l-2 border-teal-200 pl-4 py-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-800">{rec.topic}</span>
                            {rec.evidenceLevel && (
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                                {rec.evidenceLevel}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            <RichTextRenderer
                              text={rec.content}
                              citations={response?.citations}
                              onCitationClick={onCitationClick}
                              onCitationHover={onCitationHover}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  指南推荐方案（综合）
                </h3>
                {response?.treatments.map((treatment) => (
                  <div key={treatment.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-slate-800">{treatment.name}</h4>
                      <span className="px-3 py-1 bg-teal-600 text-white text-sm font-bold rounded-full shadow-sm">
                        {treatment.evidenceLevel} 类推荐
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{treatment.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {treatment.citationIndices?.map(idx => {
                        const cit = response.citations?.find(c => c.index === idx);
                        if (cit?.sourceType !== 'guideline') return null;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCitationClick(cit);
                            }}
                            onMouseEnter={() => onCitationHover?.(cit.id)}
                            onMouseLeave={() => onCitationHover?.(null)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
                            title={cit.title}
                          >
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[200px]">{cit.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'evidence' ? (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Added Comprehensive Analysis Section */}
              {response?.comprehensiveAnalysis && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    循证医学分析 (Evidence-Based Analysis)
                  </h3>
                  <RichTextRenderer 
                    text={response.comprehensiveAnalysis} 
                    citations={response.citations} 
                    onCitationClick={onCitationClick} 
                    onCitationHover={onCitationHover}
                  />
                </div>
              )}

              <div className="bg-indigo-50/80 rounded-xl border border-indigo-100 p-5">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  循证推荐要点
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <RichTextRenderer text="· 初治 DLBCL 一线首选 R-CHOP 或 Pola-R-CHP，依据 CSCO/NCCN 指南 [1][2] 及 POLARIX [3]。" citations={response?.citations} onCitationClick={onCitationClick} onCitationHover={onCitationHover} />
                  <RichTextRenderer text="· Pola-R-CHP 可改善 2 年 PFS，适用于 IPI 2–5 分等中高危患者 [3]。" citations={response?.citations} onCitationClick={onCitationClick} onCitationHover={onCitationHover} />
                  <RichTextRenderer text="· 预后分层建议采用 IPI/R-IPI [5]；双打击/三打击需更积极方案 [1][2]。" citations={response?.citations} onCitationClick={onCitationClick} onCitationHover={onCitationHover} />
                  <RichTextRenderer text="· 利妥昔单抗使用前必须筛查 HBsAg，阳性者预防性抗病毒 [1][2]。" citations={response?.citations} onCitationClick={onCitationClick} onCitationHover={onCitationHover} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  关键临床研究 (Key Studies)
                </h3>
                {response?.citations?.filter(c => c.sourceType === 'pubmed').map((cit) => (
                  <div 
                    key={cit.id} 
                    onClick={() => onCitationClick(cit)}
                    className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                        {cit.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors">
                          {cit.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-medium text-slate-700">{cit.journal}</span>
                          <span>•</span>
                          <span>{cit.year}</span>
                          {cit.impactFactor && (
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">
                              IF: {cit.impactFactor}
                            </span>
                          )}
                        </div>
                        {cit.abstract && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {cit.abstract}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="integrated"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Diagnosis Section */}
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">{response?.diagnosisTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {response?.concepts.filter(c => c.confirmed).map(c => (
                    <span key={c.id} className="px-2 py-1 bg-white text-indigo-700 text-sm rounded border border-indigo-200 shadow-sm">
                      {c.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guidelines Section */}
              {response?.treatments && response.treatments.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-teal-100 text-teal-700 px-3 py-1 rounded-bl-lg text-xs font-bold">
                    来源: 权威指南
                  </div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                    指南推荐方案
                  </h3>
                  <div className="space-y-4">
                    {response.treatments.map((treatment) => (
                      <div key={treatment.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-bold text-slate-800">{treatment.name}</h4>
                          <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded shadow-sm">
                            {treatment.evidenceLevel} 类推荐
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{treatment.description}</p>
                        
                        {/* Contraindications Warning */}
                        {treatment.contraindications && treatment.contraindications.length > 0 && (
                          <div className="mt-3 mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                              <div className="space-y-1">
                                {treatment.contraindications.map((c, i) => (
                                  <p key={i} className="text-sm text-red-700 font-medium">
                                    {c.reason}
                                    <CitationBadge indices={c.citationIndices} />
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Alternatives */}
                        {treatment.alternatives && treatment.alternatives.length > 0 && (
                          <div className="mt-3 mb-3 space-y-2">
                            {treatment.alternatives.map((alt, altIdx) => (
                              <div key={altIdx} className="ml-4 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 relative">
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300" />
                                <div className="absolute -left-4 top-0 bottom-1/2 w-px bg-slate-300 -mt-3" />
                                
                                <div className="bg-blue-100 p-1.5 rounded-md text-blue-600">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-blue-900">
                                    推荐替代：{alt.name}
                                    <CitationBadge indices={alt.citationIndices} />
                                  </p>
                                  <p className="text-xs text-blue-700">{alt.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {treatment.citationIndices?.map(idx => {
                            const cit = response.citations?.find(c => c.index === idx);
                            if (cit?.sourceType !== 'guideline') return null;
                            return (
                              <div 
                                key={idx} 
                                onClick={() => onCitationClick(cit)}
                                className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 cursor-pointer hover:border-teal-300 hover:text-teal-700 transition-colors shadow-sm"
                              >
                                <FileText className="w-3 h-3 text-teal-500" />
                                <span className="truncate max-w-[200px]">{cit.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comprehensive Analysis Section (Evidence) */}
              {response?.comprehensiveAnalysis && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-bl-lg text-xs font-bold">
                    来源: 循证医学
                  </div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    循证医学分析
                  </h3>
                  <RichTextRenderer 
                    text={response.comprehensiveAnalysis} 
                    citations={response.citations} 
                    onCitationClick={onCitationClick} 
                    onCitationHover={onCitationHover}
                  />
                </div>
              )}



              {/* Guidelines & Exams */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">参考指南（按来源）</h3>
                  <ul className="space-y-2">
                    {response?.guidelines.map((g, i) => (
                      <li key={g.id ?? i} className="flex items-center justify-between gap-2 text-sm text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="flex items-center gap-2 min-w-0">
                          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="font-medium text-slate-800 truncate" title={g.name}>{g.name}</span>
                        </span>
                        <span className={cn("shrink-0 text-xs px-1.5 py-0.5 rounded", g.type === 'primary' ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-600")}>
                          {g.type === 'primary' ? '主要依据' : '参考'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">建议完善检查</h3>
                  <ul className="space-y-2">
                    {response?.exams.map((e) => (
                      <li key={e.id} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <Activity className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-slate-800">{e.name}</span>
                          <p className="text-xs text-slate-400">{e.purpose}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        
        </AnimatePresence>

        {/* 模块追问功能 */}
        {(activeTab === 'guidelines' || activeTab === 'evidence') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-slate-200/60"
          >
            <div className="relative flex items-center bg-white border border-indigo-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(99,102,241,0.1)] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-300 transition-all p-1.5 group">
              <input 
                type="text" 
                placeholder={
                  activeTab === 'guidelines'
                    ? '基于当前指南推荐提问，例如：为什么没有推荐放疗？'
                    : '基于文献证据提问，例如：是否有关于高龄患者生存率的补充数据？'
                }
                className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button className="flex-shrink-0 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm active:scale-95 flex items-center gap-1.5 group-focus-within:bg-indigo-500">
                <span className="text-xs font-semibold pl-1 hidden sm:inline">发送</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 px-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-slate-400">AI 将结合当前患者特征与 <strong className="text-slate-500 font-medium">{
                activeTab === 'guidelines' ? '指南推荐' : 'PubMed 文献证据'
              }</strong> 为您解答</span>
            </div>
          </motion.div>
        )}

          </div>
        </div>

      {/* Bottom Action Bar */}
      {response?.diagnosisStatus !== 'unclear' && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="flex items-center gap-2">
            <ActionButton icon={<Stethoscope className="w-4 h-4" />} label="MDT查房" />
            <ActionButton icon={<Presentation className="w-4 h-4" />} label="生成PPT" />
            <ActionButton icon={<GitCompare className="w-4 h-4" />} label="匹配研究" />
          </div>
          
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            生成决策报告
          </button>
        </div>
      )}
    </div>
  );
};

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-700 hover:bg-teal-50 transition-all shadow-sm">
      {icon}
      {label}
    </button>
  );
}

