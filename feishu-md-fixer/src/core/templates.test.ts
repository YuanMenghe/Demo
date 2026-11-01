import { describe, it, expect, beforeEach } from 'vitest'
import {
  BUILTIN_TEMPLATES,
  cloneTemplateConfig,
  createTemplateFrom,
  loadActiveTemplateState,
  saveActiveTemplateState,
} from './templates'

// 提供最小 window/localStorage stub，避免引入 jsdom 依赖
function installLocalStorageStub() {
  const store = new Map<string, string>()
  const localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
  ;(globalThis as unknown as { window: { localStorage: typeof localStorage } }).window = {
    localStorage,
  }
  ;(globalThis as unknown as { localStorage: typeof localStorage }).localStorage = localStorage
  return localStorage
}

describe('templates', () => {
  it('removes inline code, blockquotes and thematic breaks by default in technical-document template', () => {
    const cfg = BUILTIN_TEMPLATES[0]!.config
    expect(cfg.code.removeInlineCode).toBe(true)
    expect(cfg.blockquote.removeAll).toBe(true)
    expect(cfg.structural.removeThematicBreaks).toBe(true)
  })

  it('createTemplateFrom clones config so copy is independent', () => {
    const base = BUILTIN_TEMPLATES[0]!
    const copy = createTemplateFrom(base)
    expect(copy.id).not.toBe(base.id)
    expect(copy.name).toContain('副本')
    expect(copy.builtin).toBe(false)
    expect(copy.config).not.toBe(base.config)
    expect(copy.config.heading.shiftLevelDelta).toBe(base.config.heading.shiftLevelDelta)
    copy.config.heading.shiftLevelDelta = 999
    expect(base.config.heading.shiftLevelDelta).not.toBe(999)
  })

  it('cloneTemplateConfig returns deep clone', () => {
    const base = BUILTIN_TEMPLATES[0]!.config
    const cloned = cloneTemplateConfig(base)
    expect(cloned).not.toBe(base)
    expect(cloned.heading.shiftLevelDelta).toBe(base.heading.shiftLevelDelta)
    cloned.heading.shiftLevelDelta = -1
    expect(base.heading.shiftLevelDelta).not.toBe(-1)
  })
})

describe('active template state persistence', () => {
  beforeEach(() => {
    installLocalStorageStub()
  })

  it('returns null when nothing is stored', () => {
    expect(loadActiveTemplateState()).toBeNull()
  })

  it('round-trips templateId and per-template overrides', () => {
    const base = BUILTIN_TEMPLATES[0]!.config
    const override = cloneTemplateConfig(base)
    override.code.removeInlineCode = !base.code.removeInlineCode
    saveActiveTemplateState({
      templateId: BUILTIN_TEMPLATES[1]!.id,
      overrides: { [BUILTIN_TEMPLATES[0]!.id]: override },
    })

    const loaded = loadActiveTemplateState()
    expect(loaded).not.toBeNull()
    expect(loaded!.templateId).toBe(BUILTIN_TEMPLATES[1]!.id)
    expect(loaded!.overrides[BUILTIN_TEMPLATES[0]!.id]?.code.removeInlineCode).toBe(
      !base.code.removeInlineCode
    )
  })

  it('returns null on malformed payload instead of throwing', () => {
    const ls = installLocalStorageStub()
    ls.setItem('feishu-md-fixer.activeTemplate.v1', '{not json')
    expect(loadActiveTemplateState()).toBeNull()
  })
})
