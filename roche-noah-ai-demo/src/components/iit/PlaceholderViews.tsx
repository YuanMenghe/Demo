import { Search, UploadCloud, FileEdit, CheckSquare, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function LitSearchView({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <Search size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">智能文献挖掘</h2>
      <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
        此模块可以作为独立功能使用。您可以输入自定义的搜索策略，或上传已有的选题报告开启深度检索。
      </p>
      
      <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col gap-4">
        <textarea 
          placeholder="在此输入您的检索词 / PICOS框架信息，或粘贴既有选题内容..."
          className="w-full h-32 resize-none border border-gray-200 rounded-xl p-4 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
        ></textarea>
        
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative py-8 flex flex-col items-center justify-center gap-2">
            <UploadCloud className="text-indigo-400" size={28} />
            <span className="text-sm font-medium text-indigo-700">将选题报告或文献资料拖拽至此，或点击上传 (.pdf, .docx)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition flex items-center gap-2 font-bold shadow-md shadow-indigo-200">
          <Sparkles size={18} /> 开始文献挖掘
        </button>
        <button onClick={onNext} className="bg-white border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-50 transition font-medium">
          跳过，进入下一模块
        </button>
      </div>
    </motion.div>
  )
}

export function ProtocolView({ step, onNext }: { step: number, onNext: () => void }) {
  const isSynopsis = step === 3;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <FileEdit size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{isSynopsis ? '智能 Synopsis 设计' : '全量 Protocol 撰写'}</h2>
      <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
        作为独立功能，您可以上传既有的 {isSynopsis ? '文献综述或核心摘要' : 'Synopsis 草案'}，AI 将直接为您扩展并生成符合标准规范的 {isSynopsis ? 'Synopsis' : 'Protocol'}。
      </p>

      <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative py-12 flex flex-col items-center justify-center gap-2">
            <UploadCloud className="text-indigo-400" size={32} />
            <span className="text-sm font-medium text-indigo-700">上传之前步骤的文件 (如 {isSynopsis ? 'Literature_Review.pdf' : 'Synopsis_Draft.docx'})</span>
            <span className="text-xs text-indigo-400 mt-1">支持 Word, PDF 格式，最大 50MB</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition flex items-center gap-2 font-bold shadow-md shadow-indigo-200">
          <Sparkles size={18} /> 开始生成 {isSynopsis ? 'Synopsis' : 'Protocol'}
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
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{step === 5 ? '独立 AI 评审与质控' : '人工/AI 协同修改优化'}</h2>
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

        {step === 6 && (
          <textarea 
            placeholder="[可选] 在此输入您希望重点关注的修改意见或审稿人反馈..."
            className="w-full h-24 resize-none border border-gray-200 rounded-xl p-4 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          ></textarea>
        )}
      </div>

      <div className="flex gap-4">
        {step === 5 ? (
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
