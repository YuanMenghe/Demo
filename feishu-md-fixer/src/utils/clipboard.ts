export async function readFromClipboard(): Promise<string> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) return ''
  try {
    return await navigator.clipboard.readText()
  } catch {
    return ''
  }
}

export interface ClipboardRich {
  html: string
  text: string
  plainText: string
}

export async function readFromClipboardRich(): Promise<ClipboardRich> {
  const empty = { html: '', text: '', plainText: '' }
  if (typeof navigator === 'undefined' || !navigator.clipboard?.read) return empty
  try {
    const items = await navigator.clipboard.read()
    let html = ''
    let text = ''
    for (const item of items) {
      if (item.types.includes('text/html')) html = await item.getType('text/html').then((b) => b.text())
      if (item.types.includes('text/plain')) text = await item.getType('text/plain').then((b) => b.text())
    }
    const plainText = await readFromClipboard()
    return { html: html || '', text: text || '', plainText: plainText || '' }
  } catch {
    return empty
  }
}

/**
 * 使用 execCommand('copy') 作为降级，在 file:// 或非安全上下文中可用（需由用户手势触发）
 */
function fallbackCopyText(text: string): boolean {
  if (typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  textarea.setAttribute('readonly', '')
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
  return ok
}

import { normalizeForFeishuPaste } from './feishuPasteNormalize'

export async function writeToClipboard(text: string): Promise<boolean> {
  const normalized = normalizeForFeishuPaste(text)
  if (typeof navigator === 'undefined') return fallbackCopyText(normalized)
  try {
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([normalized], { type: 'text/plain' }),
          'text/html': new Blob([createFeishuClipboardHtml(normalized)], { type: 'text/html' }),
        }),
      ])
      return true
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(normalized)
      return true
    }
  } catch {
    /* 非安全上下文（如 file://）会抛错，走降级 */
  }
  return fallbackCopyText(normalized)
}

interface ClipboardListItem {
  value: number
  text: string
  task: 'checked' | 'open' | null
  children: ClipboardListNode[]
}

interface ClipboardListNode {
  ordered: boolean
  indent: number
  items: ClipboardListItem[]
}

export function createFeishuClipboardHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const parts: string[] = []
  let codeLines: string[] | null = null
  let fence: { marker: '`' | '~'; length: number } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fenceMatch = getFenceMatch(line)
    if (fenceMatch) {
      if (fence && fence.marker === fenceMatch.marker && fenceMatch.length >= fence.length) {
        parts.push(`<pre><code>${escapeHtml((codeLines ?? []).join('\n'))}</code></pre>`)
        codeLines = null
        fence = null
      } else if (!fence) {
        fence = fenceMatch
        codeLines = []
      } else {
        codeLines?.push(line)
      }
      continue
    }

    if (fence) {
      codeLines?.push(line)
      continue
    }

    if (!line.trim()) continue

    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const rows = [splitTableRow(line)]
      i += 2
      while (i < lines.length && isTableRow(lines[i]) && !isTableSeparator(lines[i])) {
        rows.push(splitTableRow(lines[i]))
        i += 1
      }
      i -= 1
      parts.push(renderTable(rows))
      continue
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (image) {
      parts.push(`<p><img alt="${escapeHtml(image[1])}" src="${escapeHtml(image[2])}"></p>`)
      continue
    }

    const listItem = parseListItem(line)
    if (listItem) {
      const parsed = parseClipboardList(lines, i)
      parts.push(renderClipboardList(parsed.node))
      i = parsed.next - 1
      continue
    }

    const heading = line.match(/^(#{1,9})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      parts.push(`<h${level}>${formatInlineHtml(heading[2])}</h${level}>`)
      continue
    }

    parts.push(`<p>${formatInlineHtml(line)}</p>`)
  }

  if (codeLines) parts.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)

  return `<html><body>${parts.join('')}</body></html>`
}

function parseClipboardList(lines: string[], start: number): { node: ClipboardListNode; next: number } {
  const first = parseListItem(lines[start])!
  const root: ClipboardListNode = { ordered: first.ordered, indent: first.indent, items: [] }
  const stack: ClipboardListNode[] = [root]
  let i = start

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || getFenceMatch(line)) break

    const item = parseListItem(line)
    if (!item || item.indent < root.indent) break

    while (stack.length > 1 && item.indent < stack[stack.length - 1].indent) {
      stack.pop()
    }

    const current = stack[stack.length - 1]
    if (item.indent === current.indent && item.ordered !== current.ordered) {
      if (stack.length === 1) break
      stack.pop()
    }

    const target = stack[stack.length - 1]
    if (item.indent > target.indent) {
      const parent = target.items[target.items.length - 1]
      if (!parent) break
      const nested: ClipboardListNode = { ordered: item.ordered, indent: item.indent, items: [] }
      parent.children.push(nested)
      stack.push(nested)
    } else if (item.indent < target.indent) {
      break
    }

    const task = splitTask(item.text)
    stack[stack.length - 1].items.push({ value: item.value, text: task.text, task: task.task, children: [] })
    i += 1
  }

  return { node: root, next: i }
}

function parseListItem(line: string): { indent: number; ordered: boolean; value: number; text: string } | null {
  const ordered = line.match(/^([ \t]*)(\d{1,9})\.\s+(.+)$/)
  if (ordered) {
    return {
      indent: ordered[1].length,
      ordered: true,
      value: Number.parseInt(ordered[2], 10),
      text: ordered[3],
    }
  }

  const unordered = line.match(/^([ \t]*)[-*+]\s+(.+)$/)
  if (!unordered) return null
  return {
    indent: unordered[1].length,
    ordered: false,
    value: 1,
    text: unordered[2],
  }
}

function renderClipboardList(node: ClipboardListNode): string {
  const tag = node.ordered ? 'ol' : 'ul'
  const start = node.items[0]?.value ?? 1
  const startAttr = node.ordered ? ` start="${start}"` : ''
  const items = node.items
    .map((item, index) => {
      const expected = start + index
      const valueAttr = node.ordered && item.value !== expected ? ` value="${item.value}"` : ''
      const nested = item.children.map((child) => renderClipboardList(child)).join('')
      const checkbox =
        item.task == null
          ? ''
          : `<input type="checkbox" disabled${item.task === 'checked' ? ' checked' : ''}> `
      return `<li${valueAttr}>${checkbox}${formatInlineHtml(item.text)}${nested}</li>`
    })
    .join('')
  return `<${tag}${startAttr}>${items}</${tag}>`
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1
}

function splitTableRow(line: string): string[] {
  let inner = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let current = ''

  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '\\' && inner[i + 1] === '|') {
      current += '|'
      i += 1
      continue
    }
    if (inner[i] === '|') {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += inner[i]
  }

  cells.push(current.trim())
  return cells
}

function renderTable(rows: string[][]): string {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0)
  const normalized = rows.map((row) => {
    const copy = row.slice()
    while (copy.length < width) copy.push('')
    return copy
  })
  const head = normalized[0].map((cell) => `<th>${formatInlineHtml(cell)}</th>`).join('')
  const body = normalized
    .slice(1)
    .map((row) => `<tr>${row.map((cell) => `<td>${formatInlineHtml(cell)}</td>`).join('')}</tr>`)
    .join('')
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

function splitTask(text: string): { task: 'checked' | 'open' | null; text: string } {
  const match = text.match(/^\[([ xX])\]\s+(.*)$/)
  if (!match) return { task: null, text }
  return { task: match[1].toLowerCase() === 'x' ? 'checked' : 'open', text: match[2] }
}

function formatInlineHtml(value: string): string {
  let html = escapeHtml(value)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  return html
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

