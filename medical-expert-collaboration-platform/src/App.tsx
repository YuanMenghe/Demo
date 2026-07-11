import React, { useState } from 'react';
import { Briefcase, UserCheck, Calculator, ShoppingBag, ClipboardList, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TaskHall from './components/TaskHall';
import Certification from './components/Certification';
import QualityPricing from './components/QualityPricing';
import CustomerServices from './components/CustomerServices';
import MyTasks from './components/MyTasks';
import TaskHistory from './components/TaskHistory';
import TaskWorkspace from './components/TaskWorkspace';

const logoUrl = `${import.meta.env.BASE_URL}noah-logo-header.png`;

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const coreNavItems = [
    { id: 'tasks', label: '任务大厅', icon: Briefcase },
    { id: 'my_tasks', label: '我的任务', icon: ClipboardList },
    { id: 'history', label: '结算记录', icon: Wallet },
    { id: 'cert', label: '资质认证', icon: UserCheck },
    { id: 'pricing', label: '计价规则', icon: Calculator },
  ];

  const previewNavItems = [
    { id: 'services', label: 'C端服务', icon: ShoppingBag },
  ];

  const handleProcessTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setActiveTab('workspace');
  };

  const handleBackFromWorkspace = () => {
    setActiveTaskId(null);
    setActiveTab('my_tasks');
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (id !== 'workspace') {
      setActiveTaskId(null);
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden font-sans">
      <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 md:px-8 shrink-0 shadow-sm shadow-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="NOAH AI"
            className="h-8 w-auto object-contain"
            draggable={false}
          />
          <span className="hidden sm:inline-block px-2.5 py-1 bg-noah-50 text-noah-700 text-xs font-medium rounded-md border border-noah-100">
            医学专家平台
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-noah-500 animate-pulse" />
          平台运行正常
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-white border-r border-slate-200/80 p-4 hidden md:flex flex-col gap-1 shrink-0">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            专家工作台
          </div>
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm ${
                  isActive
                    ? 'bg-noah-50 text-noah-700 font-semibold shadow-sm shadow-noah-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-noah-600' : ''} />
                {item.label}
              </button>
            );
          })}

          <div className="px-3 pt-4 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            参考预览
          </div>
          {previewNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm border border-dashed ${
                  isActive
                    ? 'bg-amber-50/80 text-amber-900 font-semibold border-amber-200'
                    : 'text-slate-500 hover:bg-slate-50 border-slate-200 hover:text-slate-700'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-amber-600' : ''} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200/80">
                  示意
                </span>
              </button>
            );
          })}

          <div className="mt-auto flex flex-col gap-4">
            <div className="px-4 py-4 bg-gradient-to-br from-slate-50 to-noah-50/30 rounded-xl border border-slate-200/80">
              <p className="text-xs text-slate-500 mb-2 font-medium">当前资质进度</p>
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-noah-500 to-noah-400 h-1.5 rounded-full w-[80%] transition-all duration-500" />
              </div>
              <p className="text-[10px] mt-2 text-slate-400">距离 S4 等级还需 12 个 C4 任务</p>
            </div>

            <div className="flex items-center gap-3 px-2 py-2 border-t border-slate-100 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-noah-100 to-noah-50 border border-noah-200/60 flex items-center justify-center text-noah-700 font-bold text-sm shrink-0">
                张
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate">Dr. 张三</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-slate-500 truncate">S3 副主任医师</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 flex overflow-x-auto no-scrollbar z-20 safe-area-pb">
          {[...coreNavItems, ...previewNavItems].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isPreview = item.id === 'services';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-w-[4.5rem] py-2.5 border-t-2 transition-colors relative ${
                  isActive
                    ? isPreview
                      ? 'border-amber-400 text-amber-700 font-medium'
                      : 'border-noah-500 text-noah-600 font-medium'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px]">{isPreview ? 'C端示意' : item.label}</span>
                {isPreview && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        <main className={`flex-1 overflow-y-auto pb-20 md:pb-6 ${activeTab === 'workspace' ? 'p-0' : activeTab === 'services' ? 'p-4 md:p-6' : 'p-4 md:p-8'}`}>
          <div className={activeTab === 'workspace' ? 'h-full' : activeTab === 'services' ? 'max-w-6xl mx-auto' : 'max-w-5xl mx-auto'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={activeTab === 'workspace' ? 'h-full' : ''}
              >
                {activeTab === 'tasks' && <TaskHall />}
                {activeTab === 'my_tasks' && <MyTasks onProcess={handleProcessTask} />}
                {activeTab === 'history' && <TaskHistory />}
                {activeTab === 'workspace' && activeTaskId && (
                  <TaskWorkspace taskId={activeTaskId} onBack={handleBackFromWorkspace} />
                )}
                {activeTab === 'cert' && <Certification />}
                {activeTab === 'pricing' && <QualityPricing />}
                {activeTab === 'services' && <CustomerServices />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
