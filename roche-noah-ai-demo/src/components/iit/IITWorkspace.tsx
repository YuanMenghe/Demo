import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Lightbulb, Search, FileEdit, FileText, CheckSquare, 
  Settings2, BookOpen, ChevronRight, Bot, Target, AlertTriangle
} from 'lucide-react';

// Import Views
import { TopicView } from './TopicView';
import { LitSearchView, ProtocolView, ReviewView, JournalView } from './PlaceholderViews';

const steps = [
  { id: 1, name: '智能选题', icon: Lightbulb, desc: '推荐研究方向' },
  { id: 2, name: '文献挖掘', icon: Search, desc: '检索证据支持' },
  { id: 3, name: 'Synopsis设计', icon: FileEdit, desc: '生成方案草案' },
  { id: 4, name: 'Protocol撰写', icon: FileText, desc: '全量文件生成' },
  { id: 5, name: 'AI评审', icon: CheckSquare, desc: '智能质控审查' },
  { id: 6, name: '修改优化', icon: Settings2, desc: '基于意见迭代' },
  { id: 7, name: '选刊推荐', icon: BookOpen, desc: '匹配目标期刊' },
];

const sopTips: Record<number, string[]> = {
  1: [
    "[SOP-DEV-001] 选题必须符合公司核心治疗领域战略方向 (如肿瘤、神经科学等)。",
    "[规范提醒] 请确保 PICOS 框架中的对照组符合当前临床标准治疗方案(SoC)。"
  ],
  2: [
    "[SOP-LIT-003] 课题前序文献检索策略需覆盖过去至少5年内的主流数据库。",
    "提示：请重点关注证据地图中‘空白或证据稀缺’的象限作为切入点。"
  ],
  3: [
    "[SOP-SYNOPSIS-01] 研究假设必须具有可检验性，且统计学检验效能需提前规划。",
    "[提示] Synopsis 表单内容将直接作为立项排审的核心内容，请务必详密。"
  ],
  4: [
    "[规范提醒] Protocol 格式必须遵循 ICH E6(R2) GCP 指南。",
    "提示：请确保由 AI 生成的 ICF (知情同意书) 包含所有必须提及的风险告知项。"
  ],
  5: [
    "[SOP-REV-02] 任何 IIT 发起方案均需经过独立的科学性审查与医学伦理审查。",
    "系统将着重扫描：入排标准矛盾、随访窗口期模糊、安全性报告路径缺失等常见缺陷。"
  ],
  6: [
    "[规范提醒] 针对高危风险提示（如导致主要终点无法评估的逻辑错误），必须强制进行修订。",
    "如有异议，请在优化记录中补充说明申诉理由。"
  ],
  7: [
    "提醒：投稿前请确认所有作者均已在此阶段完成了利益冲突声明 (COI)。",
    "推荐策略会优先过滤已被列为预警期刊或风评不佳的掠夺性期刊。"
  ]
};

export function IITWorkspace() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-theme(spacing.14))] bg-slate-50 overflow-hidden relative">
      
      {/* HORIZONTAL TOP NAV */}
      <div className="bg-white border-b border-gray-200 z-20 shadow-[0_2px_10px_rgb(0,0,0,0.02)] shrink-0 py-1 relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400"></div>
        <div className="flex items-center justify-between px-6 py-3 max-w-full mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex justify-center items-center gap-1 min-w-max w-full">
            {steps.map((step, idx) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 border relative group",
                      isActive 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105 z-10" 
                        : isCompleted
                          ? "bg-indigo-50/50 border-transparent text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200"
                          : "bg-white border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    )}
                  >
                    <Icon size={isActive ? 18 : 16} className={cn(
                      "transition-colors",
                      isActive ? "text-white" : isCompleted ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                    )} />
                    <div className="flex flex-col items-start justify-center text-left">
                      <span className={cn("text-sm font-bold leading-tight", isActive ? "text-white" : isCompleted ? "text-indigo-900" : "text-gray-600")}>{step.name}</span>
                      {isActive && <span className="text-[10px] opacity-90 mt-0.5 leading-none font-medium">{step.desc}</span>}
                    </div>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className="w-8 flex justify-center text-gray-300 mx-0.5">
                      <ChevronRight size={16} className={isCompleted && !isActive ? "text-indigo-300" : ""} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA ROW */}
      <div className="flex flex-1 overflow-hidden">
        {/* CENTER: Main Dynamic View */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 pb-8">
          <div className="max-w-6xl mx-auto h-full p-6">
            {activeStep === 1 && <TopicView onNext={() => setActiveStep(2)} />}
            {activeStep === 2 && <LitSearchView onNext={() => setActiveStep(3)} />}
            {(activeStep === 3 || activeStep === 4) && <ProtocolView step={activeStep} onNext={() => setActiveStep(activeStep + 1)} />}
            {(activeStep === 5 || activeStep === 6) && <ReviewView step={activeStep} onNext={() => setActiveStep(activeStep + 1)} />}
            {activeStep === 7 && <JournalView />}
          </div>
        </div>

        {/* RIGHT: Roche SOP Assistant Sidebar */}
        <div className="w-[300px] bg-white border-l border-indigo-100/50 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 transform translate-x-0 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-[6px] bg-gradient-to-r from-indigo-500 to-teal-400"></div>
        
        <div className="p-5 border-b border-indigo-50 bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-teal-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                <Bot size={20} className="text-indigo-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Roche SOP 智能体</h3>
              <p className="text-xs text-emerald-600 font-medium tracking-wide">全程护航 · 流程质控</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 relative z-10">
          <div className="space-y-5">
            {/* Context Awareness Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 self-start inline-flex w-fit shadow-sm">
              <Target size={12} /> 当前环节：{steps[activeStep - 1].name}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed bg-white rounded-xl">
              系统已根据 Roche 内部临床开发操作规范文档对本环节进行了自动扫描。请在操作时留意以下合规要求：
            </p>

            <div className="space-y-3 mt-4">
              {sopTips[activeStep].map((tip, i) => {
                const isWarning = tip.includes("规范") || tip.includes("必须") || tip.includes("强制");
                return (
                  <div key={i} className={cn(
                    "p-3.5 rounded-xl border text-sm leading-relaxed relative overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)]",
                    isWarning 
                      ? "bg-rose-50/50 border-rose-100 text-rose-800"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  )}>
                    {isWarning && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-400"></div>}
                    {!isWarning && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-400"></div>}
                    
                    <div className="flex gap-2">
                      {isWarning ? <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" /> : <Settings2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />}
                      <span>{tip}</span>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
        
        {/* Assistant Input area - non-functional but looks realistic */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 relative z-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="向SOP助手提问细节..." 
              className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
               <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      </div>{/* END MAIN CONTENT AREA ROW */}

    </div>
  )
}
