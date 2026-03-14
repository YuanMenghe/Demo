import React from 'react';
import { FileText, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMockEvidence } from '@/data/mock';
import type { Locale } from '@/data/mock';
import { motion, AnimatePresence } from 'motion/react';

interface EvidencePanelProps {
  evidenceId: string | null;
  onClose: () => void;
}

function getLocaleFromLanguage(lang: string): Locale {
  return lang.startsWith('zh') ? 'zh' : 'en';
}

export function EvidencePanel({ evidenceId, onClose }: EvidencePanelProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);
  const evidenceMap = getMockEvidence(locale);
  const evidence = evidenceId ? evidenceMap[evidenceId] : null;

  return (
    <div className="w-80 border-l border-slate-200 bg-white h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-medical-teal-600" />
          {t('evidencePanel.title')}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {evidence ? (
            <motion.div
              key={evidence.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-medical-teal-50 text-medical-teal-700 border border-medical-teal-100">
                  {t(`evidenceType.${evidence.type}`)}
                </span>
                <h4 className="font-bold text-slate-900 leading-tight">
                  {evidence.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{evidence.date}</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &quot;{evidence.snippet}&quot;
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('evidencePanel.sourceMetadata')}</h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs">{t('evidencePanel.source')}</span>
                    <span className="font-medium text-slate-800">{evidence.source}</span>
                  </div>
                  {evidence.url && (
                    <a href="#" className="flex items-center gap-1 text-medical-teal-600 hover:underline text-xs">
                      {t('evidencePanel.viewOriginal')} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
              <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">{t('evidencePanel.emptyHint')}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
