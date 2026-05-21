export interface Concept {
  id: string;
  text: string;
  confirmed: boolean;
  isCritical?: boolean;
}

export interface MissingInput {
  id: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  allowEmpty?: boolean;
  requiredFor?: string;
  guidelineName?: string;
}

/** 指南内定位：用于角标点击后展示「第几章/节 + 高亮段落」 */
export interface GuidelineLocation {
  /** 章节标题，如「第3章 一线治疗」 */
  section: string;
  /** 小节或条文标题，如「3.1 初治方案」 */
  subsection?: string;
  /** 被引用的原文片段，点击角标后高亮展示 */
  excerpt: string;
  /** 模拟页码/位置标签，如「P.12」 */
  pageLabel?: string;
}

export interface Citation {
  id: string;
  index: number;
  title: string;
  journal?: string;
  year?: string;
  url?: string;
  abstract?: string;
  sourceType: 'guideline' | 'pubmed' | 'rwd';
  impactFactor?: string;
  /** 仅当 sourceType === 'guideline' 时使用，用于定位示意图与高亮段落 */
  guidelineLocation?: GuidelineLocation;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  evidenceLevel: string;
  citationIndices?: number[];
  contraindications?: { reason: string; citationIndices?: number[] }[];
  alternatives?: { name: string; reason: string; citationIndices?: number[] }[];
}

/** 单条指南意见：用于按来源区分显示不同指南的推荐内容 */
export interface GuidelineRecommendation {
  topic: string;
  content: string;
  evidenceLevel?: string;
}

export interface Guideline {
  id?: string;
  name: string;
  type: 'primary' | 'reference';
  /** 该指南的具体意见/推荐条文，展示时按来源（name）区分 */
  recommendations?: GuidelineRecommendation[];
}

export interface Exam {
  id: string;
  name: string;
  purpose: string;
}

export interface RWDFlowNode {
  id: string;
  label: string;
  value: number;
  children?: RWDFlowNode[];
}

export interface RWDAnalysis {
  totalDatabaseSize: number;
  matchedCohortSize: number;
  matchQuality: 'high' | 'medium' | 'low';
  dataSource: string;
  summaryText: string;
  criteria: { name: string; value: string; category: string; matchStatus?: string }[];
  flowData: RWDFlowNode[];
}

export type DiagnosisStatus = 'confirmed' | 'suspected' | 'unclear';

export interface DrugInfo {
  id: string;
  name: string;
  indicationMatch: 'high' | 'medium' | 'low';
  dosage: string;
  contraindications: string[];
  adverseReactions: string[];
  interactionCheck: {
    status: 'safe' | 'warning' | 'danger';
    suggestion: string;
    reason: string;
  };
}

export interface UserKBResult {
  id: string;
  title: string;
  content: string;
  relevance: 'high' | 'medium' | 'low';
  sourceFile: string;
}

export interface CDSSResponse {
  diagnosisTitle: string;
  diagnosisStatus: DiagnosisStatus;
  concepts: Concept[];
  missingInputs: MissingInput[];
  treatments: Treatment[];
  guidelines: Guideline[];
  citations: Citation[];
  comprehensiveAnalysis?: string;
  drugInfo?: DrugInfo[];
  userKb?: UserKBResult[];
  exams: Exam[];
}
