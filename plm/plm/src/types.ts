export type DiagnosisStatus = 'confirmed' | 'probable' | 'unclear';

export interface Concept {
  id: string;
  text: string;
  type: 'disease' | 'symptom' | 'drug' | 'gene' | 'other';
  confidence: number; // 0-1
  isCritical: boolean;
  confirmed: boolean;
}

export interface MissingInput {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number';
  options?: string[];
  requiredFor: 'diagnosis' | 'staging' | 'guideline_unlock' | 'treatment_safety' | 'prognosis' | 'treatment_choice';
  guidelineName?: string;
  value?: string;
  allowEmpty?: boolean;
}

export interface PatientContext {
  unstructuredText: string;
  structuredData: Record<string, any>;
  confirmedConcepts: string[];
}

export interface ExamRecommendation {
  id: string;
  name: string;
  purpose: string;
  evidence: string;
}

export interface Citation {
  id: string;
  index: number;
  sourceType: 'guideline' | 'pubmed' | 'rwd';
  title: string;
  abstract?: string;
  journal?: string;
  year?: string;
  url?: string;
  impactFactor?: number;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  evidenceLevel: string;
  description: string;
  citationIndices?: number[]; // indices of citations in the main list
  contraindications?: {
    reason: string;
    level: 'absolute' | 'relative';
    citationIndices?: number[];
  }[];
  alternatives?: {
    name: string;
    reason: string;
    citationIndices?: number[];
  }[];
  sourceId?: string;
}

export interface RWDFilterCriteria {
  category: 'high_weight' | 'low_weight';
  name: string;
  value: string;
  matchStatus: 'exact' | 'partial' | 'ignored'; // ignored if cohort too small
}

export interface RWDFlowNode {
  id: string;
  label: string;
  count?: number;
  percentage: number;
  type: 'treatment' | 'outcome' | 'state';
  status?: 'active' | 'terminal' | 'transfer';
  color?: string;
  children?: RWDFlowNode[];
}

export interface RWDAnalysis {
  totalDatabaseSize: number;
  matchedCohortSize: number;
  matchQuality: 'high' | 'medium' | 'low';
  criteria: RWDFilterCriteria[];
  flowData: RWDFlowNode; // Root node of the flow
  summaryText: string;
  lastUpdated?: string;
  dataSource?: string;
}

export interface CDSSResponse {
  snapshotId: string;
  diagnosisStatus: DiagnosisStatus;
  diagnosisTitle: string;
  concepts: Concept[];
  missingInputs: MissingInput[];
  guidelines: {
    name: string;
    type: 'primary' | 'secondary';
    status: 'active' | 'inactive';
  }[];
  exams: ExamRecommendation[];
  treatments: TreatmentPlan[];
  citations?: Citation[];
  rwdAnalysis?: RWDAnalysis; // Replaces simple rwdStats
  comprehensiveAnalysis?: string; // Detailed clinical analysis text with citation markers [1], [2] etc.
}
