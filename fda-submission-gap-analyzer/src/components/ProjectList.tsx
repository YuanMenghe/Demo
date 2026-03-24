import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, Plus, Clock, FileText, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface Project {
  id: string;
  name: string;
  type: string;
  indication: string;
  lastUpdated: string;
  docCount: number;
  status: 'analyzed' | 'pending';
}

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
}

export default function ProjectList({ projects, onSelectProject, onCreateProject }: ProjectListProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('项目管理', 'Project Management')}</h1>
            <p className="text-slate-500 mt-2">{t('管理您的 FDA 申报分析项目，支持增量上传和持续审查。', 'Manage your FDA submission analysis projects, supporting incremental uploads and continuous review.')}</p>
          </div>
          <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('新建项目', 'New Project')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-md transition-all border-slate-200 hover:border-blue-300 group"
              onClick={() => onSelectProject(project)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    project.status === 'analyzed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {project.status === 'analyzed' ? t('已分析', 'Analyzed') : t('待分析', 'Pending')}
                  </span>
                </div>
                <CardTitle className="mt-4 text-lg">{project.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" /> {project.type} - {project.indication}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {project.docCount} {t('个文档', 'Docs')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {project.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
