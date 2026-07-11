export type TaskDifficulty = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
export type ExpertLevel = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type QualityLevel = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5';
export type CertStatus = '已认证' | '待补充' | '认证失败' | '已过期';

export interface Task {
  id: string;
  title: string;
  category: string;
  type: string;
  difficulty: TaskDifficulty;
  requiredLevel: ExpertLevel;
  estimatedTime: string;
  basePrice: number;
  description: string;
}

export interface CertItem {
  id: string;
  name: string;
  description: string;
  status: CertStatus;
  level: ExpertLevel | null;
  requirements: string[];
}
