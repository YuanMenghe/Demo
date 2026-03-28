import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function SettingsDialog({ open, onOpenChange }: Props) {
  const { t, language, setLanguage } = useLanguage();
  const { userName, logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('设置', 'Settings')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-slate-900 mb-2">{t('界面语言', 'Language')}</div>
            <div className="flex gap-2">
              <Button size="sm" variant={language === 'zh' ? 'default' : 'outline'} onClick={() => setLanguage('zh')}>
                中文
              </Button>
              <Button size="sm" variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>
                English
              </Button>
            </div>
          </div>
          {userName && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-slate-600">{t('当前用户', 'Signed in as')}</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                {t('退出登录', 'Sign out')}
              </Button>
            </div>
          )}
          <p className="text-xs text-slate-400">
            {t('知识库与登录状态保存在浏览器本地存储。', 'Knowledge base and sign-in are stored in localStorage.')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
