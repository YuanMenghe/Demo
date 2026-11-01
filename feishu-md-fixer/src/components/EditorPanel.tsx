import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MDXEditor,
  type CodeBlockEditorDescriptor,
  type CodeBlockEditorProps,
  type MDXEditorMethods,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  tablePlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { htmlToMarkdown } from '../utils/htmlToMarkdown'

interface EditorPanelProps {
  editorRef: React.RefObject<MDXEditorMethods | null>
  onAutoPaste: (options: { copy: boolean }) => Promise<boolean>
  onPasteMarkdown: (markdown: string, options: { copy: boolean }) => void
  onOutputChange: (value: string) => void
  onCopyOutput: () => void
}

const COMMON_CODE_BLOCK_LANGUAGES = {
  '': 'Plain text',
  text: 'Plain text',
  md: 'Markdown',
  markdown: 'Markdown',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Bash',
  sh: 'Shell',
  python: 'Python',
  py: 'Python',
  js: 'JavaScript',
  ts: 'TypeScript',
  sql: 'SQL',
  r: 'R',
} as const

const LIGHTWEIGHT_CODE_BLOCK_DESCRIPTOR: CodeBlockEditorDescriptor = {
  priority: 0,
  match: () => true,
  Editor: LightweightCodeBlockEditor,
}

const BASE_MDX_PLUGINS = [
  headingsPlugin(),
  listsPlugin(),
  tablePlugin(),
  codeBlockPlugin({
    codeBlockEditorDescriptors: [LIGHTWEIGHT_CODE_BLOCK_DESCRIPTOR],
    defaultCodeBlockLanguage: 'text',
  }),
  quotePlugin(),
  thematicBreakPlugin(),
  markdownShortcutPlugin(),
  linkPlugin(),
  imagePlugin({ disableImageResize: true, disableImageSettingsButton: true }),
]

export function EditorPanel({
  editorRef,
  onAutoPaste,
  onPasteMarkdown,
  onOutputChange,
  onCopyOutput,
}: EditorPanelProps) {
  const [showPasteOverlay, setShowPasteOverlay] = useState(false)
  const [pasteAndCopy, setPasteAndCopy] = useState(false)
  const pasteTargetRef = useRef<HTMLDivElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement | null>(null)
  const plugins = useMemo(() => BASE_MDX_PLUGINS, [])

  useEffect(() => {
    if (showPasteOverlay && pasteTargetRef.current) {
      pasteTargetRef.current.focus()
    }
  }, [showPasteOverlay])

  useEffect(() => {
    const root = editorContainerRef.current?.querySelector('.mdx-editor-content')
    if (!root) return

    let frameId: number | null = null
    const decorate = () => {
      frameId = null
      decorateOverflowHeadings(root)
    }
    const scheduleDecorate = () => {
      if (frameId != null) return
      frameId = window.requestAnimationFrame(decorate)
    }

    decorate()

    const observer = new MutationObserver(() => scheduleDecorate())
    observer.observe(root, { childList: true, subtree: true, characterData: true })

    return () => {
      observer.disconnect()
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const openPasteOverlay = (withCopy: boolean) => {
    setPasteAndCopy(withCopy)
    setShowPasteOverlay(true)
  }

  const handleAutoPaste = async (withCopy: boolean) => {
    const ok = await onAutoPaste({ copy: withCopy })
    if (!ok) {
      openPasteOverlay(withCopy)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    const html = event.clipboardData?.getData('text/html') ?? ''
    const text = event.clipboardData?.getData('text/plain') ?? ''
    const markdown = htmlToMarkdown(html, text)
    setShowPasteOverlay(false)
    if (markdown) {
      onPasteMarkdown(markdown, { copy: pasteAndCopy })
    }
  }

  return (
    <main className="main-layout single-pane">
      <section className="pane pane-output">
        <div className="pane-header">
          <h2>处理结果</h2>
          <div className="btn-group">
            <button className="btn primary" onClick={() => handleAutoPaste(false)}>
              读取并清洗
            </button>
            <button className="btn outline" onClick={onCopyOutput}>
              复制到飞书
            </button>
          </div>
        </div>
        {/* 单框：MDXEditor 编辑即所见，无需切换 */}
        <div ref={editorContainerRef} className="preview-box preview-box-mdx">
          <MDXEditor
            ref={editorRef as React.RefObject<MDXEditorMethods>}
            markdown=""
            onChange={(markdown) => onOutputChange(markdown)}
            plugins={plugins}
            className="mdx-editor-feishu"
            contentEditableClassName="mdx-editor-content"
            placeholder="在此输入或粘贴内容…"
          />
        </div>
        {showPasteOverlay && (
          <div className="paste-overlay" onClick={() => setShowPasteOverlay(false)}>
            <div className="paste-modal" onClick={(e) => e.stopPropagation()}>
              <div className="paste-modal-title">在此按 Ctrl+V 粘贴网页内容</div>
              <div className="paste-modal-tip">支持从飞书、浏览器页面等直接复制过来，我们会自动保留结构并转换为 Markdown。</div>
              <div
                ref={pasteTargetRef}
                className="paste-target"
                contentEditable
                onPaste={handlePaste}
              />
              <div className="paste-modal-footer">粘贴完成后会自动关闭并开始清洗，无需手动确认。</div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function LightweightCodeBlockEditor({ code, language, focusEmitter }: CodeBlockEditorProps) {
  const { setCode, setLanguage } = useCodeBlockEditorContext()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const emitter = focusEmitter as unknown as { subscribe?: (listener: () => void) => void }
    emitter.subscribe?.(() => {
      textareaRef.current?.focus()
    })
  }, [focusEmitter])

  return (
    <div className="codeblock-lite">
      <div className="codeblock-lite-toolbar">
        <select
          className="codeblock-lite-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="代码块语言"
        >
          {Object.entries(COMMON_CODE_BLOCK_LANGUAGES).map(([value, label]) => (
            <option key={value || 'plain-text'} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        ref={textareaRef}
        className="codeblock-lite-editor"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
      />
    </div>
  )
}

function decorateOverflowHeadings(root: Element) {
  root.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.remove('overflow-heading')
    paragraph.removeAttribute('data-overflow-level')
    paragraph.removeAttribute('data-overflow-label')

    const badge = paragraph.firstElementChild
    if (badge instanceof HTMLElement && badge.tagName === 'STRONG') {
      const label = badge.textContent?.trim() ?? ''
      const marker = label.match(/^\[H(\d+)\]$/)
      if (marker) {
        badge.classList.add('overflow-heading-badge')
        paragraph.classList.add('overflow-heading')
        paragraph.setAttribute('data-overflow-level', marker[1])
        paragraph.setAttribute('data-overflow-label', `H${marker[1]}`)
        return
      }
      badge.classList.remove('overflow-heading-badge')
    }

    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    const hashes = text.match(/^(#{7,})\s+\S/)
    if (!hashes) return

    paragraph.classList.add('overflow-heading')
    paragraph.setAttribute('data-overflow-level', String(hashes[1].length))
    paragraph.setAttribute('data-overflow-label', `H${hashes[1].length}`)
  })
}
