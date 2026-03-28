import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProjectList from './components/ProjectList';
import ProjectWorkspace from './components/ProjectWorkspace';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import AppSidebar from './components/AppSidebar';
import LoginDialog from './components/LoginDialog';
import SettingsDialog from './components/SettingsDialog';
import PdfSourceViewer from './components/PdfSourceViewer';
import { LanguageProvider } from '@/lib/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import { AuthProvider } from '@/contexts/AuthContext';
import { KnowledgeProvider } from '@/contexts/KnowledgeContext';
import { CitationProvider } from '@/contexts/CitationContext';

export default function App() {
  const [mainRoute, setMainRoute] = useState<'projects' | 'knowledge'>('projects');
  const [appState, setAppState] = useState<'projects' | 'workspace'>('projects');
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [projects, setProjects] = useState<any[]>([
    {
      id: '1',
      name: 'Project Alpha - NSCLC',
      type: 'NDA',
      indication: 'Non-Small Cell Lung Cancer',
      lastUpdated: '2026-03-23',
      docCount: 12,
      status: 'analyzed',
    },
    {
      id: '2',
      name: 'Project Beta - Breast Cancer',
      type: 'BLA',
      indication: 'HER2+ Breast Cancer',
      lastUpdated: '2026-03-20',
      docCount: 5,
      status: 'pending',
    },
    {
      id: '3',
      name: 'Project Gamma - Leukemia',
      type: 'IND',
      indication: 'Acute Myeloid Leukemia',
      lastUpdated: '2026-03-15',
      docCount: 8,
      status: 'analyzed',
    },
  ]);

  const handleSelectProject = (project: any) => {
    setCurrentProject(project);
    setAppState('workspace');
    setMainRoute('projects');
  };

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: 'New Project',
      type: 'NDA',
      indication: 'TBD',
      lastUpdated: new Date().toISOString().split('T')[0],
      docCount: 0,
      status: 'pending',
    };
    setCurrentProject(newProject);
    setAppState('workspace');
    setMainRoute('projects');
  };

  const handleUpdateProject = (updatedProject: any) => {
    setCurrentProject(updatedProject);
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === updatedProject.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProject.id ? updatedProject : p));
      }
      return [updatedProject, ...prev];
    });
  };

  const handleBackToProjects = () => {
    setAppState('projects');
    setCurrentProject(null);
  };

  const handleSidebarNavigate = (r: 'projects' | 'knowledge') => {
    setMainRoute(r);
    if (r === 'projects') {
      setAppState('projects');
      setCurrentProject(null);
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <KnowledgeProvider>
          <CitationProvider>
            <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
              <AppSidebar
                route={mainRoute}
                onNavigate={handleSidebarNavigate}
                onOpenLogin={() => setLoginOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
              />
              <div className="flex-1 min-w-0 relative">
                <LanguageSwitcher />
                <AnimatePresence mode="wait">
                  {mainRoute === 'knowledge' && (
                    <motion.div
                      key="knowledge"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <KnowledgeBaseView />
                    </motion.div>
                  )}
                  {mainRoute === 'projects' && appState === 'projects' && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProjectList projects={projects} onSelectProject={handleSelectProject} onCreateProject={handleCreateProject} />
                    </motion.div>
                  )}
                  {mainRoute === 'projects' && appState === 'workspace' && (
                    <motion.div
                      key="workspace"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProjectWorkspace project={currentProject} onBack={handleBackToProjects} onUpdateProject={handleUpdateProject} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <PdfSourceViewer />
            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
          </CitationProvider>
        </KnowledgeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
