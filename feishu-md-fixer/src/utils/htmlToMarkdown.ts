import TurndownService from 'turndown'

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})

/**
 * 辅助函数：从 Node 中提取文本，兼容浏览器和 JSDOM
 */
function getNodeText(node: Node): string {
  if (node.textContent != null) {
    return node.textContent.trim()
  }
  return ''
}

/**
 * 辅助函数：获取子元素，兼容浏览器和 JSDOM
 */
function getDirectCells(node: Node): Node[] {
  const result: Node[] = []
  const children = node.childNodes
  for (let i = 0; i < children.length; i++) {
    const name = children[i].nodeName.toLowerCase()
    if (name === 'th' || name === 'td') result.push(children[i])
  }
  return result
}

function getChildren(node: Node, tagName: string): Node[] {
  const result: Node[] = []
  const children = node.childNodes
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.nodeName.toLowerCase() === tagName.toLowerCase()) {
      result.push(child)
    }
    // 递归查找（处理 thead/tbody 包装）
    if (child.nodeName.toLowerCase() === 'thead' || 
        child.nodeName.toLowerCase() === 'tbody') {
      result.push(...getChildren(child, tagName))
    }
  }
  return result
}

// 飞书表格处理：将 HTML table 转为 Markdown 表格
turndown.addRule('feishuTable', {
  filter: 'table',
  replacement: function (_content, node) {
    const rows: string[][] = []
    let maxCols = 0

    // 收集所有行（包括 thead 和 tbody）
    const allRows = getChildren(node, 'tr')
    allRows.forEach((tr) => {
      const cells: string[] = []
      const allCells = getDirectCells(tr)
      allCells.forEach((cell) => {
        // 获取单元格文本
        let text = getNodeText(cell)
        // 转义管道符
        text = text.replace(/\|/g, '\\|')
        // 处理换行
        text = text.replace(/\n/g, ' ')
        cells.push(text)
      })
      if (cells.length > 0) {
        rows.push(cells)
        maxCols = Math.max(maxCols, cells.length)
      }
    })

    if (rows.length === 0 || maxCols === 0) {
      return ''
    }

    // 补齐列数
    rows.forEach((row) => {
      while (row.length < maxCols) {
        row.push('')
      }
    })

    // 生成 Markdown 表格
    const lines: string[] = []
    
    // 表头（第一行）
    lines.push('| ' + rows[0].join(' | ') + ' |')
    
    // 分隔行
    lines.push('| ' + Array(maxCols).fill('---').join(' | ') + ' |')
    
    // 数据行
    for (let i = 1; i < rows.length; i++) {
      lines.push('| ' + rows[i].join(' | ') + ' |')
    }

    return '\n\n' + lines.join('\n') + '\n\n'
  },
})

// 处理表格单元格内的 span/div 等，保留文本
turndown.addRule('tableCell', {
  filter: ['th', 'td'],
  replacement: function (content) {
    return content.trim()
  },
})

// Turndown 默认会把有序列表都写成 "1."，这里改为递增编号，便于复制后直观阅读。
turndown.addRule('orderedListItem', {
  filter: function (node) {
    return (
      node.nodeName.toLowerCase() === 'li' &&
      node.parentNode?.nodeName.toLowerCase() === 'ol'
    )
  },
  replacement: function (content, node) {
    const parent = node.parentNode
    if (!parent) return `1. ${content}\n`

    const start = Number((parent as Element).getAttribute('start') ?? '1')
    const siblings = Array.from(parent.childNodes).filter(
      (child) => child.nodeName.toLowerCase() === 'li'
    )
    const index = siblings.findIndex((child) => child === node)
    const marker = (Number.isFinite(start) ? start : 1) + Math.max(index, 0)
    const markerText = `${marker}. `
    const body = content.replace(/^\n+/, '').replace(/\n+$/, '')
    const indented = body.replace(/\n/g, `\n${' '.repeat(markerText.length)}`)
    return `${markerText}${indented}\n`
  },
})

export function htmlToMarkdown(html: string, fallbackText: string): string {
  const trimmed = html.trim()
  if (trimmed) {
    try {
      const converted = turndown.turndown(trimmed)
      return normalizeImportedMarkdown(pickBetterMarkdown(converted, fallbackText))
    } catch {
      // ignore and fall through
    }
  }
  return normalizeImportedMarkdown(fallbackText)
}

function pickBetterMarkdown(converted: string, fallbackText: string): string {
  const convertedTrimmed = converted.trim()
  const fallbackTrimmed = fallbackText.trim()

  if (!fallbackTrimmed) return converted
  if (!convertedTrimmed) return fallbackText

  // 剪贴板 HTML 常丢失代码块/表格等结构；若纯文本明显更完整，优先用纯文本。
  if (hasFencedCodeBlock(fallbackTrimmed) && !hasFencedCodeBlock(convertedTrimmed)) {
    return fallbackText
  }

  if (hasMarkdownTable(fallbackTrimmed) && !hasMarkdownTable(convertedTrimmed)) {
    return fallbackText
  }

  if (hasTaskList(fallbackTrimmed) && !hasTaskList(convertedTrimmed)) {
    return fallbackText
  }

  if (fallbackTrimmed.length > convertedTrimmed.length * 1.8) {
    return fallbackText
  }

  return converted
}

function hasFencedCodeBlock(value: string): boolean {
  return /(^|\n)```[\s\S]*?\n```(?=\n|$)/m.test(value)
}

function hasMarkdownTable(value: string): boolean {
  return /(^|\n)\|.+\|\n\|[\s:-]+\|/m.test(value)
}

function hasTaskList(value: string): boolean {
  return /(^|\n)\s*[-*]\s\[[ xX]\]\s/m.test(value)
}

export function normalizeImportedMarkdown(value: string): string {
  if (!value) return value

  return normalizeNestedBacktickFences(value)
}

interface FenceFrame {
  indent: string
  suffix: string
  length: number
  outputIndex: number
}

function normalizeNestedBacktickFences(value: string): string {
  const lines = value.split(/\r?\n/)
  const output: string[] = []
  const stack: FenceFrame[] = []

  for (const line of lines) {
    const match = line.match(/^([ \t]*)```([^`]*)$/)
    if (!match) {
      output.push(line)
      continue
    }

    const [, indent, suffix] = match
    const isBareFence = suffix.trim() === ''

    if (stack.length > 0 && isBareFence) {
      const frame = stack.pop()!
      output.push(`${indent}${'`'.repeat(frame.length)}`)
      continue
    }

    if (stack.length > 0) {
      for (const frame of stack) {
        frame.length += 1
        output[frame.outputIndex] = `${frame.indent}${'`'.repeat(frame.length)}${frame.suffix}`
      }
    }

    const frame: FenceFrame = {
      indent,
      suffix,
      length: 3,
      outputIndex: output.length,
    }
    output.push(`${indent}\`\`\`${suffix}`)
    stack.push(frame)
  }

  return output.join('\n')
}
