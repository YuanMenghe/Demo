import { FolderKanban, BookMarked, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

export type MainRoute = 'projects' | 'knowledge';

type Props = {
  route: MainRoute;
  onNavigate: (r: MainRoute) => void;
  onOpenLogin: () => void;
  onOpenSettings: () => void;
};

export default function AppSidebar({ route, onNavigate, onOpenLogin, onOpenSettings }: Props) {
  const { t } = useLanguage();
  const { userName } = useAuth();

  const navBtn = (r: MainRoute, icon: React.ReactNode, label: string) => (
    <Button
      variant={route === r ? 'secondary' : 'ghost'}
      className={`w-full justify-start gap-2 ${route === r ? 'bg-slate-100' : ''}`}
      onClick={() => onNavigate(r)}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  );

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="p-4 border-b border-slate-100">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('FDA 差距分析', 'FDA Gap Lab')}</div>
        <div className="text-sm font-bold text-slate-900 mt-1 truncate">{t('工作台', 'Workspace')}</div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navBtn('projects', <FolderKanban className="w-4 h-4 shrink-0" />, t('项目管理', 'Projects'))}
        {navBtn('knowledge', <BookMarked className="w-4 h-4 shrink-0" />, t('用户知识库', 'Knowledge base'))}
      </nav>
      <div className="p-3 border-t border-slate-100 space-y-2">
        {userName ? (
          <div className="text-xs text-slate-600 px-2 truncate" title={userName}>
            {t('用户', 'User')}: <span className="font-medium text-slate-900">{userName}</span>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={onOpenLogin}>
            <LogIn className="w-4 h-4" />
            {t('登录', 'Sign in')}
          </Button>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-slate-600" onClick={onOpenSettings}>
          <Settings className="w-4 h-4" />
          {t('设置', 'Settings')}
        </Button>
      </div>
    </aside>
  );
}
