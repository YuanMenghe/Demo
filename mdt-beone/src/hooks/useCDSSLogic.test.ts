import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCDSSLogic } from './useCDSSLogic';

describe('useCDSSLogic', () => {
  it('initial response is empty', () => {
    const { result } = renderHook(() => useCDSSLogic());
    expect(result.current.response.diagnosisTitle).toBe('');
    expect(result.current.response.citations).toEqual([]);
  });

  it('loadScenario fills response', () => {
    const { result } = renderHook(() => useCDSSLogic());
    act(() => result.current.loadScenario('scenario1'));
    const r = result.current.response;
    expect(r.diagnosisTitle).toBeTruthy();
    expect(r.citations.length).toBeGreaterThan(0);
    expect(r.guidelines.length).toBeGreaterThan(0);
  });

  it('citations include guideline with guidelineLocation', () => {
    const { result } = renderHook(() => useCDSSLogic());
    act(() => result.current.loadScenario('scenario1'));
    const hasLocation = result.current.response.citations.some(c => c.guidelineLocation?.section);
    expect(hasLocation).toBe(true);
  });

  it('comprehensiveAnalysis 与 treatments 在加载场景后均存在', () => {
    const { result } = renderHook(() => useCDSSLogic());
    act(() => result.current.loadScenario('scenario1'));
    const r = result.current.response;
    expect(typeof r.comprehensiveAnalysis).toBe('string');
    expect((r.comprehensiveAnalysis ?? '').length).toBeGreaterThan(0);
    expect(r.treatments.length).toBeGreaterThan(0);
  });

  it('runAnalysis fills response', () => {
    const { result } = renderHook(() => useCDSSLogic());
    act(() => result.current.runAnalysis());
    expect(result.current.response.diagnosisTitle).toBeTruthy();
  });
});
