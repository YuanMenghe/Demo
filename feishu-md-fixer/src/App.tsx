import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './style.css'
import { TemplateSelector } from './components/TemplateSelector'
import { TemplateManager } from './components/TemplateManager'
import { RulesPanel } from './components/RulesPanel'
import { UserGuide, getGuideSeen, setGuideSeen } from './components/UserGuide'
import { applyPipeline } from './core/pipeline'
import { collapseMarkdownBlankLines, shiftHeadingsInMarkdown, normalizeNumberingInMarkdown } from './core/transformers'
import { BUILTIN_TEMPLATES, loadActiveTemplateState, loadTemplates, resolveTemplateConfig, saveActiveTemplateState, type Template, type TemplateConfig } from './core/templates'
import { readFromClipboardRich, writeToClipboard } from './utils/clipboard'
import { htmlToMarkdown } from './utils/htmlToMarkdown'
import { syncEditorMarkdown } from './utils/editorSync'
import { pickBetterClipboardText } from './utils/markdownSignals'
import { useHistory } from './hooks/useHistory'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from './brand'

const EditorPanel = lazy(async () => {
  const mod = await import('./components/EditorPanel')
  return { default: mod.EditorPanel }
})

export function App() {
  const [templates, setTemplates] = useState<Template[]>(() => loadTemplates())
  // 初始化：优先读取上次会话保存的 templateId 与各模板配置覆盖
  const initialActiveState = useMemo(() => loadActiveTemplateState(), [])
  const initialTemplates = useMemo(() => loadTemplates(), [])
  const initialTemplateId = useMemo(() => {
    const savedId = initialActiveState?.templateId
    if (savedId && initialTemplates.some((t) => t.id === savedId)) return savedId
    return BUILTIN_TEMPLATES[0]?.id ?? 'feishu-default'
  }, [initialActiveState, initialTemplates])
  const [templateId, setTemplateId] = useState<string>(initialTemplateId)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [guideFirstTime, setGuideFirstTime] = useState(false)
  const [config, setConfig] = useState<TemplateConfig>(() => {
    const baseTemplate =
      initialTemplates.find((t) => t.id === initialTemplateId) ?? BUILTIN_TEMPLATES[0]
    const override = initialActiveState?.overrides?.[initialTemplateId]
    return resolveTemplateConfig(baseTemplate.config, override)
  })
  /** 持久化用户对各模板的配置覆盖；按 templateId 维度保存 */
  const overridesRef = useRef<Record<string, TemplateConfig>>(
    initialActiveState?.overrides ? { ...initialActiveState.overrides } : {}
  )
  const editorRef = useRef<MDXEditorMethods | null>(null)
  const skipNextProcessRef = useRef(false)
  const suppressNextEditorChangeRef = useRef(false)
  /** 始终指向最新规则，供「防抖后的」自动处理 effect 使用，避免闭包滞后 */
  const configRef = useRef(config)
  configRef.current = config

  // 使用带历史记录的 output 状态，支持 Undo/Redo
  const history = useHistory('')
  const historyRef = useRef(history)
  historyRef.current = history
  const output = history.current

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 6000)
    return () => clearTimeout(timer)
  }, [status])

  const handleTemplateIdChange = useCallback(
    (id: string) => {
      setTemplateId(id)
      const t = templates.find((x) => x.id === id)
      if (!t) return
      // 切换模板时优先使用用户对该模板的历史调整，否则使用模板自带默认配置
      const override = overridesRef.current[id]
      setConfig(resolveTemplateConfig(t.config, override))
    },
    [templates]
  )

  // 持久化：每当 templateId / config 变化，写回 localStorage，刷新后保留
  useEffect(() => {
    overridesRef.current = {
      ...overridesRef.current,
      [templateId]: resolveTemplateConfig(config),
    }
    saveActiveTemplateState({
      templateId,
      overrides: overridesRef.current,
    })
  }, [templateId, config])

  // 当 templates 列表变化（如保存自定义模板）后，若当前 templateId 不再存在则回退到第一个内置模板
  useEffect(() => {
    if (templates.some((t) => t.id === templateId)) return
    const fallback = BUILTIN_TEMPLATES[0]
    if (!fallback) return
    const override = overridesRef.current[fallback.id]
    setTemplateId(fallback.id)
    setConfig(resolveTemplateConfig(fallback.config, override))
  }, [templates, templateId])

  const [showHint, setShowHint] = useState(() => !getGuideSeen())
  const sourceRef = useRef('')
  const editedRef = useRef(false)
  const [followsPaste, setFollowsPaste] = useState(true)
  /** 最近一次程序写入编辑器的正文。编辑器回写只补空行时，不当成用户手动修改。 */
  const lastProgrammaticRef = useRef('')

  const syncOutputEditor = useCallback((value: string) => {
    lastProgrammaticRef.current = value
    suppressNextEditorChangeRef.current = true
    const synced = syncEditorMarkdown(editorRef.current, value)
    if (!synced) {
      suppressNextEditorChangeRef.current = false
      return
    }

    window.setTimeout(() => {
      suppressNextEditorChangeRef.current = false
    }, 80)
  }, [])

  // 键盘快捷键：Ctrl+Z 撤销, Ctrl+Y 重做
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略编辑区内的快捷键，让输入组件自己处理 Ctrl/Cmd+A、Z、Y 等默认行为
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.closest('input, textarea, [contenteditable="true"]') || target.isContentEditable)
      ) {
        return
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          if (history.canUndo) {
            history.undo()
            setTimeout(() => {
              syncOutputEditor(historyRef.current.current)
            }, 0)
            setStatus('已撤销')
          }
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault()
          if (history.canRedo) {
            history.redo()
            setTimeout(() => {
              syncOutputEditor(historyRef.current.current)
            }, 0)
            setStatus('已重做')
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history.canUndo, history.canRedo, history.undo, history.redo, syncOutputEditor])

  // 只依赖稳定的 history.set，避免随 current 每键变化导致下游 useEffect 误触发
  const setOutput = useCallback((value: string, recordHistory = false) => {
    history.set(value, recordHistory)
  }, [history.set])

  const runProcess = useCallback(
    (text: string, recordHistory = false) => {
      if (!text) {
        setOutput('', recordHistory)
        return ''
      }
      const processed = applyPipeline(text, { template: config })
      setOutput(processed, recordHistory)
      return processed
    },
    [config, setOutput]
  )

  // Undo/Redo 处理
  const handleUndo = useCallback(() => {
    if (!history.canUndo) return
    history.undo()
    setTimeout(() => {
      syncOutputEditor(historyRef.current.current)
    }, 0)
    setStatus('已撤销')
  }, [history.canUndo, history.undo, syncOutputEditor])

  const handleRedo = useCallback(() => {
    if (!history.canRedo) return
    history.redo()
    setTimeout(() => {
      syncOutputEditor(historyRef.current.current)
    }, 0)
    setStatus('已重做')
  }, [history.canRedo, history.redo, syncOutputEditor])

  const handlePastedMarkdown = useCallback(
    async (markdown: string, options: { copy: boolean }) => {
      if (!markdown) {
        setStatus('粘贴内容为空，未进行处理')
        return
      }
      sourceRef.current = markdown
      editedRef.current = false
      setFollowsPaste(true)
      setInput(markdown)
      const processed = runProcess(markdown, true)
      syncOutputEditor(processed)
      if (options.copy && processed) {
        const ok = await writeToClipboard(processed)
        setStatus(ok ? '已清洗并复制，可粘贴到飞书' : '已清洗，但写入剪贴板失败')
      } else {
        setStatus('已清洗，可继续编辑或复制到飞书')
      }
    },
    [runProcess, syncOutputEditor]
  )

  const handleAutoPaste = useCallback(
    async (options: { copy: boolean }): Promise<boolean> => {
      const { html, text, plainText } = await readFromClipboardRich()
      const fallbackText = pickBetterClipboardText(text, plainText)
      const markdown = htmlToMarkdown(html, fallbackText)
      if (!markdown.trim()) return false
      sourceRef.current = markdown
      editedRef.current = false
      setFollowsPaste(true)
      setInput(markdown)
      const processed = runProcess(markdown, true)
      syncOutputEditor(processed)
      if (options.copy && processed) {
        const ok = await writeToClipboard(processed)
        setStatus(ok ? '已读取、清洗并复制，可粘贴到飞书' : '已清洗，但写入剪贴板失败')
      } else {
        setStatus('已读取并清洗，可继续编辑或复制到飞书')
      }
      return true
    },
    [runProcess, syncOutputEditor]
  )

  const handleCopyOutput = useCallback(async () => {
    const text = editorRef.current?.getMarkdown() ?? output
    if (!text) {
      setStatus('没有可复制的内容')
      return
    }
    const ok = await writeToClipboard(text)
    setStatus(ok ? '已复制，可直接粘贴到飞书' : '复制失败，请手动复制')
  }, [output])

  const handleShiftHeadings = useCallback((delta: number) => {
    const currentMd = editorRef.current?.getMarkdown() ?? output
    if (!currentMd.trim()) {
      setStatus('没有内容可操作')
      return
    }
    const shifted = shiftHeadingsInMarkdown(currentMd, delta)
    // 将升降级后的内容作为新的 input，跳过下一次自动处理
    sourceRef.current = shifted
    editedRef.current = false
    setFollowsPaste(false)
    skipNextProcessRef.current = true
    setInput(shifted)
    setOutput(shifted, true) // 记录历史，支持撤销
    syncOutputEditor(shifted)
    setStatus(delta > 0 ? '已将所有标题降级（可撤销）' : '已将所有标题升级（可撤销）')
  }, [output, setOutput, syncOutputEditor])

  const handleNormalizeNumbering = useCallback(() => {
    const currentMd = editorRef.current?.getMarkdown() ?? output
    if (!currentMd.trim()) {
      setStatus('没有内容可操作')
      return
    }
    const normalized = normalizeNumberingInMarkdown(currentMd)
    // 将规范化后的内容作为新的 input，跳过下一次自动处理
    sourceRef.current = normalized
    editedRef.current = false
    setFollowsPaste(false)
    skipNextProcessRef.current = true
    setInput(normalized)
    setOutput(normalized, true) // 记录历史，支持撤销
    syncOutputEditor(normalized)
    setStatus('已规范化序号（可撤销）')
  }, [output, setOutput, syncOutputEditor])

  useEffect(() => {
    // 如果刚执行了升降级/规范化，跳过这次自动处理
    if (skipNextProcessRef.current) {
      skipNextProcessRef.current = false
      return
    }
    // 没手动改过时，按最初粘贴的原文重算，避免编辑器回写丢掉图片、删除线等。
    // 手动改过之后，以当前正文为准。
    const currentMd = editorRef.current?.getMarkdown()
    const source = sourceRef.current.trim()
    const textToProcess = !editedRef.current && source
      ? sourceRef.current
      : currentMd?.trim()
        ? currentMd
        : input
    if (!textToProcess.trim()) {
      setOutput('', false)
      syncOutputEditor('')
      return
    }
    if (editedRef.current) sourceRef.current = textToProcess
    const processed = applyPipeline(textToProcess, { template: configRef.current })
    editedRef.current = false
    if (processed !== historyRef.current.current) setOutput(processed, false)
    syncOutputEditor(processed)
  }, [config, input, templateId, setOutput, syncOutputEditor])

  const handleEditorChange = useCallback((value: string) => {
    if (suppressNextEditorChangeRef.current) return
    const synced = lastProgrammaticRef.current
    if (synced && collapseMarkdownBlankLines(value, 0) === collapseMarkdownBlankLines(synced, 0)) return
    lastProgrammaticRef.current = ''
    editedRef.current = true
    setFollowsPaste(false)
    setOutput(value, true)
  }, [setOutput])

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <img className="brand-logo" src={BRAND_LOGO_URL} alt={BRAND_LOGO_ALT} width={40} height={40} />
          <div className="brand-text">
            <div className="brand-title">NOAH Markdown 助手</div>
            <div className="brand-subtitle">飞书粘贴一键清洗</div>
          </div>
        </div>
        <div className="header-slot">
          {showHint && (
            <div className="header-hint" role="note">
              <span className="header-hint-text">先点「读取并清洗」，确认结果后再点「复制到飞书」。</span>
              <span className="header-hint-actions">
                <button type="button" className="header-hint-btn" onClick={() => { setGuideFirstTime(true); setShowGuide(true) }}>
                  查看步骤
                </button>
                <button
                  type="button"
                  className="header-hint-btn"
                  onClick={() => {
                    setGuideSeen(true)
                    setShowHint(false)
                  }}
                >
                  关闭
                </button>
              </span>
            </div>
          )}
        </div>
        <div className="template-area">
          <button type="button" className="btn ghost" onClick={() => { setGuideFirstTime(false); setShowGuide(true) }}>
            使用指南
          </button>
          <TemplateSelector
            templates={templates}
            activeId={templateId}
            onChange={handleTemplateIdChange}
          />
        </div>
      </header>

      <UserGuide open={showGuide} onClose={() => setShowGuide(false)} isFirstTime={guideFirstTime} />

      <div className={`app-main${config.text.collapseBlankLines && config.text.maxBlankLines === 0 ? ' tight-blocks' : ''}`}>
        <Suspense fallback={<EditorPanelFallback />}>
          <EditorPanel
            editorRef={editorRef}
            onAutoPaste={handleAutoPaste}
            onPasteMarkdown={handlePastedMarkdown}
            onOutputChange={handleEditorChange}
            onCopyOutput={handleCopyOutput}
            recalcNote={output.trim() ? (followsPaste ? '按最初粘贴重算' : '按当前正文重算') : null}
          />
        </Suspense>
        <aside className="app-sidebar">
          <RulesPanel
            config={config}
            onChange={setConfig}
            onShiftHeadings={handleShiftHeadings}
            onNormalizeNumbering={handleNormalizeNumbering}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
          />
        </aside>
      </div>

      <button className="btn ghost manage-btn" onClick={() => setShowTemplateManager(true)}>
        管理模板
      </button>

      <TemplateManager
        open={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        templates={templates}
        onChange={setTemplates}
      />

      {status && <div className="status-bar">{status}</div>}
    </div>
  )
}

function EditorPanelFallback() {
  return (
    <main className="main-layout single-pane">
      <section className="pane pane-output">
        <div className="pane-header">
          <h2>处理结果</h2>
        </div>
        <div className="preview-box preview-box-mdx preview-box-loading">
          <div className="preview-placeholder-mdx editor-loading-placeholder">
            正在加载编辑器…
          </div>
        </div>
      </section>
    </main>
  )
}
