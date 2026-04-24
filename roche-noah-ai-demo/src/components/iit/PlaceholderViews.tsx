import { UploadCloud, FileEdit, CheckSquare, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function SynopsisView({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-[60vh] max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100 mx-auto">
          <FileEdit size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">独立 Synopsis 设计</h2>
        <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto">
          支持从上一步选题与文献证据自动带入，也支持单独输入 PICO/PICOS 框架、自然语言研究设计，或上传既有文档生成结构化 Synopsis。
        </p>
      </div>

      <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-5">
          <div>
            <div className="text-sm font-bold text-gray-800 mb-3">PICO / PICOS 框架</div>
            <div className="grid grid-cols-1 gap-3">
              {[
                ['P 人群', '例如：重症感染且接受阿米卡星治疗的成人患者'],
                ['I 干预', '例如：AI 辅助 TDM 采样时间点与剂量调整策略'],
                ['C 对照', '例如：常规 TDM 流程或经验采样策略'],
                ['O 结局', '例如：目标浓度达标率、肾毒性发生率、住院结局'],
                ['S 研究设计', '例如：前瞻性、单中心/多中心验证研究'],
              ].map(([label, placeholder]) => (
                <label key={label} className="grid grid-cols-[88px_1fr] items-center gap-3">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-center">{label}</span>
                  <input placeholder={placeholder} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-800 mb-3">自然语言研究设想</div>
            <textarea
              placeholder="也可以直接描述研究设想，例如：我想验证 AI 辅助 TDM 是否能提升阿米卡星给药达标率，并降低肾毒性风险..."
              className="w-full h-28 resize-none border border-gray-200 rounded-xl p-4 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-sm font-bold text-gray-800 mb-3">上传文档生成 Synopsis</div>
          <div className="relative group cursor-pointer mb-5 flex-1 min-h-[210px]">
            <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
            <div className="relative h-full flex flex-col items-center justify-center gap-2 text-center px-5">
              <UploadCloud className="text-indigo-400" size={34} />
              <span className="text-sm font-medium text-indigo-700">上传文献总结、选题报告、既有方案或科室讨论材料</span>
              <span className="text-xs text-indigo-400 mt-1">支持 Word / PDF，系统将抽取研究背景、目标人群、终点与设计要素</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-gray-600 leading-relaxed mb-5">
            生成结果将落到可编辑 Synopsis 表单，包括研究背景、研究目的、目标人群、终点框架、研究类型和实施思路。
          </div>

          <button onClick={onNext} className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-bold shadow-md shadow-indigo-200">
            <Sparkles size={18} /> 生成可编辑 Synopsis
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function ProtocolView({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <FileEdit size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">全量 Protocol 撰写</h2>
      <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
        基于已确认的 Synopsis，或上传既有 Synopsis 草案，系统逐步生成 Protocol 正文及 SoA、SAP、ICF、CRF 等核心附件。
      </p>

      <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative py-12 flex flex-col items-center justify-center gap-2">
            <UploadCloud className="text-indigo-400" size={32} />
            <span className="text-sm font-medium text-indigo-700">上传已确认 Synopsis 或相关方案草案</span>
            <span className="text-xs text-indigo-400 mt-1">支持 Word, PDF 格式，最大 50MB</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition flex items-center gap-2 font-bold shadow-md shadow-indigo-200">
          <Sparkles size={18} /> 开始生成 Protocol
        </button>
        <button onClick={onNext} className="bg-white border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-50 transition font-medium">
          跳过，进入下一模块
        </button>
      </div>
    </motion.div>
  )
}

export function ReviewView({ step, onNext }: { step: number, onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <CheckSquare size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{step === 4 ? '独立 AI 评审与质控' : '人工/AI 协同修改优化'}</h2>
      <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
        您可以使用本模块作为独立的审核工具。直接上传需要评审或修改的 Protocol 文档，系统将基于 Roche 标准操作规范执行扫描。
      </p>

      <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="relative group cursor-pointer mb-4">
          <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative py-10 flex flex-col items-center justify-center gap-2">
            <UploadCloud className="text-indigo-400" size={32} />
            <span className="text-sm font-medium text-indigo-700">上传待审查的 Protocol 方案文件 (.docx)</span>
          </div>
        </div>

        {step === 5 && (
          <textarea 
            placeholder="[可选] 在此输入您希望重点关注的修改意见或审稿人反馈..."
            className="w-full h-24 resize-none border border-gray-200 rounded-xl p-4 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          ></textarea>
        )}
      </div>

      <div className="flex gap-4">
        {step === 4 ? (
            <button onClick={onNext} className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200">开始独立智能审查</button>
        ) : (
            <button onClick={onNext} className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200">开始针对性优化</button>
        )}
         <button onClick={onNext} className="bg-white border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-50 transition font-medium">
          跳过，进入下一模块
        </button>
      </div>
    </motion.div>
  )
}

export function JournalView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <BookOpen size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">智能选刊推荐</h2>
      <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
        作为独立工具使用时，请上传您最终确定的研究方案 (Protocol) 或是论文摘要，系统将智能匹配最符合的医学期刊。
      </p>

      <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col gap-4">
        <textarea 
          placeholder="在此输入您的研究摘要、关键词等核心信息..."
          className="w-full h-32 resize-none border border-gray-200 rounded-xl p-4 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
        ></textarea>
        
        <div className="relative group cursor-pointer inline-block w-full">
          <div className="absolute inset-0 bg-indigo-50 rounded-xl border-dashed border-2 border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative py-6 flex items-center justify-center gap-2">
            <UploadCloud className="text-indigo-400" size={24} />
            <span className="text-sm font-medium text-indigo-700">或上传完整方案 (.pdf, .docx)</span>
          </div>
        </div>
      </div>

      <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition flex items-center gap-2 font-bold shadow-md shadow-indigo-200">
        <Sparkles size={18} /> 开始选刊匹配
      </button>
    </motion.div>
  )
}
