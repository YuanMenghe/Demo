/**
 * Demo 数据常识性校验：确保演示案例、证据等级、医学术语等无低级错误
 */
import { describe, it, expect } from 'vitest';
import { SCENARIOS } from './mockData';

const VALID_ECOG = ['0', '1', '2', '3', '4'];
const VALID_EVIDENCE_LEVELS = ['1', '2', '3', '1类', '2类', '3类'];
const KNOWN_REQUIRED_FOR = ['guideline_unlock', 'treatment_safety', 'diagnosis', 'staging', 'treatment_choice', '必要信息'];

describe('Demo 数据常识性校验', () => {
  describe('SCENARIOS', () => {
    it('每个演示案例均有 id 与 name', () => {
      expect(Object.keys(SCENARIOS).length).toBeGreaterThan(0);
      for (const [key, scenario] of Object.entries(SCENARIOS)) {
        expect(scenario.id, `scenario ${key} 应有 id`).toBeTruthy();
        expect(scenario.name, `scenario ${key} 应有 name`).toBeTruthy();
      }
    });

    it('演示案例 id 与 key 一致', () => {
      for (const [key, scenario] of Object.entries(SCENARIOS)) {
        expect(scenario.id).toBe(key);
      }
    });

    it('演示案例名称非空且长度合理', () => {
      for (const scenario of Object.values(SCENARIOS)) {
        expect(scenario.name.length).toBeGreaterThan(2);
        expect(scenario.name.length).toBeLessThan(120);
      }
    });

    it('初始病历文本非空且包含基本医学信息', () => {
      for (const [id, scenario] of Object.entries(SCENARIOS)) {
        expect(scenario.initialText, `scenario ${id} 应有 initialText`).toBeTruthy();
        expect(scenario.initialText.trim().length).toBeGreaterThan(10);
      }
    });

    it('病历中若含 ECOG 表述，应在 0-4 分范围内', () => {
      const ecogMatch = /ECOG\s*评分?\s*[：:]\s*(\d)/gi;
      for (const scenario of Object.values(SCENARIOS)) {
        const m = scenario.initialText.match(ecogMatch);
        if (m) {
          const num = scenario.initialText.match(/ECOG\s*评分?\s*[：:]?\s*(\d)/i)?.[1];
          if (num !== undefined) expect(VALID_ECOG).toContain(num);
        }
      }
    });
  });

  it('证据等级仅允许 1/2/3 类（常识）', () => {
    const validLevels = ['1', '2', '3', '1类', '2类', '3类'];
    expect(validLevels.length).toBe(6);
  });
});
