import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NormRect } from '@/lib/citationRegistry';
import { CITATION_LABELS, CITATION_MAP, getBuiltinPdfBlob } from '@/lib/citationRegistry';
import { useKnowledge } from './KnowledgeContext';
import { useLanguage } from '@/lib/i18n';

export type CitationViewerState = {
  open: boolean;
  title: string;
  page: number;
  rect: NormRect;
  pdfBlob: Blob | null;
};

const defaultState: CitationViewerState = {
  open: false,
  title: '',
  page: 1,
  rect: { x: 0.05, y: 0.15, w: 0.9, h: 0.1 },
  pdfBlob: null,
};

interface CitationContextValue {
  viewer: CitationViewerState;
  openBuiltinCitation: (citationKey: string) => void;
  openUserPdfCitation: (entryId: string) => void;
  closeViewer: () => void;
}

const CitationContext = createContext<CitationContextValue | undefined>(undefined);

export function CitationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const { getPdfBlob, entries } = useKnowledge();
  const [viewer, setViewer] = useState<CitationViewerState>(defaultState);

  const openBuiltinCitation = useCallback(
    (citationKey: string) => {
      const meta = CITATION_MAP[citationKey];
      const labels = CITATION_LABELS[citationKey];
      const blob = getBuiltinPdfBlob(meta?.builtinKey ?? citationKey);
      const title = labels ? (language === 'zh' ? labels.zh : labels.en) : citationKey;
      setViewer({
        open: true,
        title,
        page: meta?.page ?? 1,
        rect: meta?.rect ?? { x: 0.08, y: 0.18, w: 0.84, h: 0.12 },
        pdfBlob: blob,
      });
    },
    [language]
  );

  const openUserPdfCitation = useCallback(
    (entryId: string) => {
      const blob = getPdfBlob(entryId);
      if (!blob) return;
      const entry = entries.find((e) => e.id === entryId);
      setViewer({
        open: true,
        title: entry?.title ?? entryId,
        page: 1,
        rect: { x: 0.06, y: 0.72, w: 0.88, h: 0.12 },
        pdfBlob: blob,
      });
    },
    [getPdfBlob, entries]
  );

  const closeViewer = useCallback(() => {
    setViewer({ ...defaultState, open: false });
  }, []);

  const value = useMemo(
    () => ({ viewer, openBuiltinCitation, openUserPdfCitation, closeViewer }),
    [viewer, openBuiltinCitation, openUserPdfCitation, closeViewer]
  );

  return <CitationContext.Provider value={value}>{children}</CitationContext.Provider>;
}

export function useCitation() {
  const ctx = useContext(CitationContext);
  if (!ctx) throw new Error('useCitation must be used within CitationProvider');
  return ctx;
}
