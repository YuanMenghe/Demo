export type EctdModule = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export interface ProjectDocument {
  id: string;
  name: string;
  module: EctdModule;
  /** Subfolder within the module (eCTD section grouping) */
  folder: string;
  time: string;
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
  { id: 'd1', name: 'form-fda-356h-draft.pdf', module: 'M1', folder: '1.1 Forms', time: '2026-03-23 10:00' },
  { id: 'd2', name: 'cover-letter.pdf', module: 'M1', folder: '1.0 Cover', time: '2026-03-23 10:02' },
  { id: 'd3', name: 'debarment-certification.pdf', module: 'M1', folder: '1.2 Certifications', time: '2026-03-23 10:05' },
  { id: 'd4', name: 'financial-disclosure-index.pdf', module: 'M1', folder: '1.3 Financial', time: '2026-03-22 16:00' },
  { id: 'd5', name: '2.5-clinical-overview.pdf', module: 'M2', folder: '2.5 Clinical Overview', time: '2026-03-23 09:30' },
  { id: 'd6', name: '2.7-clinical-summary.pdf', module: 'M2', folder: '2.7 Clinical Summary', time: '2026-03-23 09:35' },
  { id: 'd7', name: 'quality-overall-summary.pdf', module: 'M2', folder: '2.3 Quality Overall Summary', time: '2026-03-22 14:00' },
  { id: 'd8', name: '3.2.P.5-control-drug-product.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-23 11:00' },
  { id: 'd9', name: '3.2.S-drug-substance.pdf', module: 'M3', folder: '3.2.S Drug Substance', time: '2026-03-23 11:05' },
  { id: 'd10', name: '3.2.P.2-development.pdf', module: 'M3', folder: '3.2.P Drug Product', time: '2026-03-22 11:20' },
  { id: 'd11', name: 'nonclinical-overview.pdf', module: 'M4', folder: '4.2 Overview', time: '2026-03-21 15:30' },
  { id: 'd12', name: 'toxicology-core-study.pdf', module: 'M4', folder: '4.2.3 Toxicology', time: '2026-03-21 15:45' },
  { id: 'd13', name: 'clinical-study-report-001.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-23 10:00' },
  { id: 'd14', name: '5.3.5.1-efficacy-report.pdf', module: 'M5', folder: '5.3.5 Reports', time: '2026-03-23 10:10' },
  { id: 'd15', name: 'investigator-brochure.pdf', module: 'M5', folder: '5.2 Tabular Listings', time: '2026-03-21 09:15' },
];

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
