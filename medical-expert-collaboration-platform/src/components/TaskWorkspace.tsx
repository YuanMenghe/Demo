import React from 'react';
import { ArrowLeft, Save, Send, AlertTriangle, FileText, Check, Info } from 'lucide-react';

interface TaskWorkspaceProps {
  taskId: string;
  onBack: () => void;
}

export default function TaskWorkspace({ taskId, onBack }: TaskWorkspaceProps) {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Workspace Header */}
      <div className="h-14 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{taskId}</span>
          <h2 className="text-sm font-bold text-slate-900 truncate max-w-md">非小细胞肺癌(NSCLC)真实世界研究方案结构化审查</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Check size={14} className="text-green-500" /> 已自动保存
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">
            <Save size={14} />
            暂存
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-noah-600 hover:bg-noah-700 text-white text-xs font-bold transition-colors shadow-sm">
            <Send size={14} />
            提交验收
          </button>
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Material Viewer */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="h-10 border-b border-slate-200 flex items-center px-4 bg-white shrink-0">
            <FileText size={14} className="text-slate-400 mr-2" />
            <span className="text-xs font-bold text-slate-700">原始材料：NSCLC_RWE_Protocol_v2.pdf</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 font-serif text-sm leading-relaxed text-slate-800">
            <h1 className="text-xl font-bold mb-4 text-center">一项评估新型靶向药物在真实世界中治疗晚期非小细胞肺癌的研究方案</h1>
            
            <h2 className="text-lg font-bold mt-6 mb-2">1. 研究背景</h2>
            <p className="mb-4">
              非小细胞肺癌（NSCLC）占所有肺癌的80%-85%，大部分患者确诊时已处于晚期。近年来，针对特定基因突变（如EGFR、ALK等）的靶向治疗显著改善了患者的生存期。然而，真实世界中的临床实践往往比随机对照试验（RCT）更为复杂，患者群体更具异质性。
            </p>
            <p className="mb-4 bg-yellow-100/50 p-1 rounded">
              本研究旨在通过回顾性收集多中心真实世界数据，评估新型靶向药物X在既往接受过至少一线标准治疗失败的晚期NSCLC患者中的有效性和安全性。
            </p>

            <h2 className="text-lg font-bold mt-6 mb-2">2. 研究目的</h2>
            <p className="mb-2"><strong>主要目的：</strong></p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>评估药物X在真实世界环境中的客观缓解率（ORR）和无进展生存期（PFS）。</li>
            </ul>
            <p className="mb-2"><strong>次要目的：</strong></p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>评估总生存期（OS）。</li>
              <li>评估安全性及不良事件（AE）发生率。</li>
            </ul>

            <h2 className="text-lg font-bold mt-6 mb-2">3. 研究设计</h2>
            <p className="mb-4">
              本研究为多中心、回顾性、观察性真实世界研究。计划纳入自2021年1月至2023年12月期间，在我国10家三甲医院接受药物X治疗的晚期NSCLC患者的电子病历数据。
            </p>

            <div className="my-8 p-4 bg-slate-200 flex flex-col items-center justify-center text-slate-500 rounded border border-slate-300 border-dashed">
              <span>... (向下滚动查看更多内容) ...</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Evaluation Form */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="h-10 border-b border-slate-200 flex items-center px-4 bg-white shrink-0 shadow-sm z-10">
            <AlertTriangle size={14} className="text-slate-400 mr-2" />
            <span className="text-xs font-bold text-slate-700">专家审查表单 (C4级别)</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>审查指引：</strong>请从科学性、伦理风险、可操作性三个维度对该研究方案进行结构化评价。如判定为“存在缺陷”，必须在意见栏中提供具体的修改建议。
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</span>
                科学性与研究设计评估
              </h3>
              <div className="space-y-4 ml-7">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">研究目的与设计是否匹配？<span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="design" className="text-noah-600 focus:ring-noah-500 w-4 h-4" defaultChecked />
                      完全合理
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="design" className="text-noah-600 focus:ring-noah-500 w-4 h-4" />
                      部分合理（需微调）
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="design" className="text-noah-600 focus:ring-noah-500 w-4 h-4" />
                      存在严重缺陷
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">统计学考量（样本量、终点设定）评价<span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-noah-500 focus:border-noah-500 outline-none"
                    rows={3}
                    placeholder="请指出统计设计上的潜在问题..."
                    defaultValue="由于是回顾性真实世界研究，未明确描述如何处理缺失数据及混杂因素的控制方法（如倾向性评分匹配等），建议补充统计学分析计划的细节。"
                  ></textarea>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2 */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">2</span>
                伦理与合规风险
              </h3>
              <div className="space-y-4 ml-7">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">受试者隐私与数据安全风险级别<span className="text-red-500">*</span></label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-noah-500 outline-none bg-white">
                    <option>低风险（常规脱敏）</option>
                    <option>中等风险（需特别声明豁免知情同意条件）</option>
                    <option>高风险</option>
                  </select>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3 */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">3</span>
                综合结论与专家意见
              </h3>
              <div className="space-y-4 ml-7">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">总体评估结论<span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="final" className="text-noah-600 focus:ring-noah-500 w-4 h-4" />
                      建议通过
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="final" className="text-noah-600 focus:ring-noah-500 w-4 h-4" defaultChecked />
                      修改后通过
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="final" className="text-noah-600 focus:ring-noah-500 w-4 h-4" />
                      建议驳回
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">最终综合意见（将作为交付成果）<span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-noah-500 focus:border-noah-500 outline-none"
                    rows={6}
                    placeholder="请给出结构化的综合评估结论，包括核心缺陷和可执行的修改建议..."
                  ></textarea>
                  <p className="text-[10px] text-slate-400 mt-2 text-right">已输入 0 / 1000 字（最少需要提供 50 字论证）</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
