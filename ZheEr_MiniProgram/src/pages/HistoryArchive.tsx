import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Search, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export default function HistoryArchive() {
  const navigate = useNavigate();
  const { history, removeHistory, updateHistoryTitle } = useAppStore();
  const [search, setSearch] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredHistory = history.filter(h => 
    h.title.includes(search) || (h.subtype && h.subtype.includes(search))
  );

  const startRename = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleRename = () => {
    if (editingId && editTitle.trim()) {
      updateHistoryTitle(editingId, editTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 overflow-hidden relative">
      <header className="px-4 py-3 bg-white flex items-center justify-between border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-neutral-900 active:bg-neutral-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg text-neutral-900">历史记录</h1>
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

      <div className="p-4 shrink-0 bg-white shadow-sm shadow-neutral-100/50">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索亚型、标签 (不含涉密信息)"
            className="w-full bg-neutral-100 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto w-full">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-neutral-400 text-sm">
            暂无匹配记录
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredHistory.map(item => (
              <div key={item.id} className="bg-white border-b border-neutral-100">
                <div className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => navigate('/case/result')}
                    className="flex-1 min-w-0 flex items-center gap-3 text-left"
                  >
                    <div
                      className={cn(
                        'px-2 py-1 text-[10px] font-bold rounded-md shrink-0',
                        item.subtype === 'DLBCL' && 'bg-emerald-100 text-emerald-800',
                        item.subtype === 'FL' && 'bg-blue-100 text-blue-800',
                        item.subtype === 'MCL' && 'bg-purple-100 text-purple-800',
                        item.subtype === 'Other' && 'bg-neutral-100 text-neutral-800',
                      )}
                    >
                      {item.subtype || '未知'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-neutral-900 truncate flex items-center gap-2">
                        {item.title}
                        {item.status === 'analyzing' && (
                          <span className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 truncate">{item.updatedAt}</div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startRename(item.id, item.title)}
                      className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
                      aria-label="重命名"
                      title="重命名"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确认删除该记录及关联附件？')) {
                          removeHistory(item.id);
                        }
                      }}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100"
                      aria-label="删除"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rename Modal */}
      <AnimatePresence>
        {editingId && (
          <>
             <motion.div className="fixed inset-0 bg-neutral-900/40 z-40" onClick={() => setEditingId(null)} />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] bg-white p-5 rounded-2xl z-50">
               <h3 className="font-semibold text-neutral-900 mb-4">修改会话标题</h3>
               <input 
                  autoFocus
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2.5 text-sm mb-6 focus:border-emerald-500 focus:outline-none"
               />
               <div className="flex gap-2 justify-end">
                 <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-neutral-500 bg-neutral-100 rounded-lg">取消</button>
                 <button onClick={handleRename} className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg">保存</button>
               </div>
             </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
