import { useAppStore } from '@/store';
import { ChevronRight, FilePlus2, UserCircle, HomeIcon, User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const draft = useAppStore(state => state.draft);
  const history = useAppStore(state => state.history);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for history
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 pb-[80px]">
      {/* Top Navigation Bar */}
      <header className="px-4 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h1 className="font-semibold text-lg text-neutral-900 tracking-tight">淋结通</h1>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <UserCircle className="w-4 h-4" />
          <span>张医生 (主治)</span>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-6 overflow-y-auto w-full">
        {/* Uncompleted Case Banner */}
        {draft && (
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/case/new')}
            className="w-full mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl flex items-center justify-between shadow-sm"
          >
            <span className="text-sm font-medium">您有1个未完成的病例 [{draft.subtype || '未选择'}待确认]</span>
            <ChevronRight className="w-4 h-4 text-yellow-600" />
          </motion.button>
        )}

        {/* Main Action Button */}
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/case/new')}
          className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-md shadow-emerald-600/20 mb-8"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg">新建病例分析</span>
        </motion.button>

        {/* Recent History */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">最近历史</h2>
          <button 
            onClick={() => navigate('/history')}
            className="text-xs text-neutral-500 font-medium px-2 py-1 rounded-md hover:bg-neutral-100"
          >
            查看全部
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-neutral-100 flex items-center gap-3 animate-pulse">
                <div className="w-12 h-6 bg-neutral-200 rounded-md shrink-0"></div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                </div>
                <div className="w-4 h-4 rounded bg-neutral-200 shrink-0"></div>
              </div>
            ))
          ) : history.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-neutral-100 border-dashed">
              <div className="w-24 h-24 mb-4 bg-neutral-50 rounded-full flex items-center justify-center">
                <FilePlus2 className="w-8 h-8 text-neutral-300" />
              </div>
              <p className="text-sm text-neutral-500">暂无历史病例，点击上方按钮开始</p>
            </div>
          ) : (
            // History List
            history.map((item) => (
              <button 
                key={item.id}
                onClick={() => navigate('/case/result')}
                className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3 active:bg-neutral-50 text-left transition-colors"
              >
                <div className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded-md shrink-0",
                  item.subtype === 'DLBCL' && "bg-emerald-100 text-emerald-800",
                  item.subtype === 'FL' && "bg-blue-100 text-blue-800",
                  item.subtype === 'MCL' && "bg-purple-100 text-purple-800",
                  item.subtype === 'Other' && "bg-neutral-100 text-neutral-800"
                )}>
                  {item.subtype || '未知'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-neutral-900 truncate flex items-center gap-2">
                    {item.title}
                    {item.status === 'analyzing' && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">{item.updatedAt}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>
            ))
          )}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 inset-x-0 h-[64px] bg-white border-t border-neutral-200 flex px-2 pb-safe z-10">
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-emerald-600">
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-neutral-400">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </div>
    </div>
  );
}
