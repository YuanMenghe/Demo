export type EctdModule = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export interface ProjectDocument {
  id: string;
  name: string;
  module: EctdModule;
  /** Subfolder within the module (eCTD section grouping) */
  folder: string;
  /**
   * Optional study identifier for M4/M5 where files are naturally grouped by study.
   * Derived from filename in this demo (e.g. BA1234_SAP_v1.1.pdf -> BA1234).
   */
  studyId?: string;
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
  // Demo: a few files include semantic versions (v1.0/v1.1/v2.0) to exercise version grouping.
  createProjectDocument({ id: 'd1', name: 'form-fda-356h-draft_v1.0.pdf', module: 'M1', folder: '1.1 Forms', time: '2026-03-22 09:00' }),
  createProjectDocument({ id: 'd1b', name: 'form-fda-356h-draft_v1.1.pdf', module: 'M1', folder: '1.1 Forms', time: '2026-03-23 10:00' }),
  createProjectDocument({ id: 'd2', name: 'cover-letter_v1.0.pdf', module: 'M1', folder: '1.0 Cover', time: '2026-03-22 10:02' }),
  createProjectDocument({ id: 'd2b', name: 'cover-letter_v1.1.pdf', module: 'M1', folder: '1.0 Cover', time: '2026-03-23 10:02' }),
  createProjectDocument({ id: 'd3', name: 'debarment-certification.pdf', module: 'M1', folder: '1.2 Certifications', time: '2026-03-23 10:05' }),
  createProjectDocument({ id: 'd4', name: 'financial-disclosure-index.pdf', module: 'M1', folder: '1.3 Financial', time: '2026-03-22 16:00' }),
  createProjectDocument({ id: 'd5', name: '2.5-clinical-overview_v2.0.pdf', module: 'M2', folder: '2.5 Clinical Overview', time: '2026-03-23 09:30' }),
  createProjectDocument({ id: 'd6', name: '2.7-clinical-summary.pdf', module: 'M2', folder: '2.7 Clinical Summary', time: '2026-03-23 09:35' }),
  createProjectDocument({ id: 'd7', name: 'quality-overall-summary.pdf', module: 'M2', folder: '2.3 Quality Overall Summary', time: '2026-03-22 14:00' }),
  createProjectDocument({ id: 'd8', name: '3.2.P.5-control-drug-product.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-23 11:00' }),
  createProjectDocument({ id: 'd9', name: '3.2.S-drug-substance.pdf', module: 'M3', folder: '3.2.S Drug Substance', time: '2026-03-23 11:05' }),
  createProjectDocument({ id: 'd10', name: '3.2.P.2-development.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-22 11:20' }),
  createProjectDocument({ id: 'd11', name: 'nonclinical-overview.pdf', module: 'M4', folder: '4.2 Overview', time: '2026-03-21 15:30' }),
  // M4 demo: studies can repeat a consistent file bundle
  createProjectDocument({ id: 'd12', name: 'NCX901_toxicology_report_body_v1.0.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-20 15:45' }),
  createProjectDocument({ id: 'd12b', name: 'NCX901_toxicology_report_body_v1.1.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 15:45' }),
  createProjectDocument({ id: 'd12c', name: 'NCX901_protocol_v1.0.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-19 10:05' }),
  createProjectDocument({ id: 'd12d', name: 'NCX901_protocol_v1.1.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 10:05' }),
  createProjectDocument({ id: 'd12e', name: 'NCX901_sap_v1.0.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-19 10:15' }),
  createProjectDocument({ id: 'd12f', name: 'NCX901_define_v1.0.xml', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 11:15' }),
  createProjectDocument({ id: 'd12g', name: 'NCX901_sdtm_dataset_v1.0.xpt', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 11:20' }),
  createProjectDocument({ id: 'd12h', name: 'NCX901_adam_dataset_v1.0.xpt', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 11:22' }),
  createProjectDocument({ id: 'd12i', name: 'NCX901_analysis_programs_v1.0.zip', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 11:30' }),
  createProjectDocument({ id: 'd12j', name: 'NCX902_toxicology_report_body_v1.0.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-20 13:00' }),
  createProjectDocument({ id: 'd12k', name: 'NCX902_protocol_v1.0.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-20 13:10' }),
  createProjectDocument({ id: 'd12l', name: 'NCX902_define_v1.0.xml', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-20 13:15' }),
  createProjectDocument({ id: 'd12m', name: 'NCX902_sdtm_dataset_v1.0.xpt', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-20 13:18' }),
  // M5 demo: one study can contain a large repeated bundle of leaf files
  createProjectDocument({ id: 'd13', name: 'BA1234_csr_body_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 10:00' }),
  createProjectDocument({ id: 'd13b', name: 'BA1234_csr_body_v1.1.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-23 10:00' }),
  createProjectDocument({ id: 'd13c', name: 'BA1234_synopsis_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 10:05' }),
  createProjectDocument({ id: 'd13d', name: 'BA1234_protocol_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-21 09:10' }),
  createProjectDocument({ id: 'd13e', name: 'BA1234_protocol_amendment_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:10' }),
  createProjectDocument({ id: 'd13f', name: 'BA1234_sample_crf_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:20' }),
  createProjectDocument({ id: 'd13g', name: 'BA1234_informed_consent_list_v1.0.xlsx', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:25' }),
  createProjectDocument({ id: 'd13h', name: 'BA1234_randomization_scheme_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:30' }),
  createProjectDocument({ id: 'd13i', name: 'BA1234_audit_certificate_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:35' }),
  createProjectDocument({ id: 'd13j', name: 'BA1234_sap_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:45' }),
  createProjectDocument({ id: 'd13k', name: 'BA1234_publications_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:50' }),
  createProjectDocument({ id: 'd13l', name: 'BA1234_subject_listings_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:55' }),
  createProjectDocument({ id: 'd13m', name: 'BA1234_crf_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 09:58' }),
  createProjectDocument({ id: 'd13n', name: 'BA1234_sdtm_dataset_v1.0.xpt', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:05' }),
  createProjectDocument({ id: 'd13o', name: 'BA1234_adam_dataset_v1.0.xpt', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:08' }),
  createProjectDocument({ id: 'd13p', name: 'BA1234_define_v1.0.xml', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:10' }),
  createProjectDocument({ id: 'd13q', name: 'BA1234_analysis_programs_v1.0.zip', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:12' }),
  createProjectDocument({ id: 'd13r', name: 'BA1234_acrf_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:20' }),
  createProjectDocument({ id: 'd13s', name: 'BA1234_reviewer_guide_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-22 11:25' }),
  createProjectDocument({ id: 'd14', name: 'BA5678_csr_body_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-20 10:10' }),
  createProjectDocument({ id: 'd14b', name: 'BA5678_synopsis_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-20 10:12' }),
  createProjectDocument({ id: 'd14c', name: 'BA5678_protocol_v1.0.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-20 10:15' }),
  createProjectDocument({ id: 'd14d', name: 'BA5678_sdtm_dataset_v1.0.xpt', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-20 10:20' }),
  createProjectDocument({ id: 'd14e', name: 'BA5678_define_v1.0.xml', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-20 10:25' }),
  createProjectDocument({ id: 'd15', name: 'investigator-brochure.pdf', module: 'M5', folder: '5.2 Tabular Listings', time: '2026-03-21 09:15' }),
];

function parseTimeToSortKey(time: string): number {
  // Accepts 'YYYY-MM-DD HH:mm' used in this demo dataset.
  const iso = time.includes('T') ? time : time.replace(' ', 'T');
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

function semverToSortKey(v: string): number {
  // v like "1.2.3" or "1.2" or "1"
  // Encode into a single number: major*1e9 + minor*1e6 + patch*1e3 + build
  // (segments capped to 4, each segment capped to 0-999)
  const parts = v
    .split('.')
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n))
    .slice(0, 4)
    .map((n) => Math.max(0, Math.min(999, Math.trunc(n))));
  const [a = 0, b = 0, c = 0, d = 0] = parts;
  return a * 1_000_000_000 + b * 1_000_000 + c * 1_000 + d;
}

function deriveStudyIdFromName(name: string): string | undefined {
  const lower = name.toLowerCase();
  const extMatch = lower.match(/(\.[a-z0-9]+)$/i);
  const ext = extMatch?.[1] ?? '';
  const base = ext ? name.slice(0, -ext.length) : name;

  // Remove explicit version tokens to reduce false positives (e.g. v1.1).
  const cleaned = base.replace(/(?:^|[\s._-])v\d+(?:\.\d+)*\b/gi, ' ');
  const tokens = cleaned.split(/[^a-z0-9]+/i).filter(Boolean);

  // Prefer common eCTD study-like IDs (can be tightened later once naming conventions are known).
  for (const raw of tokens) {
    const token = raw.toUpperCase();
    if (/^(BA|BE|NCT|STUDY)[-_]?[0-9A-Z]{3,}$/.test(token)) {
      return token.replace(/[-_]/g, '');
    }
    if (/^[A-Z]{2,}[0-9]{3,}$/.test(token) && token !== 'CSR') {
      return token.replace(/[-_]/g, '');
    }
  }
  return undefined;
}

function deriveDocKeyAndVersion(name: string, time: string): { docKey: string; version: string; versionSortKey: number } {
  const lower = name.toLowerCase();
  const extMatch = lower.match(/(\.[a-z0-9]+)$/i);
  const ext = extMatch?.[1] ?? '';
  const base = ext ? name.slice(0, -ext.length) : name;

  // Common patterns: xxx_v1.1, xxx-v1.1, xxx v1.1, xxx_v3
  const vMatch = base.match(/(?:^|[\s._-])v(\d+(?:\.\d+)*)\b/i);
  if (vMatch) {
    const raw = vMatch[1];
    const cleanedBase = base.replace(/(?:^|[\s._-])v\d+(?:\.\d+)*\b/i, '').replace(/[_\s.-]+$/, '');
    return {
      docKey: `${cleanedBase}${ext}`,
      version: `v${raw}`,
      versionSortKey: semverToSortKey(raw),
    };
  }

  // Date version embedded in name: YYYY-MM-DD or YYYYMMDD
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

  // Fallback: show date portion from upload time; compare by time.
  const dateLabel = time.split(' ')[0] ?? time;
  return {
    docKey: name,
    version: dateLabel,
    versionSortKey: parseTimeToSortKey(time),
  };
}

export function createProjectDocument(input: Omit<ProjectDocument, 'docKey' | 'version' | 'versionSortKey' | 'studyId'>): ProjectDocument {
  const derived = deriveDocKeyAndVersion(input.name, input.time);
  const studyId = input.module === 'M4' || input.module === 'M5' ? deriveStudyIdFromName(input.name) : undefined;
  return { ...input, studyId, ...derived };
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
