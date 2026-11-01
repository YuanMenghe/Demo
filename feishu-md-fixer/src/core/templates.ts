export type SimplifyLinksMode = 'none' | 'text_with_url' | 'text_only'
export type FootnoteMode = 'keep' | 'endnote'

export interface TemplateConfig {
  heading: {
    shiftLevelDelta: number
    convertLevelToBoldParagraph: number | null
    edit?: {
      level: number
      removePrefix?: string
      addPrefix?: string
    }
  }
  emoji: {
    stripAll: boolean
    stripNumberEmojiToOrderedList: boolean
  }
  code: {
    removeCodeBlocks: boolean
    removeInlineCode: boolean
  }
  blockquote: {
    removeAll: boolean
  }
  text: {
    collapseBlankLines: boolean
    maxBlankLines: number
  }
  footnote: {
    mode: FootnoteMode
  }
  structural: {
    removeThematicBreaks: boolean
  }
  linksAndImages: {
    simplifyLinksMode: SimplifyLinksMode
    imagesMode: 'keep' | 'alt_text' | 'strip'
  }
  numbering: {
    /** 行首中文序号、括号序号、圈数字按三级列表写入 */
    normalize: boolean
  }
}

export interface Template {
  id: string
  name: string
  description: string
  builtin: boolean
  config: TemplateConfig
}

const STORAGE_KEY = 'feishu-md-fixer.templates.v1'

export const BUILTIN_TEMPLATES: Template[] = [
  {
    id: 'feishu-default',
    name: '飞书：技术文档',
    description:
      '去 Emoji、行内代码、引用标记（保留正文）与分割线，并整理行首序号。保留代码块、图片和链接文本/URL。标题升降级用右侧按钮。',
    builtin: true,
    config: {
      heading: {
        shiftLevelDelta: 1,
        convertLevelToBoldParagraph: null,
      },
      emoji: {
        stripAll: true,
        stripNumberEmojiToOrderedList: true,
      },
      code: {
        removeCodeBlocks: false,
        removeInlineCode: true,
      },
      blockquote: {
        removeAll: true,
      },
      text: {
        collapseBlankLines: true,
        maxBlankLines: 1,
      },
      footnote: {
        mode: 'endnote',
      },
      structural: {
        removeThematicBreaks: true,
      },
      linksAndImages: {
        simplifyLinksMode: 'text_with_url',
        imagesMode: 'keep',
      },
      numbering: {
        normalize: true,
      },
    },
  },
  {
    id: 'feishu-chat-summary',
    name: '飞书：群聊总结',
    description: '更偏纯文本：去所有 Emoji、代码、引用，只保留文字内容',
    builtin: true,
    config: {
      heading: {
        shiftLevelDelta: 0,
        convertLevelToBoldParagraph: 3,
      },
      emoji: {
        stripAll: true,
        stripNumberEmojiToOrderedList: true,
      },
      code: {
        removeCodeBlocks: true,
        removeInlineCode: true,
      },
      blockquote: {
        removeAll: true,
      },
      text: {
        collapseBlankLines: true,
        maxBlankLines: 1,
      },
      footnote: {
        mode: 'endnote',
      },
      structural: {
        removeThematicBreaks: true,
      },
      linksAndImages: {
        simplifyLinksMode: 'text_only',
        imagesMode: 'strip',
      },
      numbering: {
        normalize: true,
      },
    },
  },
  {
    id: 'markdown-clean',
    name: '通用 Markdown 清理',
    description: '尽量保持 Markdown 结构，只删除 Emoji 和多余空行',
    builtin: true,
    config: {
      heading: {
        shiftLevelDelta: 0,
        convertLevelToBoldParagraph: null,
      },
      emoji: {
        stripAll: true,
        stripNumberEmojiToOrderedList: false,
      },
      code: {
        removeCodeBlocks: false,
        removeInlineCode: false,
      },
      blockquote: {
        removeAll: false,
      },
      text: {
        collapseBlankLines: true,
        maxBlankLines: 1,
      },
      footnote: {
        mode: 'endnote',
      },
      structural: {
        removeThematicBreaks: false,
      },
      linksAndImages: {
        simplifyLinksMode: 'none',
        imagesMode: 'keep',
      },
      numbering: {
        normalize: false,
      },
    },
  },
]

export function resolveTemplateConfig(base: TemplateConfig, override?: TemplateConfig | null): TemplateConfig {
  if (!override) return cloneTemplateConfig(base)
  return {
    heading: { ...base.heading, ...override.heading },
    emoji: { ...base.emoji, ...override.emoji },
    code: { ...base.code, ...override.code },
    blockquote: { ...base.blockquote, ...override.blockquote },
    text: { ...base.text, ...override.text },
    footnote: { ...base.footnote, ...override.footnote },
    structural: { ...base.structural, ...override.structural },
    linksAndImages: { ...base.linksAndImages, ...override.linksAndImages },
    numbering: { ...base.numbering, ...override.numbering },
  }
}

export function loadTemplates(): Template[] {
  if (typeof window === 'undefined') return BUILTIN_TEMPLATES

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return BUILTIN_TEMPLATES
    const parsed = JSON.parse(raw) as Template[]
    const custom = parsed.filter((t) => !t.builtin)
    return [...BUILTIN_TEMPLATES, ...custom]
  } catch {
    return BUILTIN_TEMPLATES
  }
}

export function saveCustomTemplates(templates: Template[]) {
  if (typeof window === 'undefined') return

  const custom = templates.filter((t) => !t.builtin)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
}

export function createTemplateFrom(base: Template): Template {
  return {
    ...base,
    id: `${base.id}-copy-${Date.now()}`,
    name: `${base.name}（副本）`,
    builtin: false,
    config: cloneTemplateConfig(base.config),
  }
}

export function cloneTemplateConfig(config: TemplateConfig): TemplateConfig {
  return JSON.parse(JSON.stringify(config)) as TemplateConfig
}

const ACTIVE_STATE_KEY = 'feishu-md-fixer.activeTemplate.v1'

export interface ActiveTemplateState {
  /** 用户最近选中的 templateId */
  templateId: string
  /**
   * 用户对各模板（包括内置）做出的配置覆盖。
   * key 为 templateId，value 为完整 TemplateConfig 快照。
   * 不存在则使用模板自带默认配置。
   */
  overrides: Record<string, TemplateConfig>
}

export function loadActiveTemplateState(): ActiveTemplateState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ACTIVE_STATE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ActiveTemplateState>
    if (!parsed || typeof parsed.templateId !== 'string') return null
    const overrides =
      parsed.overrides && typeof parsed.overrides === 'object'
        ? (parsed.overrides as Record<string, TemplateConfig>)
        : {}
    return { templateId: parsed.templateId, overrides }
  } catch {
    return null
  }
}

export function saveActiveTemplateState(state: ActiveTemplateState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ACTIVE_STATE_KEY, JSON.stringify(state))
  } catch {
    // 存储失败（隐私模式 / 配额）静默忽略，不影响使用
  }
}

