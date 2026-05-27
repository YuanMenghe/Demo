import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type KnowledgeEntry = {
  id: string;
  title: string;
  createdAt: string;
  kind: 'text' | 'pdf' | 'docx' | 'csv';
  textContent?: string;
  /** Base64 for small files only (demo persistence). */
  fileDataBase64?: string;
  fileName?: string;
  /** Backward-compat fields (kept for old localStorage). */
  pdfDataBase64?: string;
  pdfName?: string;
};

const STORAGE_KEY = 'fda-gap-knowledge-v1';

function loadInitial(): KnowledgeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as KnowledgeEntry[];
    if (!Array.isArray(parsed)) return [];
    // migrate older PDF fields to unified file fields
    return parsed.map((e) => {
      if (e.kind === 'pdf') {
        return {
          ...e,
          fileName: e.fileName ?? e.pdfName ?? e.title,
          fileDataBase64: e.fileDataBase64 ?? e.pdfDataBase64,
        };
      }
      return e;
    });
  } catch {
    return [];
  }
}

interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  addTextEntry: (title: string, text: string) => void;
  addFileEntry: (file: File) => Promise<void>;
  removeEntry: (id: string) => void;
  getPdfBlob: (id: string) => Blob | null;
  getFileBlob: (id: string) => Blob | null;
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
    if (!e || e.kind !== 'pdf') return null;
    const base64 = e.fileDataBase64 ?? e.pdfDataBase64;
    if (!base64) return null;
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: 'application/pdf' });
  }, [entries]);

  const getFileBlob = useCallback(
    (id: string) => {
      const e = entries.find((x) => x.id === id);
      if (!e) return null;
      if (e.kind === 'csv' && typeof e.textContent === 'string') {
        return new Blob([e.textContent], { type: 'text/csv;charset=utf-8' });
      }
      if ((e.kind === 'pdf' || e.kind === 'docx') && (e.fileDataBase64 || e.pdfDataBase64)) {
        const base64 = e.fileDataBase64 ?? e.pdfDataBase64!;
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const type =
          e.kind === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        return new Blob([bytes], { type });
      }
      return null;
    },
    [entries]
  );

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

  const addFileEntry = useCallback(async (file: File) => {
    const name = file.name || 'file';
    const ext = name.split('.').pop()?.toLowerCase();
    const kind: KnowledgeEntry['kind'] =
      file.type === 'application/pdf' || ext === 'pdf'
        ? 'pdf'
        : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx'
          ? 'docx'
          : file.type === 'text/csv' || ext === 'csv'
            ? 'csv'
            : 'text';

    if (kind === 'text') throw new Error('UNSUPPORTED_TYPE');

    const buf = await file.arrayBuffer();
    if (buf.byteLength > 900_000) throw new Error('FILE_TOO_LARGE');

    const id = `k-${Date.now()}`;

    if (kind === 'csv') {
      const text = new TextDecoder('utf-8').decode(buf);
      setEntries((prev) => [
        { id, title: name, createdAt: new Date().toISOString(), kind, fileName: name, textContent: text },
        ...prev,
      ]);
      return;
    }

    let base64 = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      base64 += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    base64 = btoa(base64);
    setEntries((prev) => [
      { id, title: name, createdAt: new Date().toISOString(), kind, fileName: name, fileDataBase64: base64 },
      ...prev,
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(
    () => ({ entries, addTextEntry, addFileEntry, removeEntry, getPdfBlob, getFileBlob }),
    [entries, addTextEntry, addFileEntry, removeEntry, getPdfBlob, getFileBlob]
  );

  return <KnowledgeContext.Provider value={value}>{children}</KnowledgeContext.Provider>;
}

export function useKnowledge() {
  const ctx = useContext(KnowledgeContext);
  if (!ctx) throw new Error('useKnowledge must be used within KnowledgeProvider');
  return ctx;
}
