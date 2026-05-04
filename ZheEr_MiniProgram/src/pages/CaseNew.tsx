import { useAppStore, LymphomaSubtype } from '@/store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Home, Plus, FileText, Trash2, UploadCloud } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function CaseNew() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    navigate('/');
  };

  // Use local state for immediate feedback, sync to global store
  const [complaint, setComplaint] = useState(draft?.chiefComplaint || '');
  const [subtype, setSubtype] = useState<LymphomaSubtype>(draft?.subtype || '');
  const [staging, setStaging] = useState(draft?.annArborStaging || '');
  const [attachments, setAttachments] = useState(draft?.attachments || []);

  const STAGES = ['I', 'II', 'III', 'IV'];

  // Silent auto-save simulation
  const handleSave = (field: string, value: any) => {
    updateDraft({ [field]: value });
  };

  const isFormValid = complaint.trim().length > 0 || subtype !== '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAttachment = { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + 'MB' };
      const newDocs = [...attachments, newAttachment];
      setAttachments(newDocs);
      handleSave('attachments', newDocs);
    }
  };

  const removeAttachment = (index: number) => {
    const newDocs = attachments.filter((_, i) => i !== index);
    setAttachments(newDocs);
    handleSave('attachments', newDocs);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 pb-[80px]">
      {/* Header */}
      <header className="px-4 py-3 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-1 -ml-1 active:bg-neutral-100 rounded-full text-neutral-900">
          <ChevronLeft className="w-6 h-6" />
        </button>
          <h1 className="font-semibold text-lg text-neutral-900">新建病例</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 -mr-2 rounded-full text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
          aria-label="回到首页"
          title="回到首页"
        >
          <Home className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        
        {/* Step 1: Chief Complaint */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">1</span>
            基础与主诉
          </h2>
          <textarea 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm min-h-[120px] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            placeholder="请简要描述患者情况或您的临床问题（如：60岁男性，无痛性淋巴结肿大…）"
            value={complaint}
            onChange={(e) => {
              setComplaint(e.target.value);
              handleSave('chiefComplaint', e.target.value);
            }}
          />
        </div>

        {/* Step 2: Pathology & Staging */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">2</span>
            病理与分期
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-2">淋巴瘤亚型</label>
              <select 
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                value={subtype}
                onChange={(e) => {
                  setSubtype(e.target.value as LymphomaSubtype);
                  handleSave('subtype', e.target.value);
                }}
              >
                <option value="">请选择亚型</option>
                <option value="DLBCL">DLBCL (弥漫大B细胞淋巴瘤)</option>
                <option value="FL">FL (滤泡性淋巴瘤)</option>
                <option value="MCL">MCL (套细胞淋巴瘤)</option>
                <option value="Other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-2">Ann Arbor 分期</label>
              <div className="flex gap-2">
                {STAGES.map(s => (
                  <label 
                    key={s} 
                    className={cn(
                      "flex-1 py-2 text-center rounded-lg border text-sm font-medium transition-colors cursor-pointer",
                      staging === s 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                        : "bg-neutral-50 border-neutral-200 text-neutral-600"
                  )}>
                    <input 
                      type="radio" 
                      name="staging" 
                      className="hidden" 
                      checked={staging === s}
                      onChange={() => {
                        setStaging(s);
                        handleSave('annArborStaging', s);
                      }}
                    />
                    {s} 期
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Linkage Logic */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {subtype === 'DLBCL' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 space-y-3">
                      <p className="text-xs font-semibold text-emerald-800">IPI 评分相关字段</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="年龄 (>60?)" className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2" />
                        <input type="text" placeholder="LDH" className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2" />
                        <input type="text" placeholder="ECOG (≥2?)" className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2" />
                        <input type="number" placeholder="结外受累数目" className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2" />
                      </div>
                    </div>
                  </motion.div>
                )}
                {subtype === 'FL' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-3">
                      <p className="text-xs font-semibold text-blue-800">FLIPI 评分相关字段</p>
                      <p className="text-[10px] text-blue-600/80">包含年龄、分期、血红蛋白、淋巴结区数、LDH...</p>
                      {/* Mocekd fields */}
                    </div>
                  </motion.div>
                )}
                {(subtype === 'Other') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      当前亚型暂无预设评分模型，请在主诉中手动描述。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Step 3: Attachments */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">3</span>
            附件上传
          </h2>
          
          <div className="space-y-3 mt-4">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-neutral-700 truncate">{file.name}</span>
                  <span className="text-xs text-neutral-400 shrink-0">({file.size})</span>
                </div>
                <button onClick={() => removeAttachment(idx)} className="p-2 -mr-2 text-red-500 active:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full mt-3 h-20 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 flex flex-col items-center justify-center gap-1 active:bg-neutral-100 transition-colors"
          >
            <UploadCloud className="w-5 h-5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-500">点击上传病历、报告</span>
          </button>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <p className="text-[10px] text-neutral-400 mt-2 text-center">
            *当前版本附件仅作存档，暂不参与内容分析*
          </p>
        </div>

      </main>

      {/* Bottom Action */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100 z-10 pb-safe">
        <button 
          disabled={!isFormValid}
          onClick={() => navigate('/case/confirm')}
          className="w-full bg-emerald-600 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold py-3.5 rounded-xl transition-colors active:bg-emerald-700"
        >
          下一步：确认病例事实
        </button>
      </div>
    </div>
  );
}
