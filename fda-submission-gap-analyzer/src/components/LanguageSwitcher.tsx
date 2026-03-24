import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-sm shadow-md rounded-full px-4"
    >
      <Languages className="w-4 h-4 mr-2" />
      {language === 'zh' ? 'English' : '中文'}
    </Button>
  );
}
