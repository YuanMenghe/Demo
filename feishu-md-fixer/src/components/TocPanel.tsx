import { headingLevelLabel, type TocHeading } from '../utils/tocHeadings'

interface TocPanelProps {
  items: TocHeading[]
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

export function TocPanel({ items }: TocPanelProps) {
  const minLevel = items.reduce((level, item) => Math.min(level, item.level), items[0]?.level ?? 1)

  return (
    <nav className="pane toc-pane" aria-label="目录">
      <ol className="toc-list">
        {items.map((item, index) => {
          const levelLabel = headingLevelLabel(item.level)
          return (
            <li key={`${item.level}-${index}`} style={{ paddingLeft: `${(item.level - minLevel) * 12}px` }}>
              <button
                type="button"
                className="toc-link"
                title={item.text}
                onClick={() => scrollToHeading(index)}
              >
                <span className="toc-level" title={`${levelLabel}标题`}>
                  {levelLabel}
                </span>
                <span className="toc-link-text">{item.text}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
