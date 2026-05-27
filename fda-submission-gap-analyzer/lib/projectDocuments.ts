export type EctdModule = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export interface ProjectDocument {
  id: string;
  name: string;
  module: EctdModule;
  /** Subfolder within the module (eCTD section grouping) */
  folder: string;
  time: string;
  /** Logical document key across versions (same doc, different versions) */
  docKey: string;
  /** Human-friendly version label, e.g. v2 / 2026-03-23 */
  version: string;
  /** Sort key for comparing versions; larger means newer */
  versionSortKey: number;
}

export const MODULE_LABELS: Record<EctdModule, { zh: string; en: string }> = {
  M1: { zh: '模块 1 · 行政与法规信息', en: 'Module 1 · Administrative' },
  M2: { zh: '模块 2 · 综述与总结', en: 'Module 2 · Summaries' },
  M3: { zh: '模块 3 · 质量（CMC）', en: 'Module 3 · Quality (CMC)' },
  M4: { zh: '模块 4 · 非临床研究报告', en: 'Module 4 · Nonclinical' },
  M5: { zh: '模块 5 · 临床研究报告', en: 'Module 5 · Clinical' },
};

export const MODULE_ORDER: EctdModule[] = ['M1', 'M2', 'M3', 'M4', 'M5'];

export const DEFAULT_PROJECT_DOCUMENTS: ProjectDocument[] = [
  createProjectDocument({ id: 'd1', name: 'form-fda-356h-draft.pdf', module: 'M1', folder: '1.1 Forms', time: '2026-03-23 10:00' }),
  createProjectDocument({ id: 'd2', name: 'cover-letter.pdf', module: 'M1', folder: '1.0 Cover', time: '2026-03-23 10:02' }),
  createProjectDocument({ id: 'd3', name: 'debarment-certification.pdf', module: 'M1', folder: '1.2 Certifications', time: '2026-03-23 10:05' }),
  createProjectDocument({ id: 'd4', name: 'financial-disclosure-index.pdf', module: 'M1', folder: '1.3 Financial', time: '2026-03-22 16:00' }),
  createProjectDocument({ id: 'd5', name: '2.5-clinical-overview.pdf', module: 'M2', folder: '2.5 Clinical Overview', time: '2026-03-23 09:30' }),
  createProjectDocument({ id: 'd6', name: '2.7-clinical-summary.pdf', module: 'M2', folder: '2.7 Clinical Summary', time: '2026-03-23 09:35' }),
  createProjectDocument({ id: 'd7', name: 'quality-overall-summary.pdf', module: 'M2', folder: '2.3 Quality Overall Summary', time: '2026-03-22 14:00' }),
  createProjectDocument({ id: 'd8', name: '3.2.P.5-control-drug-product.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-23 11:00' }),
  createProjectDocument({ id: 'd9', name: '3.2.S-drug-substance.pdf', module: 'M3', folder: '3.2.S Drug Substance', time: '2026-03-23 11:05' }),
  createProjectDocument({ id: 'd10', name: '3.2.P.2-development.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-22 11:20' }),
  createProjectDocument({ id: 'd11', name: 'nonclinical-overview.pdf', module: 'M4', folder: '4.2 Overview', time: '2026-03-21 15:30' }),
  createProjectDocument({ id: 'd12', name: 'toxicology-core-study.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 15:45' }),
  createProjectDocument({ id: 'd13', name: 'clinical-study-report-001.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-23 10:00' }),
  createProjectDocument({ id: 'd14', name: '5.3.5.1-efficacy-report.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-23 10:10' }),
  createProjectDocument({ id: 'd15', name: 'investigator-brochure.pdf', module: 'M5', folder: '5.2 Tabular Listings', time: '2026-03-21 09:15' }),
];

function parseTimeToSortKey(time: string): number {
  const iso = time.includes('T') ? time : time.replace(' ', 'T');
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

function deriveDocKeyAndVersion(name: string, time: string): { docKey: string; version: string; versionSortKey: number } {
  const lower = name.toLowerCase();
  const extMatch = lower.match(/(\.[a-z0-9]+)$/i);
  const ext = extMatch?.[1] ?? '';
  const base = ext ? name.slice(0, -ext.length) : name;

  const vMatch = base.match(/(?:^|[\s._-])v(\d+)\b/i);
  if (vMatch) {
    const vNum = Number(vMatch[1]);
    const cleanedBase = base.replace(/(?:^|[\s._-])v\d+\b/i, '').replace(/[_\s.-]+$/, '');
    return {
      docKey: `${cleanedBase}${ext}`,
      version: `v${vNum}`,
      versionSortKey: Number.isFinite(vNum) ? vNum : 0,
    };
  }

  const dateMatch = base.match(/\b(20\d{2})[-.]?(0[1-9]|1[0-2])[-.]?([0-2]\d|3[01])\b/);
  if (dateMatch) {
    const y = Number(dateMatch[1]);
    const m = Number(dateMatch[2]);
    const d = Number(dateMatch[3]);
    const sortKey = y * 10000 + m * 100 + d;
    const cleanedBase = base.replace(dateMatch[0], '').replace(/[_\s.-]+$/, '');
    return {
      docKey: `${cleanedBase}${ext}`,
      version: `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`,
      versionSortKey: sortKey,
    };
  }

  const dateLabel = time.split(' ')[0] ?? time;
  return {
    docKey: name,
    version: dateLabel,
    versionSortKey: parseTimeToSortKey(time),
  };
}

export function createProjectDocument(input: Omit<ProjectDocument, 'docKey' | 'version' | 'versionSortKey'>): ProjectDocument {
  const derived = deriveDocKeyAndVersion(input.name, input.time);
  return { ...input, ...derived };
}

export function getLatestDocumentsByDocKey(docs: ProjectDocument[]) {
  const map = new Map<string, ProjectDocument>();
  for (const doc of docs) {
    const prev = map.get(doc.docKey);
    if (!prev) {
      map.set(doc.docKey, doc);
      continue;
    }
    const a = doc.versionSortKey;
    const b = prev.versionSortKey;
    if (a > b) map.set(doc.docKey, doc);
    else if (a === b && parseTimeToSortKey(doc.time) > parseTimeToSortKey(prev.time)) map.set(doc.docKey, doc);
  }
  return map;
}

export function groupDocumentsByModule(docs: ProjectDocument[]) {
  const map = new Map<EctdModule, Map<string, ProjectDocument[]>>();
  for (const m of MODULE_ORDER) {
    map.set(m, new Map());
  }
  for (const doc of docs) {
    const folders = map.get(doc.module)!;
    const list = folders.get(doc.folder) ?? [];
    list.push(doc);
    folders.set(doc.folder, list);
  }
  return map;
}
