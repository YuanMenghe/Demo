import { useMemo } from 'react'
import { extractMarkdownHeadings } from '../utils/tocHeadings'

interface TocPanelProps {
  markdown: string
}

function scrollToHeading(index: number) {
  const root = document.querySelector('.mdx-editor-content')
  if (!root) return
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6, .overflow-heading')
  const target = headings[index]
  if (!(target instanceof HTMLElement)) return
  const scroller = target.closest('.mdxeditor-root-contenteditable')
  if (!(scroller instanceof HTMLElement)) {
    target.scrollIntoView({ block: 'start' })
    return
  }
  const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  scroller.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' })
}

export function TocPanel({ markdown }: TocPanelProps) {
  const items = useMemo(() => extractMarkdownHeadings(markdown), [markdown])
  const minLevel = items.reduce((level, item) => Math.min(level, item.level), items[0]?.level ?? 1)

  return (
    <nav className="pane toc-pane" aria-label="目录">
      {items.length === 0 ? (
        <p className="toc-empty">暂无标题</p>
      ) : (
        <ol className="toc-list">
          {items.map((item, index) => (
            <li key={`${item.level}-${index}`} style={{ paddingLeft: `${(item.level - minLevel) * 12}px` }}>
              <button type="button" className="toc-link" onClick={() => scrollToHeading(index)}>
                {item.text}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}
