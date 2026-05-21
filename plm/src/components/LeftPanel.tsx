import React, { useState } from "react";
import {
  AlertTriangle, Check, ChevronDown, Sparkles, User,
  Activity, ShieldAlert, PlayCircle, Pencil, Edit3, RefreshCw, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCDSSLogic } from "@/hooks/useCDSSLogic";
import { Concept } from "@/types";
import { SCENARIOS } from "@/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface LeftPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  slim?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAnalyze?: () => void;
  onResetToInput?: () => void;
  isAnalyzing?: boolean;
}

export function LeftPanel({ logic, slim=false, onAnalyze, onResetToInput, isAnalyzing }: LeftPanelProps) {
  const { patientContext, setPatientContext, response, checkPII, confirmConcept, updateConcept, updateMissingInput, loadScenario, currentScenarioId } = logic;
  const [showPIIAlert, setShowPIIAlert] = useState(false);
  const [tempText, setTempText] = useState("");
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);

  const handleAnalyzeClick = () => {
    const { hasPII, maskedText } = checkPII(patientContext.unstructuredText);
    if (hasPII) { setTempText(maskedText); setShowPIIAlert(true); }
    else onAnalyze?.();
  };
  const handlePIIConfirm = () => {
    setPatientContext(prev => ({ ...prev, unstructuredText: tempText }));
    setShowPIIAlert(false); onAnalyze?.();
  };

  if (slim) {
    return <SlimPanel logic={logic} onAnalyze={onAnalyze} onResetToInput={onResetToInput} isAnalyzing={isAnalyzing} />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 overflow-y-auto">
      <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-8 pt-12 pb-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">患者信息录入</h1>
            <p className="text-slate-500 mt-1.5">粘贴病历，AI 将自动分析并提取关键临床要素</p>
          </div>
          <div className="relative">
            <button onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)} className="flex items-center gap-2 text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm border border-teal-100/50">
              <PlayCircle className="w-4 h-4" /> 演示案例
            </button>
            {isScenarioMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsScenarioMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 overflow-hidden">
                  {SCENARIOS && Object.values(SCENARIOS).map(scenario => (
                    <button key={scenario.id} onClick={() => { loadScenario(scenario.id as any); setIsScenarioMenuOpen(false); }}
                      className={cn("w-full text-left px-5 py-3 text-sm transition-colors", currentScenarioId === scenario.id ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50 text-slate-700")}>
                      {scenario.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 min-h-0">
          {/* 左侧：自然语言输入区 */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                病历文本
              </label>
            </div>
            <div className="relative flex-1 flex flex-col min-h-[300px]">
              <textarea className="flex-1 w-full p-5 text-base text-slate-700 bg-white border border-slate-200 shadow-sm rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 resize-none transition-all placeholder:text-slate-400 leading-relaxed"
                placeholder="请在此粘贴患者的病历摘要、主诉、现病史、查体及病理结果..." value={patientContext.unstructuredText}
                onChange={e => setPatientContext(prev => ({ ...prev, unstructuredText: e.target.value }))} />
              <div className="absolute bottom-4 right-4">
                <button onClick={handleAnalyzeClick} disabled={isAnalyzing || !patientContext.unstructuredText?.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all active:scale-95">
                  {isAnalyzing ? <><span className="animate-spin">⏳</span> 分析中...</> : <><Sparkles className="w-4 h-4" /> 智能分析</>}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {showPIIAlert && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div><p className="text-sm text-amber-900 font-bold">检测到隐私信息</p><p className="text-sm text-amber-700 mt-1">系统已自动遮罩敏感字段（如姓名、电话等），请确认后继续。</p></div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button onClick={() => setShowPIIAlert(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">取消</button>
                    <button onClick={handlePIIConfirm} className="px-4 py-2 text-sm font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-xl transition-colors">确认并提交</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 右侧：结构化字段与识别结果（弥漫大B细胞淋巴瘤诊疗关键信息） */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                基本信息
              </label>
              {(() => {
                const sd = patientContext.structuredData ?? {};
                const setBasic = (key: string, value: string) =>
                  setPatientContext(prev => ({ ...prev, structuredData: { ...(prev.structuredData ?? {}), [key]: value } }));
                const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-slate-50 placeholder:text-slate-300 transition-all";
                const labelCls = "text-xs uppercase text-slate-500 font-bold tracking-wider";
                const cell = (lbl: string, el: React.ReactNode) => (
                  <div className="space-y-1.5"><label className={labelCls}>{lbl}</label>{el}</div>
                );
                return (
                  <div className="grid grid-cols-2 gap-4">
                    {cell("年龄", <input type="text" className={inputCls} placeholder="岁" value={sd.age ?? ""} onChange={e => setBasic("age", e.target.value)} />)}
                    {cell("性别", <select className={inputCls} value={sd.gender ?? ""} onChange={e => setBasic("gender", e.target.value)}><option value="">请选择</option><option value="男">男</option><option value="女">女</option></select>)}
                    {cell("ECOG 评分", <select className={inputCls} value={sd.ecog ?? ""} onChange={e => setBasic("ecog", e.target.value)}><option value="">请选择</option><option value="0">0 - 活动自如</option><option value="1">1 - 轻体力受限</option><option value="2">2 - 丧失工作能力</option><option value="3">3 - 卧床 &gt; 50%</option><option value="4">4 - 全卧床</option></select>)}
                    {cell("Ann Arbor 分期", <select className={inputCls} value={sd.annArborStage ?? ""} onChange={e => setBasic("annArborStage", e.target.value)}><option value="">请选择</option><option value="I">I 期</option><option value="II">II 期</option><option value="III">III 期</option><option value="IV">IV 期</option></select>)}
                    {cell("LDH", <select className={inputCls} value={sd.ldh ?? ""} onChange={e => setBasic("ldh", e.target.value)}><option value="">请选择</option><option value="正常">正常</option><option value="升高">升高</option><option value="未查">未查</option></select>)}
                    {cell("结外受累部位数", <select className={inputCls} value={sd.extranodalSites ?? ""} onChange={e => setBasic("extranodalSites", e.target.value)}><option value="">请选择</option><option value="0">0</option><option value="1">1</option><option value=">1">&gt;1</option><option value="未查">未查</option></select>)}
                    {cell("B 症状", <select className={inputCls} value={sd.bSymptoms ?? ""} onChange={e => setBasic("bSymptoms", e.target.value)}><option value="">请选择</option><option value="无">无</option><option value="有">有（发热/盗汗/体重减轻&gt;10%）</option></select>)}
                    {cell("病理亚型", <select className={inputCls} value={sd.cellOfOrigin ?? ""} onChange={e => setBasic("cellOfOrigin", e.target.value)}><option value="">请选择</option><option value="GCB">GCB</option><option value="非GCB">非 GCB (ABC)</option><option value="未分型">未分型</option></select>)}
                    {cell("双打击/三打击 (FISH)", <select className={inputCls} value={sd.doubleHit ?? ""} onChange={e => setBasic("doubleHit", e.target.value)}><option value="">请选择</option><option value="否">否</option><option value="双打击">双打击</option><option value="三打击">三打击</option><option value="未做">未做</option></select>)}
                    {cell("大肿块 (≥10 cm)", <select className={inputCls} value={sd.bulky ?? ""} onChange={e => setBasic("bulky", e.target.value)}><option value="">请选择</option><option value="否">否</option><option value="是">是</option><option value="未评估">未评估</option></select>)}
                    {cell("原发部位", <select className={inputCls} value={sd.primarySite ?? ""} onChange={e => setBasic("primarySite", e.target.value)}><option value="">请选择</option><option value="淋巴结">淋巴结</option><option value="原发纵隔">原发纵隔</option><option value="胃肠道">胃肠道</option><option value="其他结外">其他结外</option></select>)}
                    {cell("骨髓侵犯", <select className={inputCls} value={sd.boneMarrow ?? ""} onChange={e => setBasic("boneMarrow", e.target.value)}><option value="">请选择</option><option value="否">否</option><option value="是">是</option><option value="未查">未查</option></select>)}
                    {cell("HBsAg", <select className={inputCls} value={sd.hbsag ?? ""} onChange={e => setBasic("hbsag", e.target.value)}><option value="">请选择</option><option value="阴性">阴性</option><option value="阳性">阳性</option><option value="未查">未查</option></select>)}
                  </div>
                );
              })()}
            </div>

            <AnimatePresence>
              {response.concepts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-2"><Sparkles className="w-4 h-4 text-teal-600" />已识别要素</label>
                    <span className="text-xs text-slate-400">点击标签可修改</span>
                  </div>
                  <div className="flex flex-wrap gap-2">{response.concepts.map(c => <ConceptTag key={c.id} concept={c} onConfirm={() => confirmConcept(c.id)} onUpdate={t => updateConcept(c.id, t)} />)}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {response.missingInputs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-gradient-to-b from-amber-50 to-amber-50/30 border border-amber-200/60 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                    <div><p className="text-base font-bold text-amber-900">需要补充信息</p><p className="text-xs text-amber-700 mt-0.5">完善以下信息以获取更精准的方案</p></div>
                  </div>
                  <div className="space-y-3">{response.missingInputs.map(input => (
                    <div key={input.id} className="bg-white border border-amber-200/60 rounded-xl p-3.5 shadow-sm space-y-2 hover:border-amber-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                        {input.requiredFor && <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100 font-medium">{input.requiredFor === "guideline_unlock" ? "解锁指南" : input.requiredFor === "treatment_safety" ? "用药安全" : "必要信息"}</span>}
                      </div>
                      {input.type === "select" ? (
                        <div className="relative">
                          <select className="w-full text-sm pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 appearance-none transition-all" onChange={e => updateMissingInput(input.id, e.target.value)} defaultValue="">
                            <option value="" disabled>请选择...</option>
                            {input.allowEmpty && <option value="not_done">暂不填写</option>}
                            {input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      ) : (
                        <input type="text" className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400 transition-all" placeholder="请输入..." onBlur={e => updateMissingInput(input.id, e.target.value)} />
                      )}
                    </div>
                  ))}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10">
        <div className="max-w-5xl mx-auto flex justify-end">
          <button onClick={handleAnalyzeClick} disabled={isAnalyzing || !patientContext.unstructuredText?.trim()}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none min-w-[240px]">
            {isAnalyzing ? <><span className="animate-spin text-lg">⏳</span> 正在分析...</> : <><Sparkles className="w-5 h-5" /> 生成治疗方案</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SlimPanel({ logic, onAnalyze, onResetToInput, isAnalyzing }: { logic: ReturnType<typeof useCDSSLogic>; onAnalyze?: () => void; onResetToInput?: () => void; isAnalyzing?: boolean; }) {
  const { patientContext, response, updateMissingInput } = logic;
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">患者档案</span>
        <button onClick={onResetToInput} className="flex items-center gap-1 text-xs text-teal-600 hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors">
          <Edit3 className="w-3 h-3" /> 修改信息
        </button>
      </div>
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto min-h-0">
        {patientContext.unstructuredText && (
          <div className="text-xs text-slate-600 leading-relaxed line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">{patientContext.unstructuredText}</div>
        )}
        {response.concepts.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">识别要素</p>
            <div className="flex flex-wrap gap-1.5">{response.concepts.map(c => (
              <span key={c.id} className={cn("px-2 py-0.5 rounded-full text-xs border", c.confirmed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : c.isCritical ? "bg-yellow-50 text-yellow-700 border-yellow-300 border-dashed" : "bg-slate-50 text-slate-600 border-slate-200")}>{c.text}</span>
            ))}</div>
          </div>
        )}
        {response.missingInputs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5"><div className="p-1 bg-amber-100 rounded-full"><AlertTriangle className="w-3 h-3 text-amber-600" /></div><p className="text-xs font-semibold text-amber-800">{response.missingInputs.length} 项待补充</p></div>
            <div className="space-y-2">{response.missingInputs.map(input => (
              <div key={input.id} className="bg-white border border-amber-200/60 rounded-lg p-2.5">
                <div className="mb-1.5">
                    <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1 mb-0.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                    {(input.requiredFor || input.guidelineName) && (
                      <div className="text-[9px] text-slate-400 bg-slate-50 p-1 rounded">
                        {input.requiredFor && <div>解锁: {input.requiredFor}</div>}
                        {input.guidelineName && <div>来源: {input.guidelineName}</div>}
                      </div>
                    )}
                  </div>
                {input.type === "select" ? (
                  <div className="relative"><select className="w-full text-xs pl-2.5 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-md appearance-none focus:ring-1 focus:ring-amber-400" onChange={e => updateMissingInput(input.id, e.target.value)} defaultValue=""><option value="" disabled>请选择...</option>{input.allowEmpty && <option value="not_done">暂不填写</option>}{input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" /></div>
                ) : (
                  <input type="text" className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-400 placeholder:text-slate-400" placeholder="请输入..." onBlur={e => updateMissingInput(input.id, e.target.value)} />
                )}
              </div>
            ))}</div>
          </div>
        )}
      </div>
      <div className="px-5 py-5 border-t border-slate-100 shrink-0">
        <button onClick={onAnalyze} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} /> 重新生成方案
        </button>
      </div>
    </div>
  );
}

const ConceptTag: React.FC<{ concept: Concept; onConfirm: () => void; onUpdate: (text: string) => void; }> = ({ concept, onConfirm, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(concept.text);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);
  const handleSave = () => { if (editText.trim()) onUpdate(editText); else setEditText(concept.text); setIsEditing(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setEditText(concept.text); setIsEditing(false); } };
  if (isEditing) return (
    <div className="inline-flex items-center rounded-full text-sm border bg-white border-teal-500 shadow-sm overflow-hidden h-7">
      <input ref={inputRef} type="text" value={editText} onChange={e => setEditText(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} className="w-28 px-2.5 py-0.5 text-sm border-none focus:ring-0 bg-transparent outline-none h-full" />
      <button onMouseDown={handleSave} className="px-2 hover:bg-teal-50 text-teal-600 h-full flex items-center border-l border-teal-100"><Check className="w-3.5 h-3.5" /></button>
    </div>
  );
  return (
    <div className={cn("group relative inline-flex items-center pl-3 pr-1.5 py-1 rounded-full text-sm border transition-all cursor-pointer select-none", concept.confirmed ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300" : concept.isCritical ? "bg-yellow-50 text-yellow-800 border-yellow-300 border-dashed hover:border-yellow-400" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300")} onClick={() => setIsEditing(true)}>
      <span className="mr-1 max-w-[140px] truncate">{concept.text}</span>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-3 h-3 text-slate-400" />{!concept.confirmed && <div onClick={e => { e.stopPropagation(); onConfirm(); }} className="p-0.5 rounded-full hover:bg-emerald-100 text-emerald-600 ml-1"><Check className="w-3 h-3" /></div>}</div>
      {concept.isCritical && !concept.confirmed && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full animate-pulse border border-white" />}
    </div>
  );
};
