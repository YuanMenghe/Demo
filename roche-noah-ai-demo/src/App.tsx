import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TutorWorkspace } from "./components/tutor/TutorWorkspace";
import { IITWorkspace } from "./components/iit/IITWorkspace";
import { UserProfile } from "./components/profile/UserProfile";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ExternalLink } from "lucide-react";

export default function App() {
  const [currentModule, setCurrentModule] = useState<'home' | 'talent' | 'profile' | 'thesis' | 'iit' | 'admin'>('talent');

  const thesisUrl = import.meta.env.VITE_THESIS_URL || "https://test.roche.noahai.co/workflow/thesis-generator";

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 antialiased overflow-hidden">
      <Sidebar currentModule={currentModule} onNavigate={(module) => setCurrentModule(module as any)} />
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden bg-white">
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
