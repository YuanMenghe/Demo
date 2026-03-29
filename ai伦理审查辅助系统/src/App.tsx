import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Projects from './pages/Projects';
import PolicyLibrary from './pages/PolicyLibrary';
import Checklists from './pages/Checklists';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  const [currentView, setCurrentView] = useState('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateTo = (view: string, projectId?: string) => {
    setCurrentView(view);
    if (projectId) {
      setSelectedProjectId(projectId);
    } else {
      setSelectedProjectId(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar currentView={currentView} navigateTo={navigateTo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'projects' && <Projects navigateTo={navigateTo} />}
          {currentView === 'project-detail' && selectedProjectId && <ProjectDetail projectId={selectedProjectId} navigateTo={navigateTo} />}
          {currentView === 'policies' && <PolicyLibrary />}
          {currentView === 'checklists' && <Checklists />}
        </main>
      </div>
    </div>
  );
}
