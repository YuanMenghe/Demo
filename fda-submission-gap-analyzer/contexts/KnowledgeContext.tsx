import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type KnowledgeEntry = {
  id: string;
  title: string;
  createdAt: string;
  kind: 'text' | 'pdf';
  textContent?: string;
  /** Base64 for small PDFs only (demo persistence) */
  pdfDataBase64?: string;
  pdfName?: string;
};

const STORAGE_KEY = 'fda-gap-knowledge-v1';

function loadInitial(): KnowledgeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as KnowledgeEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  addTextEntry: (title: string, text: string) => void;
  addPdfEntry: (file: File) => Promise<void>;
  removeEntry: (id: string) => void;
  getPdfBlob: (id: string) => Blob | null;
}

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export function KnowledgeProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* quota */
    }
  }, [entries]);

  const getPdfBlob = useCallback((id: string) => {
    const e = entries.find((x) => x.id === id);
    if (!e || e.kind !== 'pdf' || !e.pdfDataBase64) return null;
    const bin = atob(e.pdfDataBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: 'application/pdf' });
  }, [entries]);

  const addTextEntry = useCallback((title: string, text: string) => {
    const id = `k-${Date.now()}`;
    setEntries((prev) => [
      {
        id,
        title: title.trim() || 'Note',
        createdAt: new Date().toISOString(),
        kind: 'text',
        textContent: text,
      },
      ...prev,
    ]);
  }, []);

  const addPdfEntry = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    if (buf.byteLength > 900_000) {
      throw new Error('FILE_TOO_LARGE');
    }
    let base64 = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      base64 += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    base64 = btoa(base64);
    const id = `k-${Date.now()}`;
    setEntries((prev) => [
      {
        id,
        title: file.name,
        createdAt: new Date().toISOString(),
        kind: 'pdf',
        pdfName: file.name,
        pdfDataBase64: base64,
      },
      ...prev,
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(
    () => ({ entries, addTextEntry, addPdfEntry, removeEntry, getPdfBlob }),
    [entries, addTextEntry, addPdfEntry, removeEntry, getPdfBlob]
  );

  return <KnowledgeContext.Provider value={value}>{children}</KnowledgeContext.Provider>;
}

export function useKnowledge() {
  const ctx = useContext(KnowledgeContext);
  if (!ctx) throw new Error('useKnowledge must be used within KnowledgeProvider');
  return ctx;
}
