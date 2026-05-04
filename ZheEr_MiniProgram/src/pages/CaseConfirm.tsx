import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Info, Edit3, X, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface FactField {
  id: string;
  label: string;
  value: string;
  status: 'extracted' | 'manual' | 'missing';
}

export default function CaseConfirm() {
  const navigate = useNavigate();
  const draft = useAppStore(state => state.draft);

  const goBack = () => {
    const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };
  
  // Mock facts based on draft
  const [facts, setFacts] = useState<FactField[]>([
    { id: '1', label: '主要症状', value: draft?.chiefComplaint || '肿块', status: draft?.chiefComplaint ? 'manual' : 'missing' },
    { id: '2', label: '淋巴瘤亚型', value: draft?.subtype || '', status: draft?.subtype ? 'manual' : 'missing' },
    { id: '3', label: 'Ann Arbor 分期', value: draft?.annArborStaging ? `${draft.annArborStaging}期` : '', status: draft?.annArborStaging ? 'manual' : 'missing' },
    { id: '4', label: 'LDH (乳酸脱氢酶)', value: '', status: 'missing' },
    { id: '5', label: 'IPI 评分', value: '3分 (高危)', status: 'extracted' },
  ]);

  const [editingFact, setEditingFact] = useState<FactField | null>(null);
  const [editValue, setEditValue] = useState('');
  const [supplementary, setSupplementary] = useState('');

  const hasMissing = facts.some(f => f.status === 'missing');

  const handleEditClick = (fact: FactField) => {
    setEditingFact(fact);
    setEditValue(fact.value);
  };

  const saveEdit = () => {
    if (!editingFact) return;
    setFacts(facts.map(f => f.id === editingFact.id ? { ...f, value: editValue, status: 'manual' } : f));
    setEditingFact(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 pb-[130px]">
      <header className="px-4 py-3 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-1 -ml-1 active:bg-neutral-100 rounded-full text-neutral-900">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold text-lg text-neutral-900 leading-tight">确认病例事实</h1>
            <p className="text-[10px] text-neutral-500">基于主诉提取，请核对准确性</p>
          </div>
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

      <main className="flex-1 p-4 overflow-y-auto space-y-3">
        {facts.map((fact) => (
          <button 
            key={fact.id}
            onClick={() => handleEditClick(fact)}
            className={cn(
              "w-full text-left p-4 rounded-xl border shadow-sm relative overflow-hidden transition-all active:scale-[0.99]",
              fact.status === 'missing' 
                ? "bg-amber-50 border-amber-200" 
                : "bg-white border-neutral-200"
            )}
          >
            {fact.status !== 'missing' && (
              <div className={cn(
                "absolute top-0 right-0 px-2 py-0.5 text-[9px] font-medium rounded-bl-lg shrink-0",
                fact.status === 'extracted' ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"
              )}>
                {fact.status === 'extracted' ? '系统提取' : '手动输入'}
              </div>
            )}
            
            <div className="flex items-start gap-2 pt-1">
              {fact.status === 'missing' && (
                <div className="mt-0.5 shrink-0 bg-amber-400 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">!</div>
              )}
              <div className="flex-1">
                <div className="text-xs font-semibold text-neutral-500 mb-1">{fact.label}</div>
                <div className={cn(
                  "text-sm font-medium",
                  fact.status === 'missing' ? "text-amber-700/80 italic" : "text-neutral-900"
                )}>
                  {fact.status === 'missing' ? '未填写' : fact.value}
                </div>
              </div>
              <Edit3 className="w-4 h-4 text-neutral-300 shrink-0 self-center" />
            </div>
          </button>
        ))}
      </main>

      {/* Editing Bottom Sheet */}
      <AnimatePresence>
        {editingFact && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/40 z-40"
              onClick={() => setEditingFact(null)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">修改: {editingFact.label}</h3>
                <button onClick={() => setEditingFact(null)} className="p-1 bg-neutral-100 rounded-full text-neutral-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="h-[200px]">
                 {/* Provide general text input for demo */}
                 <textarea 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm h-32 focus:outline-none focus:border-emerald-500 resize-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="请输入..."
                    autoFocus
                 />
              </div>

              <div className="pt-2 pb-safe">
                <button 
                  onClick={saveEdit}
                  className="w-full bg-neutral-900 text-white font-semibold py-3.5 rounded-xl border border-neutral-900"
                >
                  确认修改
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Fixed Area */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-neutral-100 p-3 pt-3 z-10 pb-safe">
        <input 
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 mb-3"
          placeholder="补充其他文字信息…"
          value={supplementary}
          onChange={(e) => setSupplementary(e.target.value)}
        />
        <button 
          onClick={() => navigate('/case/result')}
          className={cn(
            "w-full text-white font-semibold py-3.5 rounded-xl transition-colors",
            hasMissing ? "bg-amber-600 active:bg-amber-700" : "bg-emerald-600 active:bg-emerald-700"
          )}
        >
          {hasMissing ? "存在信息缺失，继续分析" : "提交分析"}
        </button>
      </div>
    </div>
  );
}
