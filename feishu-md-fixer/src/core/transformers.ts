import type {
  Root,
  Heading,
  Paragraph,
  Text,
  Link,
  Image,
  ThematicBreak,
  Parent,
  List,
  ListItem,
  PhrasingContent,
} from 'mdast'
import { visit } from 'unist-util-visit'
import { createMarkdownProcessor, stripMarkdownEscapesForFeishu } from './markdownProcessor'
import type { TemplateConfig } from './templates'

function isText(node: unknown): node is Text {
  return !!node && (node as any).type === 'text'
}

function collectPlainText(node: unknown): string {
  if (isText(node)) return node.value
  if (!!node && (node as { type?: string }).type === 'inlineCode') {
    return (node as { value?: string }).value ?? ''
  }
  if (!isParent(node)) return ''
  return node.children.map((child) => collectPlainText(child)).join('')
}

function isParent(node: unknown): node is Parent {
  return !!node && Array.isArray((node as any).children)
}

const CN_DIGIT: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
}

/** 解析行首中文序号，支持到 99（二十一、九十九）。无法解析时返回 null。 */
function parseChineseNumeral(raw: string): number | null {
  if (!raw || raw.length > 4) return null
  if (raw === '十') return 10

  const tenAt = raw.indexOf('十')
  if (tenAt === -1) {
    if (raw.length !== 1) return null
    return CN_DIGIT[raw] ?? null
  }

  const left = raw.slice(0, tenAt)
  const right = raw.slice(tenAt + 1)
  if (left.length > 1 || right.length > 1) return null
  if (left && CN_DIGIT[left] == null) return null
  if (right && CN_DIGIT[right] == null) return null

  const tens = left ? CN_DIGIT[left] : 1
  const ones = right ? CN_DIGIT[right] : 0
  return tens * 10 + ones
}

/**
 * 圈数字到数字映射
 */
const CIRCLE_NUM_MAP: Record<string, number> = {
  '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
  '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10,
}

const CIRCLE_NUM_ALT = Object.keys(CIRCLE_NUM_MAP)
  .sort((a, b) => b.length - a.length)
  .join('|')

/** 行首：缩进、可选一层引用、可选列表标。不用 \\s，避免吃掉上一行的换行。 */
const LINE_NUM_PREFIX = '^([ \\t]*)((?:>[ \\t]+)?)((?:\\d+\\.\\s+|[-*+]\\s+)?)'
export function runTransformers(tree: Root, template: TemplateConfig) {
  normalizeOutlineNumberedHeadings(tree)

  // 注意：标题升降级现在改为用户手动点击按钮操作当前内容，不再在初始 pipeline 中自动执行
  // if (template.heading.shiftLevelDelta !== 0) {
  //   shiftAllHeadings(tree, template.heading.shiftLevelDelta)
  // }

  if (template.heading.convertLevelToBoldParagraph != null) {
    convertHeadingToBoldParagraph(tree, template.heading.convertLevelToBoldParagraph)
  }

  if (template.heading.edit) {
    editHeadingText(tree, template.heading.edit)
  }

  if (template.emoji.stripNumberEmojiToOrderedList) {
    convertNumberEmojiToOrderedList(tree)
  }

  if (template.emoji.stripAll) {
    stripAllEmojis(tree)
  }

  if (template.code.removeCodeBlocks) {
    removeCodeBlocks(tree)
  }

  if (template.code.removeInlineCode) {
    removeInlineCode(tree)
  }

  if (template.blockquote.removeAll) {
    removeAllBlockquotes(tree)
  }

  if (template.structural.removeThematicBreaks) {
    removeThematicBreaks(tree)
  }

  if (template.linksAndImages.simplifyLinksMode !== 'none') {
    simplifyLinks(tree, template.linksAndImages.simplifyLinksMode)
  }

  if (template.linksAndImages.imagesMode !== 'keep') {
    transformImages(tree, template.linksAndImages.imagesMode)
  }

  if (template.footnote.mode === 'endnote') {
    convertFootnotesToEndnotes(tree)
  }
}

interface FootnoteDefinitionNode extends Parent {
  type: 'footnoteDefinition'
  identifier: string
}

interface FootnoteReferenceNode {
  type: 'footnoteReference'
  identifier: string
}

function normalizeOutlineNumberedHeadings(tree: Root) {
  rewriteOutlineListsInParent(tree, [])
}

function rewriteOutlineListsInParent(parent: Parent, prefix: number[]) {
  const nextChildren: Parent['children'] = []

  for (const child of parent.children) {
    if (child.type === 'list' && child.ordered && isOutlineNumberedList(child)) {
      nextChildren.push(...expandOutlineList(child, prefix))
      continue
    }

    if ('children' in child && Array.isArray(child.children)) {
      rewriteOutlineListsInParent(child as Parent, prefix)
    }

    nextChildren.push(child)
  }

  parent.children = nextChildren
}

function isOutlineNumberedList(node: List): boolean {
  // 仅当列表项内含真正的 heading 节点时，才认为是“数字编号大纲标题”。
  // paragraph-only 的有序列表（例如步骤列表 1./2./3.）保持为普通 Markdown 列表。
  return node.children.some((item) => getOutlineTitleNode(item) != null)
}

function getOutlineTitleNode(item: ListItem): Heading | null {
  for (const child of item.children) {
    if (child.type === 'heading') {
      return child
    }
    if (child.type === 'definition') {
      continue
    }
    return null
  }
  return null
}

function expandOutlineList(list: List, prefix: number[]): Parent['children'] {
  const start = list.start ?? 1
  const expanded: Parent['children'] = []

  list.children.forEach((item, index) => {
    const titleNode = getOutlineTitleNode(item)
    const itemPrefix = [...prefix, start + index]

    if (!titleNode) {
      rewriteOutlineListsInParent(item, itemPrefix)
      expanded.push(item)
      return
    }

    expanded.push(prefixOutlineTitle(titleNode, itemPrefix))

    let skippedTitle = false
    for (const child of item.children) {
      if (!skippedTitle && child === titleNode) {
        skippedTitle = true
        continue
      }

      if (child.type === 'list' && child.ordered && isOutlineNumberedList(child)) {
        expanded.push(...expandOutlineList(child, itemPrefix))
        continue
      }

      if ('children' in child && Array.isArray(child.children)) {
        rewriteOutlineListsInParent(child as Parent, itemPrefix)
      }

      expanded.push(child)
    }
  })

  return expanded
}

function prefixOutlineTitle(node: Heading, prefix: number[]) {
  const marker = `${prefix.join('.')} `
  const children = prefixPhrasingChildren(node.children as PhrasingContent[], marker)
  return {
    ...node,
    children,
  }
}

function prefixPhrasingChildren(children: PhrasingContent[], prefix: string): PhrasingContent[] {
  if (children.length === 0) {
    return [{ type: 'text', value: prefix }]
  }

  const [first, ...rest] = children
  if (first.type === 'text') {
    return [{ ...first, value: `${prefix}${first.value}` }, ...rest]
  }

  return [{ type: 'text', value: prefix }, ...children]
}

function convertHeadingToBoldParagraph(tree: Root, level: number) {
  visit(tree, 'heading', (node: Heading, index, parent) => {
    if (!parent || node.depth !== level || typeof index !== 'number') return
    parent.children[index] = {
      type: 'paragraph',
      children: [
        {
          type: 'strong',
          children: node.children,
        },
      ],
    } as Paragraph
  })
}

interface EditHeadingOptions {
  level: number
  removePrefix?: string
  addPrefix?: string
}

function editHeadingText(tree: Root, options: EditHeadingOptions) {
  const { level, removePrefix, addPrefix } = options

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth !== level || node.children.length === 0) return
    const first = node.children[0]
    if (!isText(first)) return

    let value = first.value

    if (removePrefix && value.startsWith(removePrefix)) {
      value = value.slice(removePrefix.length)
    }

    if (addPrefix && !value.startsWith(addPrefix)) {
      value = `${addPrefix}${value}`
    }

    first.value = value
  })
}

function convertNumberEmojiToOrderedList(tree: Root) {
  // 匹配所有数字 emoji（1️⃣ 2️⃣ …），含可选 VARIATION SELECTOR \uFE0F
  const numberEmojiRegex = /([0-9]{1,2})\uFE0F?\u20E3/g

  visit(tree, 'text', (node: Text) => {
    node.value = node.value.replace(numberEmojiRegex, (_, digits) => `${digits}. `)
  })
}

function stripAllEmojis(tree: Root) {
  const emojiRegex =
    /[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu

  visit(tree, 'text', (node: Text) => {
    node.value = node.value.replace(emojiRegex, '')
  })
}

function removeCodeBlocks(tree: Root) {
  const indicesToRemove: { parent: Parent; index: number }[] = []
  visit(tree, 'code', (_node, index, parent) => {
    if (!parent || typeof index !== 'number') return
    indicesToRemove.push({ parent, index })
  })
  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    const { parent, index } = indicesToRemove[i]
    parent.children.splice(index, 1)
  }
}

function removeInlineCode(tree: Root) {
  visit(tree, 'inlineCode', (node, index, parent) => {
    if (!parent || typeof index !== 'number') return
    const textNode: Text = {
      type: 'text',
      value: node.value,
    }
    parent.children[index] = textNode
  })
}

function removeAllBlockquotes(tree: Root) {
  unwrapBlockquotes(tree)
}

function unwrapBlockquotes(parent: Parent) {
  const next: Parent['children'] = []

  for (const child of parent.children) {
    if (child.type === 'blockquote') {
      unwrapBlockquotes(child)
      next.push(...child.children)
      continue
    }

    if (isParent(child)) unwrapBlockquotes(child)
    next.push(child)
  }

  parent.children = next
}

/**
 * 折叠围栏外的连续空行。maxBlankLines 是最多保留的空行数；代码块内部原样保留。
 */
export function collapseMarkdownBlankLines(markdown: string, maxBlankLines: number): string {
  const max = Math.max(0, maxBlankLines)
  const lines = markdown.split(/\r?\n/)
  const kept: string[] = []
  let fence: { marker: '`' | '~'; length: number } | null = null
  let blankRun = 0

  for (const line of lines) {
    const fenceMatch = getFenceMatch(line)
    if (fenceMatch) {
      if (fence && fence.marker === fenceMatch.marker && fenceMatch.length >= fence.length) {
        fence = null
      } else if (!fence) {
        fence = fenceMatch
      }
      blankRun = 0
      kept.push(line)
      continue
    }

    if (fence) {
      kept.push(line)
      continue
    }

    if (!line.trim()) {
      blankRun += 1
      if (blankRun <= max) kept.push('')
      continue
    }

    blankRun = 0
    kept.push(line)
  }

  return kept.join('\n')
}

function removeThematicBreaks(tree: Root) {
  const indicesToRemove: { parent: Parent; index: number }[] = []
  visit(tree, 'thematicBreak', (_node: ThematicBreak, index, parent) => {
    if (!parent || typeof index !== 'number') return
    indicesToRemove.push({ parent, index })
  })
  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    const { parent, index } = indicesToRemove[i]
    parent.children.splice(index, 1)
  }
}

type LinkMode = 'text_with_url' | 'text_only'

function simplifyLinks(tree: Root, mode: LinkMode) {
  visit(tree, 'link', (node: Link, index, parent) => {
    if (!parent || typeof index !== 'number') return

    const textContent = collectPlainText(node)

    let value = textContent
    if (mode === 'text_with_url' && node.url) {
      value = `${textContent}（${node.url}）`
    }

    const textNode: Text = {
      type: 'text',
      value,
    }

    parent.children[index] = textNode
  })
}

type ImageMode = 'alt_text' | 'strip'

function transformImages(tree: Root, mode: ImageMode) {
  if (mode === 'strip') {
    const indicesToRemove: { parent: Parent; index: number }[] = []
    visit(tree, 'image', (_node, index, parent) => {
      if (!parent || typeof index !== 'number') return
      indicesToRemove.push({ parent, index })
    })
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      const { parent, index } = indicesToRemove[i]
      parent.children.splice(index, 1)
    }
    return
  }

  visit(tree, 'image', (node: Image, index, parent) => {
    if (!parent || typeof index !== 'number') return
    const alt = node.alt || ''
    const textNode: Text = {
      type: 'text',
      value: alt,
    }
    parent.children[index] = textNode
  })
}

function convertFootnotesToEndnotes(tree: Root) {
  const definitions = new Map<string, FootnoteDefinitionNode>()
  const orderedDefinitions: FootnoteDefinitionNode[] = []

  collectFootnoteDefinitions(tree, definitions, orderedDefinitions)
  if (definitions.size === 0) return

  const noteNumbers = new Map<string, number>()
  replaceFootnoteReferences(tree, noteNumbers)
  if (noteNumbers.size === 0) return

  const endnoteNodes = buildEndnoteNodes(noteNumbers, definitions, orderedDefinitions)
  if (endnoteNodes.length === 0) return

  if (tree.children.length > 0) {
    tree.children.push({
      type: 'paragraph',
      children: [{ type: 'text', value: '' }],
    })
  }

  tree.children.push(...endnoteNodes)
}

function collectFootnoteDefinitions(
  parent: Parent,
  definitions: Map<string, FootnoteDefinitionNode>,
  orderedDefinitions: FootnoteDefinitionNode[]
) {
  const nextChildren: Parent['children'] = []

  for (const child of parent.children) {
    if (child.type === 'footnoteDefinition') {
      const definition = child as unknown as FootnoteDefinitionNode
      definitions.set(definition.identifier, definition)
      orderedDefinitions.push(definition)
      continue
    }

    if (isParent(child)) {
      collectFootnoteDefinitions(child, definitions, orderedDefinitions)
    }

    nextChildren.push(child)
  }

  parent.children = nextChildren
}

function replaceFootnoteReferences(parent: Parent, noteNumbers: Map<string, number>) {
  parent.children = parent.children.map((child) => {
    if ('children' in child && Array.isArray(child.children)) {
      if (isPhrasingContainer(child)) {
        child.children = replaceFootnoteReferencesInPhrasing(child.children as PhrasingContent[], noteNumbers)
      } else {
        replaceFootnoteReferences(child as Parent, noteNumbers)
      }
    }

    return child
  })
}

function isPhrasingContainer(node: unknown): node is { children: PhrasingContent[] } {
  if (!node || !Array.isArray((node as any).children)) return false
  const children = (node as any).children as Array<{ type?: string }>
  return children.every((child) => {
    if (!child || typeof child.type !== 'string') return false
    return ![
      'paragraph',
      'heading',
      'list',
      'listItem',
      'blockquote',
      'table',
      'tableRow',
      'tableCell',
      'root',
      'footnoteDefinition',
    ].includes(child.type)
  })
}

function replaceFootnoteReferencesInPhrasing(
  children: PhrasingContent[],
  noteNumbers: Map<string, number>
): PhrasingContent[] {
  const nextChildren: PhrasingContent[] = []

  for (const child of children) {
    if ((child as any).type === 'footnoteReference') {
      const identifier = (child as FootnoteReferenceNode).identifier
      const number = getOrCreateFootnoteNumber(identifier, noteNumbers)
      nextChildren.push({ type: 'text', value: `[${number}]` })
      continue
    }

    if ('children' in child && Array.isArray((child as any).children)) {
      ;(child as any).children = replaceFootnoteReferencesInPhrasing(
        (child as any).children as PhrasingContent[],
        noteNumbers
      )
    }

    nextChildren.push(child)
  }

  return nextChildren
}

function getOrCreateFootnoteNumber(identifier: string, noteNumbers: Map<string, number>): number {
  const existing = noteNumbers.get(identifier)
  if (existing != null) return existing

  const next = noteNumbers.size + 1
  noteNumbers.set(identifier, next)
  return next
}

function buildEndnoteNodes(
  noteNumbers: Map<string, number>,
  definitions: Map<string, FootnoteDefinitionNode>,
  orderedDefinitions: FootnoteDefinitionNode[]
): Root['children'] {
  const nodes: Root['children'] = [
    {
      type: 'paragraph',
      children: [
        {
          type: 'strong',
          children: [{ type: 'text', value: '注释' }],
        },
      ],
    },
  ]

  const ordered = [...noteNumbers.entries()].sort((a, b) => a[1] - b[1])
  for (const [identifier, number] of ordered) {
    const definition =
      definitions.get(identifier) ??
      orderedDefinitions.find((item) => item.identifier === identifier)

    const text = definition ? normalizeEndnoteText(stringifyFootnoteDefinition(definition)) : '未找到对应脚注内容'
    nodes.push({
      type: 'paragraph',
      children: [{ type: 'text', value: `[${number}] ${text}` }],
    })
  }

  return nodes
}

function stringifyFootnoteDefinition(node: FootnoteDefinitionNode): string {
  const processor = createMarkdownProcessor()
  const file = processor.runSync({
    type: 'root',
    children: node.children,
  } as Root)

  return stripMarkdownEscapesForFeishu(processor.stringify(file as any) as string)
}

function normalizeEndnoteText(value: string): string {
  return value
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 对当前 Markdown 执行标题升降级（直接修改，不依赖原始输入）
 */
export function shiftHeadingsInMarkdown(markdown: string, delta: number): string {
  if (!markdown.trim() || delta === 0) return markdown
  return shiftHeadingLines(markdown, delta)
}

function shiftHeadingLines(markdown: string, delta: number): string {
  const lines = markdown.split('\n')
  const shifted: string[] = []
  let changed = false
  let fence: { marker: '`' | '~'; length: number } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fenceMatch = getFenceMatch(line)
    if (fenceMatch) {
      if (fence && fence.marker === fenceMatch.marker && fenceMatch.length >= fence.length) {
        fence = null
      } else if (!fence) {
        fence = fenceMatch
      }
      shifted.push(line)
      continue
    }

    if (fence) {
      shifted.push(line)
      continue
    }

    const setextUnderline = lines[i + 1]
    if (setextUnderline != null && canBeSetextText(line) && isSetextUnderline(setextUnderline)) {
      const setextLevel = setextUnderline.trim().startsWith('=') ? 1 : 2
      shifted.push(formatAtxHeading(Math.max(1, setextLevel + delta), line.trim()))
      i += 1
      changed = true
      continue
    }

    const nextLine = shiftHeadingLine(line, delta)
    if (nextLine !== line) changed = true
    shifted.push(nextLine)
  }

  return changed ? shifted.join('\n').trimEnd() : markdown
}

function shiftHeadingLine(line: string, delta: number): string {
  const marker = line.match(/^(\s*)\*\*\[H(\d+)\]\*\*\s+(.+)$/)
  if (marker) {
    return `${marker[1]}${formatAtxHeading(Number.parseInt(marker[2], 10) + delta, marker[3])}`
  }

  const legacyMarker = line.match(/^(\s*)\*\*\[H(\d+)\]\s+(.+)\*\*\s*$/)
  if (legacyMarker) {
    return `${legacyMarker[1]}${formatAtxHeading(Number.parseInt(legacyMarker[2], 10) + delta, legacyMarker[3])}`
  }

  const atxHeading = line.match(/^(\s{0,3})(#{1,})\s+(.+?)\s*#*\s*$/)
  if (!atxHeading) return line

  return `${atxHeading[1]}${formatAtxHeading(atxHeading[2].length + delta, atxHeading[3])}`
}

function formatAtxHeading(level: number, title: string): string {
  return `${'#'.repeat(Math.max(1, level))} ${title.trim()}`
}

function isSetextUnderline(line: string): boolean {
  return /^\s{0,3}(?:=+|-+)\s*$/.test(line)
}

function canBeSetextText(line: string): boolean {
  if (!line.trim()) return false
  if (/^\s{0,3}#{1,}\s+\S/.test(line)) return false
  if (getFenceMatch(line)) return false
  if (/^\s{0,3}(?:[-*+]|\d{1,9}[.)])\s+/.test(line)) return false
  if (isSetextUnderline(line)) return false
  if (/^\s{0,3}>/.test(line)) return false
  return true
}

function getFenceMatch(line: string): { marker: '`' | '~'; length: number } | null {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})/)
  if (!match) return null

  const markerText = match[1]
  return {
    marker: markerText[0] as '`' | '~',
    length: markerText.length,
  }
}

/**
 * 序号规范化：将中文序号、括号序号、圈数字转为 Markdown 标准序号
 * 规则：
 * - 行首「一、」「十一、」「二十一、」→ 1. 11. 21.（只认顿号，不改句子里的逗号）
 * - 1、2、3、或 1. 2. 3. → 保持/规范为 1. 2. 3.
 * - 行首（1）（2）或 (1)(2) → 1. 2. 3.
 * - 行首 ① ② ③ → 1. 2. 3.
 */
export function normalizeNumberingInMarkdown(markdown: string): string {
  let result = markdown

  result = result.replace(
    new RegExp(`${LINE_NUM_PREFIX}([一二三四五六七八九十]{1,4})、\\s*`, 'gm'),
    (full: string, leading: string, bq: string, listMarker: string, cn: string) => {
      const num = parseChineseNumeral(cn)
      if (num == null) return full
      if (/^\d+\.\s+$/.test(listMarker)) {
        return `${leading}${bq}${listMarker}`
      }
      return `${leading}${bq}${num}. `
    }
  )

  result = result.replace(
    new RegExp(`${LINE_NUM_PREFIX}[(（](\\d{1,2})[)）]\\s*`, 'gm'),
    (_: string, leading: string, bq: string, listMarker: string, digits: string) => {
      if (/^\d+\.\s+$/.test(listMarker)) {
        return `${leading}${bq}${listMarker}`
      }
      return `${leading}${bq}${digits}. `
    }
  )

  result = result.replace(
    new RegExp(`${LINE_NUM_PREFIX}(${CIRCLE_NUM_ALT})\\s*`, 'gm'),
    (_: string, leading: string, bq: string, listMarker: string, circle: string) => {
      const num = CIRCLE_NUM_MAP[circle] ?? 1
      if (/^\d+\.\s+$/.test(listMarker)) {
        return `${leading}${bq}${listMarker}`
      }
      return `${leading}${bq}${num}. `
    }
  )

  result = result.replace(
    new RegExp(`${LINE_NUM_PREFIX}(\\d{1,2})、\\s*`, 'gm'),
    (_: string, leading: string, bq: string, listMarker: string, digits: string) => {
      if (/^\d+\.\s+$/.test(listMarker)) {
        return `${leading}${bq}${listMarker}`
      }
      return `${leading}${bq}${digits}. `
    }
  )

  return result
}
