/**
 * 写入剪贴板前规范化：所有连续换行改为单换行，粘贴到飞书时不再出现多余空行
 */
export function normalizeForFeishuPaste(text: string): string {
  const lines = normalizeLinesForFeishuPaste(text).split('\n')
  const kept: string[] = []
  let fence: { marker: '`' | '~'; length: number } | null = null

  for (const line of lines) {
    const fenceMatch = getFenceMatch(line)
    if (fenceMatch) {
      if (fence && fence.marker === fenceMatch.marker && fenceMatch.length >= fence.length) {
        fence = null
      } else if (!fence) {
        fence = fenceMatch
      }
      kept.push(line)
      continue
    }

    if (fence) {
      kept.push(line)
      continue
    }

    if (!line.trim()) continue
    kept.push(line)
  }

  return kept.join('\n').trimEnd()
}

function normalizeLinesForFeishuPaste(text: string): string {
  const lines = text.split('\n')
  let fence: { marker: '`' | '~'; length: number } | null = null

  return lines
    .map((line) => {
      const fenceMatch = getFenceMatch(line)
      if (fenceMatch) {
        if (fence && fence.marker === fenceMatch.marker && fenceMatch.length >= fence.length) {
          fence = null
        } else if (!fence) {
          fence = fenceMatch
        }
        return line
      }

      if (fence) return line

      return normalizeOrderedListLineForFeishuPaste(normalizeHeadingLineForFeishuPaste(line))
    })
    .join('\n')
}

function normalizeOrderedListLineForFeishuPaste(line: string): string {
  const orderedList = line.match(/^(\s{0,3}(?:>\s*)*\s*)(\d{1,9})(?:\\?\.|．)\s*(\S.*)$/)
  if (!orderedList) return line

  return `${orderedList[1]}${orderedList[2]}. ${orderedList[3]}`
}

function normalizeHeadingLineForFeishuPaste(line: string): string {
  // 允许前缀：引用（可多层）+ 缩进 + 列表标记（无序/有序）
  // 例：
  // - **[H7]** 标题
  // 1. **[H7]** 标题
  // > - **[H7]** 标题
  const prefixRe = '((?:\\s{0,3}>\\s*)*\\s{0,3}(?:(?:[-*+]\\s+)|(?:\\d+\\.\\s+))?)'

  const strongMarker = line.match(new RegExp(`^${prefixRe}(?:#{1,6}\\s+)?\\*\\*\\[H(\\d+)\\]\\*\\*\\s+(.+)$`))
  if (strongMarker) {
    return formatFeishuHeading(strongMarker[1], strongMarker[2], strongMarker[3])
  }

  const legacyStrongMarker = line.match(new RegExp(`^${prefixRe}(?:#{1,6}\\s+)?\\*\\*\\[H(\\d+)\\]\\s+(.+)\\*\\*\\s*$`))
  if (legacyStrongMarker) {
    return formatFeishuHeading(legacyStrongMarker[1], legacyStrongMarker[2], legacyStrongMarker[3])
  }

  const copiedMarker = line.match(new RegExp(`^${prefixRe}(#{1,6})\\s+\\[H(\\d+)\\]\\s+(.+)$`))
  if (copiedMarker) {
    return formatFeishuHeading(copiedMarker[1], copiedMarker[3], copiedMarker[4])
  }

  const invalidAtxHeading = line.match(new RegExp(`^${prefixRe}(#{7,})\\s+(.+)$`))
  if (invalidAtxHeading) {
    return formatFeishuHeading(invalidAtxHeading[1], String(invalidAtxHeading[2].length), invalidAtxHeading[3])
  }

  return line
}

function formatFeishuHeading(prefix: string, levelText: string, rawTitle: string): string {
  const level = Number.parseInt(levelText, 10)
  if (!Number.isFinite(level)) return `${prefix}# ${rawTitle.trim()}`

  const title = cleanAtxHeadingTitle(rawTitle)
  const marker = '#'.repeat(Math.max(level, 1))
  if (!title) return `${prefix}${marker}`

  return `${prefix}${marker} ${title}`
}

function cleanAtxHeadingTitle(title: string): string {
  return title.replace(/\s+#{1,}\s*$/, '').trim()
}

function getFenceMatch(line: string): { marker: '`' | '~'; length: number } | null {
  const unquotedLine = line.replace(/^(?: {0,3}>\s*)+/, '')
  const match = unquotedLine.match(/^ {0,3}(`{3,}|~{3,})/)
  if (!match) return null

  const markerText = match[1]
  return {
    marker: markerText[0] as '`' | '~',
    length: markerText.length,
  }
}
