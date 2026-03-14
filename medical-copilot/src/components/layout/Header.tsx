import React from 'react';
import { Bot, User, LogOut, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { SupportedLocale } from '@/i18n';

export function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { nameKey: 'nav.hcpInsights' as const, path: '/' },
    { nameKey: 'nav.recommendationExpand' as const, path: '/recommendation' },
    { nameKey: 'nav.contentStudio' as const, path: '/studio' },
  ];

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const toggleLang = () => {
    const next: SupportedLocale = currentLang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-medical-teal-700 font-semibold text-lg">
          <Bot className="w-6 h-6" />
          <span>{t('nav.appName')}</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-medical-teal-50 text-medical-teal-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {t(item.nameKey)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleLang}
          className="px-2.5 py-1 rounded-md text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          title={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          {currentLang === 'zh' ? 'EN' : '中文'}
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <User className="w-4 h-4" />
          <span>{t('header.switchUser')}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <Info className="w-4 h-4" />
          <span>{t('header.learnMore')}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <LogOut className="w-4 h-4" />
          <span>{t('header.logout')}</span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-700 font-medium text-xs">
            SR
          </div>
          <span className="text-sm font-medium text-slate-700">Sonja Rivera</span>
        </div>
      </div>
    </header>
  );
}
