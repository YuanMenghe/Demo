import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  User, 
  Activity,
  ShieldAlert,
  PlayCircle,
  Pencil,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';
import { Concept } from '@/types';
import { SCENARIOS } from '@/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface LeftPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export function LeftPanel({ logic, collapsed = false, onToggleCollapse, onAnalyze, isAnalyzing }: LeftPanelProps) {
  const { 
    patientContext, 
    setPatientContext, 
    response, 
    checkPII, 
    confirmConcept, 
    updateConcept,
    updateMissingInput,
    loadScenario, 
    currentScenarioId 
  } = logic;

  const [showPIIAlert, setShowPIIAlert] = useState(false);
  const [tempText, setTempText] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);

  const handleAnalyzeClick = () => {
    const { hasPII, maskedText } = checkPII(patientContext.unstructuredText);
    if (hasPII) {
      setTempText(maskedText);
      setShowPIIAlert(true);
    } else {
      if (onAnalyze) onAnalyze();
    }
  };

  const handlePIIConfirm = () => {
    setPatientContext(prev => ({ ...prev, unstructuredText: tempText }));
    setShowPIIAlert(false);
    if (onAnalyze) onAnalyze();
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center bg-white border-r border-slate-200 py-4 gap-4">
        <button 
          onClick={onToggleCollapse}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          title="展开面板"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="w-8 h-px bg-slate-200" />
        <div className="flex flex-col gap-4 text-slate-400">
          <User className="w-5 h-5" />
          <Activity className="w-5 h-5" />
          {response.concepts.length > 0 && (
            <div className="relative">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 overflow-y-auto relative">
      <button 
        onClick={onToggleCollapse}
        className="absolute right-2 top-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded z-10"
        title="收起面板"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>

      {/* Header with Scenario Selector */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            患者信息录入
          </h2>
          <div className="relative">
            <button 
              onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
              className="text-xs flex items-center gap-1 text-teal-600 hover:bg-teal-50 px-2 py-1 rounded transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              演示案例
            </button>
            
            {isScenarioMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsScenarioMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1">
                  {SCENARIOS && Object.values(SCENARIOS).map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        loadScenario(scenario.id as any);
                        setIsScenarioMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs block transition-colors",
                        currentScenarioId === scenario.id 
                          ? "bg-teal-50 text-teal-700 font-medium" 
                          : "hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      {scenario.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Module 1: Unstructured Input */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <textarea
            className="w-full h-48 p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
            placeholder="粘贴病历文本、主诉、现病史... (输入超过10个字符以触发智能分析)"
            value={patientContext.unstructuredText}
            onChange={(e) => setPatientContext(prev => ({ ...prev, unstructuredText: e.target.value }))}
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || !patientContext.unstructuredText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">⏳</span> 分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> 智能分析
                </>
              )}
            </button>
          </div>
        </div>

        {/* PII Alert Dialog */}
        <AnimatePresence>
          {showPIIAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col gap-2"
            >
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-amber-800 font-medium">检测到隐私信息</p>
                  <p className="text-xs text-amber-700 mt-1">系统已自动遮罩敏感字段（如手机号、身份证），请确认后继续。</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowPIIAlert(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  取消
                </button>
                <button 
                  onClick={handlePIIConfirm}
                  className="px-2 py-1 text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-medium"
                >
                  确认并提交
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Module 2: Structured Input Accordion */}
      <div className="border-t border-slate-100">
        <button
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> 关键结构化字段
          </span>
          {isAccordionOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        
        <AnimatePresence>
          {isAccordionOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">年龄</label>
                  <input type="text" className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-teal-500" placeholder="岁" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">性别</label>
                  <select className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-teal-500">
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">ECOG 评分</label>
                  <select className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-teal-500">
                    <option>0 - 活动自如</option>
                    <option>1 - 轻体力受限</option>
                    <option>2 - 丧失工作能力</option>
                    <option>3 - 卧床 &gt; 50%</option>
                    <option>4 - 全卧床</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Module 3: Concept Recognition */}
      {response.concepts.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              已识别关键要素
            </h3>
            <span className="text-[10px] text-slate-400">点击标签可修改</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {response.concepts.map((concept) => (
              <ConceptTag 
                key={concept.id} 
                concept={concept} 
                onConfirm={() => confirmConcept(concept.id)}
                onUpdate={(newText) => updateConcept(concept.id, newText)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Module 4: Missing Inputs Card */}
      <AnimatePresence>
        {response.missingInputs.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-gradient-to-b from-amber-50/50 to-amber-50 border-t border-amber-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-100 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-900">需要补充信息</h3>
                <p className="text-[10px] text-amber-700/80">完善以下信息以获取精准方案</p>
              </div>
            </div>
            <div className="space-y-3">
              {response.missingInputs.map(input => (
                <div key={input.id} className="group bg-white border border-amber-200/60 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      {input.label}
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </label>
                    {input.requiredFor && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100 font-medium">
                        {input.requiredFor === 'guideline_unlock' ? '解锁指南' : 
                         input.requiredFor === 'diagnosis' ? '明确诊断' :
                         input.requiredFor === 'staging' ? '辅助分期' :
                         input.requiredFor === 'treatment_choice' ? '方案决策' :
                         input.requiredFor === 'treatment_safety' ? '用药安全' : '必要信息'}
                      </span>
                    )}
                  </div>
                  
                  {input.type === 'select' ? (
                    <div className="relative">
                      <select 
                        className="w-full text-xs pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer hover:bg-white"
                        onChange={(e) => updateMissingInput(input.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>请选择...</option>
                        {input.allowEmpty && <option value="not_done">暂不填写 (Not Done)</option>}
                        {input.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input 
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                      placeholder="请输入具体数值或描述..."
                      onBlur={(e) => updateMissingInput(input.id, e.target.value)}
                    />
                  )}
                  {input.guidelineName && (
                    <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      关联依据: {input.guidelineName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Bar */}
      <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={onAnalyze}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium text-sm shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          <span>生成治疗方案</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const ConceptTag: React.FC<{ 
  concept: Concept; 
  onConfirm: () => void;
  onUpdate: (text: string) => void;
}> = ({ 
  concept, 
  onConfirm, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(concept.text);
  // @ts-ignore
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(editText);
    } else {
      setEditText(concept.text); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(concept.text);
      setIsEditing(false);
    }
  };

  const isConfirmed = concept.confirmed;
  const isCritical = concept.isCritical;

  if (isEditing) {
    return (
      <div className="inline-flex items-center rounded-full text-xs border bg-white border-teal-500 shadow-sm overflow-hidden h-[26px]">
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-24 px-2 py-0.5 text-xs border-none focus:ring-0 bg-transparent outline-none h-full"
        />
        <button onMouseDown={handleSave} className="px-1.5 hover:bg-teal-50 text-teal-600 h-full flex items-center border-l border-teal-100">
          <Check className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group relative inline-flex items-center pl-2.5 pr-1 py-1 rounded-full text-xs border transition-all cursor-pointer select-none",
        isConfirmed 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300" 
          : isCritical
            ? "bg-yellow-50 text-yellow-800 border-yellow-300 border-dashed hover:border-yellow-400"
            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
      )}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <span className="mr-1 max-w-[120px] truncate" title={concept.text}>{concept.text}</span>
      
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-0.5">
        <div className="p-0.5 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600">
          <Pencil className="w-3 h-3" />
        </div>
        {!isConfirmed && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="p-0.5 rounded-full hover:bg-emerald-100 text-emerald-600 ml-0.5"
            title="确认"
          >
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
      
      {isCritical && !isConfirmed && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-sm border border-white" />
      )}
    </div>
  );
};
