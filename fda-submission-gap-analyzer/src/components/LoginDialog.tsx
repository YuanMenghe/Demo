import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/lib/i18n';

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function LoginDialog({ open, onOpenChange }: Props) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [name, setName] = useState('');

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    login(n);
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('登录（演示）', 'Sign in (demo)')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500">
          {t('输入显示名称即可，数据仅保存在本机浏览器。', 'Enter a display name; data stays in this browser only.')}
        </p>
        <Input
          placeholder={t('用户名', 'User name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={submit} disabled={!name.trim()}>
          {t('确认', 'OK')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
