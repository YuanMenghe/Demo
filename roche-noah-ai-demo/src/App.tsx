import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TutorWorkspace } from "./components/tutor/TutorWorkspace";
import { IITWorkspace } from "./components/iit/IITWorkspace";
import { UserProfile } from "./components/profile/UserProfile";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ExternalLink, Menu } from "lucide-react";

const MODULE_TITLES: Record<string, string> = {
  home: '首页',
  talent: '1. 科研人才培养',
  profile: '1.1 学习画像',
  thesis: '2. 综述辅助写作',
  iit: '3. IIT全流程场景',
  admin: '4. Insight洞见分析',
};

export default function App() {
  const [currentModule, setCurrentModule] = useState<'home' | 'talent' | 'profile' | 'thesis' | 'iit' | 'admin'>('talent');
  const [navOpen, setNavOpen] = useState(false);

  const thesisUrl = import.meta.env.VITE_THESIS_URL || "https://test.roche.noahai.co/workflow/thesis-generator";

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 antialiased overflow-hidden">
      <Sidebar
        currentModule={currentModule}
        onNavigate={(module) => setCurrentModule(module as any)}
        mobileOpen={navOpen}
        onMobileClose={() => setNavOpen(false)}
      />
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden bg-white">
        {/* 移动端顶部栏：汉堡按钮 + 模块标题 */}
        <header className="md:hidden h-12 border-b border-gray-100 flex items-center px-2 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-700 active:bg-gray-100"
            aria-label="打开导航"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 ml-1 min-w-0">
            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0">
              N
            </div>
            <span className="font-medium text-sm text-gray-900 truncate">
              {MODULE_TITLES[currentModule] ?? '若生 NOAH AI'}
            </span>
          </div>
        </header>
        <main className="flex-1 h-full w-full overflow-hidden flex flex-col items-center justify-center bg-slate-50">
          {currentModule === 'talent' && <TutorWorkspace onNavigateToModule2={() => setCurrentModule('thesis')} />}
          {currentModule === 'profile' && <UserProfile />}
          {currentModule === 'thesis' && (
            <div className="w-full h-full flex flex-col">
              <div className="bg-indigo-50 border-b border-indigo-100 p-2.5 text-center text-sm text-indigo-800 flex justify-center items-center gap-4 shrink-0">
                <span>正为您嵌入 NOAH 的综述辅助写作模块...</span>
                <a 
                  href={thesisUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm font-medium"
                >
                  如果您遇到登录或跨域显示问题，请直接点此在新窗口打开 <ExternalLink size={14} />
                </a>
              </div>
              <iframe 
                src={thesisUrl} 
                className="w-full flex-1 border-none bg-white"
                title="Thesis Generator Workflow"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              ></iframe>
            </div>
          )}
          {currentModule === 'iit' && <IITWorkspace />}
          {currentModule === 'admin' && <AdminDashboard />}
          {currentModule !== 'talent' && currentModule !== 'profile' && currentModule !== 'thesis' && currentModule !== 'iit' && currentModule !== 'admin' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-xl font-medium mb-2">正在建设中</span>
              <span className="text-sm">该模块的演示即将上线</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
