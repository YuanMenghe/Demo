export interface TocHeading {
  level: number
  text: string
}

const FENCE = /^\s*(```|~~~)/
const ATX = /^\s{0,3}(#{1,12})\s+(.+?)\s*#*\s*$/
const OVERFLOW = /^\s{0,3}\*\*\[H(\d+)\]\*\*\s+(.+?)\s*$/

function headingLabel(raw: string): string {
  return raw
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim()
}

/** 按正文出现顺序收集标题，跳过代码围栏。 */
export function extractMarkdownHeadings(markdown: string): TocHeading[] {
  const items: TocHeading[] = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const atx = ATX.exec(line)
    if (atx) {
      const text = headingLabel(atx[2])
      if (text) items.push({ level: atx[1].length, text })
      continue
    }
    const overflow = OVERFLOW.exec(line)
    if (!overflow) continue
    const text = headingLabel(overflow[2])
    if (text) items.push({ level: Number.parseInt(overflow[1], 10), text })
  }
  return items
}
