import { createDemoCitationPdf } from './demoPdf';

export type NormRect = { x: number; y: number; w: number; h: number };

export type CitationMeta = {
  /** Built-in key passed to createDemoCitationPdf */
  builtinKey: string;
  page: number;
  rect: NormRect;
};

/** Normalized rectangles tuned to demoPdf layouts (top-left origin, 0–1). */
export const CITATION_LABELS: Record<string, { zh: string; en: string }> = {
  'cfr-314-50a': { zh: '21 CFR 314.50(a)', en: '21 CFR 314.50(a)' },
  'fdca-306k': { zh: 'FD&C Act 306(k)(1)', en: 'FD&C Act 306(k)(1)' },
  'cfr-part-54': { zh: '21 CFR Part 54', en: '21 CFR Part 54' },
  'bimo-guidance': { zh: 'FDA BIMO Guidance', en: 'FDA BIMO Guidance' },
  'fda-effectiveness-guidance': { zh: 'FDA 有效性临床证据指南', en: 'FDA Clinical Evidence Guidance' },
  'fda-oncology-endpoints': { zh: 'FDA 肿瘤学终点指南', en: 'FDA Oncology Endpoints Guidance' },
  'ich-e5': { zh: 'ICH E5(R1)', en: 'ICH E5(R1)' },
  'ich-e9': { zh: 'ICH E9', en: 'ICH E9' },
};

export const CITATION_MAP: Record<string, CitationMeta> = {
  'cfr-314-50a': { builtinKey: 'cfr-314-50a', page: 1, rect: { x: 0.08, y: 0.18, w: 0.84, h: 0.12 } },
  'fdca-306k': { builtinKey: 'fdca-306k', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.1 } },
  'cfr-part-54': { builtinKey: 'cfr-part-54', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.1 } },
  'bimo-guidance': { builtinKey: 'bimo-guidance', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.1 } },
  'fda-effectiveness-guidance': { builtinKey: 'fda-effectiveness-guidance', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.12 } },
  'fda-oncology-endpoints': { builtinKey: 'fda-oncology-endpoints', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.12 } },
  'ich-e5': { builtinKey: 'ich-e5', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.1 } },
  'ich-e9': { builtinKey: 'ich-e9', page: 1, rect: { x: 0.08, y: 0.2, w: 0.84, h: 0.1 } },
};

export function getBuiltinPdfBlob(key: string): Blob {
  const meta = CITATION_MAP[key];
  const k = meta?.builtinKey ?? key;
  return createDemoCitationPdf(k);
}
