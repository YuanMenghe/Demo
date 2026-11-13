import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'

export function createMarkdownProcessor() {
  return unified().use(remarkParse).use(remarkGfm).use(remarkStringify, {
    bullet: '-',
    fences: true,
    listItemIndent: 'one',
  })
}

const PROSE_ESCAPES = new Set('.*+?^${}()[]\\-_#!`<>~&:'.split(''))

/**
 * 去掉 remark 输出的反斜杠转义，便于复制到飞书时显示为正常文字（飞书会按原文显示 \. \& 等）。
 * 代码围栏和行内代码保持原样；不还原 \|，避免把表格单元格里的竖线拆成新列。
 */
export function stripMarkdownEscapesForFeishu(text: string): string {
  const lines = text.split(/\r?\n/)
  let fence: { marker: '`' | '~'; length: number } | null = null

  return lines
    .map((line) => {
      const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
      if (fenceMatch) {
        const markerText = fenceMatch[1]
        const marker = markerText[0] as '`' | '~'
        const length = markerText.length
        if (fence && fence.marker === marker && length >= fence.length) {
          fence = null
        } else if (!fence) {
          fence = { marker, length }
        }
        return line
      }

      if (fence) return line
      return stripEscapesInProseLine(line)
    })
    .join('\n')
}

/**
 * 编辑器按 MDX 解析。正文里的 `<用户>` 这类未闭合标签会让整篇导入失败，画面只剩占位符。
 * 围栏和行内代码保持原样；已经写成 `\<` 的不再加一层。
 */
export function escapeMarkdownForEditor(text: string): string {
  if (!text) return ''
  const lines = text.split(/\r?\n/)
  let fence: { marker: '`' | '~'; length: number } | null = null

  return lines
    .map((line) => {
      const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
      if (fenceMatch) {
        const markerText = fenceMatch[1]
        const marker = markerText[0] as '`' | '~'
        const length = markerText.length
        if (fence && fence.marker === marker && length >= fence.length) {
          fence = null
        } else if (!fence) {
          fence = { marker, length }
        }
        return line
      }

      if (fence) return line
      return escapeEditorSpecialsInProseLine(line)
    })
    .join('\n')
}

function escapeEditorSpecialsInProseLine(line: string): string {
  let result = ''

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '`') {
      const ticks = line.slice(i).match(/^`+/)?.[0]
      if (ticks) {
        const close = line.indexOf(ticks, i + ticks.length)
        if (close !== -1) {
          result += line.slice(i, close + ticks.length)
          i = close + ticks.length - 1
          continue
        }
      }
    }

    if (line[i] === '\\' && (line[i + 1] === '<' || line[i + 1] === '{')) {
      result += line[i] + line[i + 1]
      i += 1
      continue
    }

    if (line[i] === '<' || line[i] === '{') {
      result += '\\' + line[i]
      continue
    }

    result += line[i]
  }

  return result
}

function stripEscapesInProseLine(line: string): string {
  let result = ''

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '`') {
      const ticks = line.slice(i).match(/^`+/)?.[0]
      if (ticks) {
        const close = line.indexOf(ticks, i + ticks.length)
        if (close !== -1) {
          result += line.slice(i, close + ticks.length)
          i = close + ticks.length - 1
          continue
        }
      }
    }

    if (line[i] === '\\') {
      const next = line[i + 1]
      if (next && PROSE_ESCAPES.has(next)) {
        result += next
        i += 1
        continue
      }
      if (next == null) continue
    }

    result += line[i]
  }

  return result
}
