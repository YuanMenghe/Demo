/** Active analysis modules (Response drafting is phase 2 — not included) */
export const ANALYSIS_MODULE_IDS = ['completeness', 'scientific', 'issues'] as const;
export type AnalysisModuleId = (typeof ANALYSIS_MODULE_IDS)[number];

export const DEFAULT_SELECTED_MODULES: AnalysisModuleId[] = [...ANALYSIS_MODULE_IDS];
