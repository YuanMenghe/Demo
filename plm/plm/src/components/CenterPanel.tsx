import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Activity, 
  Database, 
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
  Layers
} from 'lucide-react';
import { CDSSResponse, Citation } from '../types';
import { cn } from '../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { RWDFlowChart } from './RWDFlowChart';
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
  onCitationClick: (citation: Citation) => void;
  selectedCitationId?: string;
  onCitationHover?: (id: string | null) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ 
  logic, 
  onCitationClick,
  selectedCitationId,
  onCitationHover
}) => {
  const { response, isAnalyzing } = logic;
  const [activeTab, setActiveTab] = useState<'integrated' | 'guidelines' | 'evidence' | 'rwd'>('integrated');

  if (!response && !isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 border-r border-slate-200">
        <div className="text-center text-slate-400">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>请在左侧输入病例信息并点击“生成诊疗方案”</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white border-r border-slate-200">
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
    <div className="h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden relative">
      {/* Header Tabs */}
      <div className="flex-none px-6 pt-6 pb-2 border-b border-slate-100 bg-white z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            智能诊疗方案
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
            { id: 'integrated', label: '整合视图', icon: Layers },
            { id: 'guidelines', label: '指南推荐', icon: FileText },
            { id: 'evidence', label: '循证证据', icon: BookOpen },
            { id: 'rwd', label: '真实世界', icon: Database },
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
        <AnimatePresence mode="wait">
          {activeTab === 'rwd' && response?.rwdAnalysis ? (
            <motion.div
              key="rwd"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* RWD Header Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs mb-1">数据库总样本量</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {response.rwdAnalysis.totalDatabaseSize.toLocaleString()}
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <div className="text-indigo-600 text-xs mb-1 font-medium">匹配队列人数</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {response.rwdAnalysis.matchedCohortSize.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs mb-1">匹配质量</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    response.rwdAnalysis.matchQuality === 'high' ? "text-emerald-600" : 
                    response.rwdAnalysis.matchQuality === 'medium' ? "text-amber-600" : "text-slate-600"
                  )}>
                    {response.rwdAnalysis.matchQuality === 'high' ? '高 (High)' : 
                     response.rwdAnalysis.matchQuality === 'medium' ? '中 (Medium)' : '低 (Low)'}
                  </div>
                </div>
              </div>

              {/* Matching Criteria */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <h3 className="font-semibold text-slate-700 text-sm">智能匹配条件</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">
                        高权重因子 (High Weight)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {response.rwdAnalysis.criteria
                          .filter(c => c.category === 'high_weight')
                          .map((c, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
                              <span className="font-medium">{c.name}:</span>
                              <span>{c.value}</span>
                              {c.matchStatus === 'exact' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        低权重因子 (Low Weight)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {response.rwdAnalysis.criteria
                          .filter(c => c.category === 'low_weight')
                          .map((c, i) => (
                            <div key={i} className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border",
                              c.matchStatus === 'ignored' 
                                ? "bg-slate-50 text-slate-400 border-slate-100 line-through decoration-slate-300" 
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            )}>
                              <span className="font-medium">{c.name}:</span>
                              <span>{c.value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cohort Flow Chart */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-700 text-sm">真实世界队列结局 (Real-World Outcomes)</h3>
                  </div>
                  <span className="text-xs text-slate-400">数据来源: {response.rwdAnalysis.dataSource}</span>
                </div>
                <div className="p-0">
                  <RWDFlowChart data={response.rwdAnalysis.flowData} />
                </div>
                <div className="px-4 py-3 bg-amber-50/50 border-t border-slate-100 text-sm text-slate-600">
                  <span className="font-semibold text-amber-700 mr-2">总结:</span>
                  {response.rwdAnalysis.summaryText}
                </div>
              </div>

            </motion.div>
          ) : activeTab === 'guidelines' ? (
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
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
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

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  指南推荐方案
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
                    
                    {/* Show only guideline citations here */}
                    <div className="flex flex-wrap gap-2">
                      {treatment.citationIndices?.map(idx => {
                        const cit = response.citations?.find(c => c.index === idx);
                        if (cit?.sourceType !== 'guideline') return null;
                        return (
                          <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[200px]">{cit.title}</span>
                          </div>
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
          ) : activeTab === 'guidelines' ? (
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
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
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

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  指南推荐方案
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
                    
                    {/* Show only guideline citations here */}
                    <div className="flex flex-wrap gap-2">
                      {treatment.citationIndices?.map(idx => {
                        const cit = response.citations?.find(c => c.index === idx);
                        if (cit?.sourceType !== 'guideline') return null;
                        return (
                          <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[200px]">{cit.title}</span>
                          </div>
                        );
                      })}
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



              {/* RWD Section */}
              {response?.rwdAnalysis && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-bl-lg text-xs font-bold">
                    来源: 真实世界数据
                  </div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-emerald-600" />
                    真实世界洞察
                  </h3>
                  <div className="bg-emerald-50/50 rounded-lg border border-emerald-100 p-4 mb-4">
                    <RichTextRenderer 
                      text={response.rwdAnalysis.summaryText} 
                      citations={response.citations} 
                      onCitationClick={onCitationClick} 
                      onCitationHover={onCitationHover}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-slate-500 text-xs mb-1">匹配队列人数</div>
                      <div className="text-xl font-bold text-emerald-700">
                        {response.rwdAnalysis.matchedCohortSize.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-slate-500 text-xs mb-1">匹配质量</div>
                      <div className={cn(
                        "text-xl font-bold",
                        response.rwdAnalysis.matchQuality === 'high' ? "text-emerald-600" : 
                        response.rwdAnalysis.matchQuality === 'medium' ? "text-amber-600" : "text-slate-600"
                      )}>
                        {response.rwdAnalysis.matchQuality === 'high' ? '高' : 
                         response.rwdAnalysis.matchQuality === 'medium' ? '中' : '低'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guidelines & Exams */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">参考指南</h3>
                  <ul className="space-y-2">
                    {response?.guidelines.map((g, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        {g.name}
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
