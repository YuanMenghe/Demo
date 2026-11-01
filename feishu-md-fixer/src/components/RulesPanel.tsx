import type { TemplateConfig } from '../core/templates'

interface RulesPanelProps {
  config: TemplateConfig
  onChange: (next: TemplateConfig) => void
  /** 对当前编辑器内容执行标题升降级 */
  onShiftHeadings?: (delta: number) => void
  /** 对当前编辑器内容执行序号规范化 */
  onNormalizeNumbering?: () => void
  /** 撤销操作 */
  onUndo?: () => void
  /** 重做操作 */
  onRedo?: () => void
  /** 是否可撤销 */
  canUndo?: boolean
  /** 是否可重做 */
  canRedo?: boolean
}

function RuleCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rule-card">
      <div className="rule-card-title">{title}</div>
      <div className="rule-card-body">{children}</div>
    </div>
  )
}

export function RulesPanel({ 
  config, 
  onChange, 
  onShiftHeadings, 
  onNormalizeNumbering,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: RulesPanelProps) {
  const update = <K extends keyof TemplateConfig>(section: K, patch: Partial<TemplateConfig[K]>) => {
    onChange({
      ...config,
      [section]: {
        ...config[section],
        ...patch,
      },
    })
  }

  return (
    <section className="pane rules-pane">
      <div className="rules-header">
        <h2 className="rules-heading">规则设置</h2>
        <p className="rules-hint">没改过正文时，按最初粘贴的原文重算。改过正文后，再调规则就按当前正文重算。可以撤销。</p>
      </div>

      <div className="rules-list">
        <RuleCard title="操作历史">
          <div className="rule-item">
            <div className="rule-controls">
              <button
                type="button"
                className="btn outline btn-sm"
                onClick={() => onUndo?.()}
                disabled={!canUndo}
                title="撤销上一步操作 (Ctrl+Z)"
              >
                ↶ 撤销
              </button>
              <button
                type="button"
                className="btn outline btn-sm"
                onClick={() => onRedo?.()}
                disabled={!canRedo}
                title="重做已撤销操作 (Ctrl+Y)"
              >
                ↷ 重做
              </button>
            </div>
            <span className="rule-desc">升降级、序号规范化等操作可撤销</span>
          </div>
        </RuleCard>

        <RuleCard title="标题结构">
          <div className="rule-item">
            <label className="rule-label">整体升降级（对当前内容）</label>
            <div className="rule-controls">
              <button
                type="button"
                className="btn outline btn-sm"
                onClick={() => onShiftHeadings?.(-1)}
                title="所有标题升一级（H2→H1）"
              >
                升一级
              </button>
              <button
                type="button"
                className="btn outline btn-sm"
                onClick={() => onShiftHeadings?.(1)}
                title="所有标题降一级。超过 H6 时继续增加 #，复制到飞书时输出对应的 h7、h8、h9"
              >
                降一级
              </button>
            </div>
            <span className="rule-desc">点击按钮立即修改当前编辑器中的内容</span>
          </div>
          <div className="rule-item">
            <label className="rule-check">
              <input
                type="checkbox"
                checked={config.heading.convertLevelToBoldParagraph != null}
                onChange={(e) =>
                  update('heading', {
                    convertLevelToBoldParagraph: e.target.checked ? 3 : null,
                  })
                }
              />
              <span>某级标题改为正文加粗</span>
            </label>
            {config.heading.convertLevelToBoldParagraph != null && (
              <div className="rule-controls rule-controls-inline">
                <select
                  className="rule-select rule-level-select"
                  value={config.heading.convertLevelToBoldParagraph}
                  onChange={(e) =>
                    update('heading', {
                      convertLevelToBoldParagraph: Number.parseInt(e.target.value, 10),
                    })
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                      H{level}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </RuleCard>

        <RuleCard title="序号规范化">
          <div className="rule-item">
            <label className="rule-label">将中文序号转为 Markdown 序号</label>
            <div className="rule-controls">
              <button
                type="button"
                className="btn outline btn-sm"
                onClick={() => onNormalizeNumbering?.()}
                title="行首一、为一级，括号序号缩进一级，圈数字再缩进一级。一百零一也可以。"
              >
                立即规范
              </button>
            </div>
            <span className="rule-desc">一、为 1.，（1）缩进为下一级，① 再缩进一级。紧挨着的跳号会写成 21．以免被收成第 2 条，复制到飞书时还原。</span>
          </div>
        </RuleCard>

        <RuleCard title="Emoji">
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.emoji.stripNumberEmojiToOrderedList}
              onChange={(e) =>
                update('emoji', { stripNumberEmojiToOrderedList: e.target.checked })
              }
            />
            <span>数字 Emoji（1️⃣ 2️⃣）→ 1. 2. 3.</span>
          </label>
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.emoji.stripAll}
              onChange={(e) => update('emoji', { stripAll: e.target.checked })}
            />
            <span>删除所有 Emoji</span>
          </label>
        </RuleCard>

        <details className="rule-more">
          <summary>更多规则</summary>
        <RuleCard title="代码 · 引用 · 分割线">
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.code.removeCodeBlocks}
              onChange={(e) => update('code', { removeCodeBlocks: e.target.checked })}
            />
            <span>删除代码块</span>
          </label>
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.code.removeInlineCode}
              onChange={(e) => update('code', { removeInlineCode: e.target.checked })}
            />
            <span>删除行内代码（保留文字）</span>
          </label>
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.blockquote.removeAll}
              onChange={(e) => update('blockquote', { removeAll: e.target.checked })}
            />
            <span>删除引用格式（&gt;）</span>
          </label>
          <label className="rule-check">
            <input
              type="checkbox"
              checked={config.structural.removeThematicBreaks}
              onChange={(e) =>
                update('structural', { removeThematicBreaks: e.target.checked })
              }
            />
            <span>删除分割线（--- / ***）</span>
          </label>
        </RuleCard>

        <RuleCard title="空行 · 链接 · 图片">
          <div className="rule-item">
            <label className="rule-check">
              <input
                type="checkbox"
                checked={config.text.collapseBlankLines}
                onChange={(e) => update('text', { collapseBlankLines: e.target.checked })}
              />
              <span>块之间最多保留空行</span>
            </label>
            <select
              className="rule-select rule-select-narrow"
              value={config.text.maxBlankLines}
              onChange={(e) =>
                update('text', {
                  maxBlankLines: Math.max(0, Number.parseInt(e.target.value || '1', 10)),
                })
              }
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n} 行
                </option>
              ))}
            </select>
            <span className="rule-desc">选 0 会去掉块与块之间的空行。代码块内部的空行会保留。</span>
          </div>
          <div className="rule-item">
            <label className="rule-label">脚注</label>
            <select
              className="rule-select"
              value={config.footnote.mode}
              onChange={(e) =>
                update('footnote', {
                  mode: e.target.value as TemplateConfig['footnote']['mode'],
                })
              }
            >
              <option value="endnote">转为文末注释（适合飞书）</option>
              <option value="keep">保留原始 Markdown 脚注</option>
            </select>
          </div>
          <div className="rule-item">
            <label className="rule-label">链接</label>
            <select
              className="rule-select"
              value={config.linksAndImages.simplifyLinksMode}
              onChange={(e) =>
                update('linksAndImages', {
                  simplifyLinksMode: e.target.value as TemplateConfig['linksAndImages']['simplifyLinksMode'],
                })
              }
            >
              <option value="none">保持 [文本](url)</option>
              <option value="text_with_url">文本（url）</option>
              <option value="text_only">仅文本</option>
            </select>
          </div>
          <div className="rule-item">
            <label className="rule-label">图片</label>
            <select
              className="rule-select"
              value={config.linksAndImages.imagesMode}
              onChange={(e) =>
                update('linksAndImages', {
                  imagesMode: e.target.value as TemplateConfig['linksAndImages']['imagesMode'],
                })
              }
            >
              <option value="keep">保留</option>
              <option value="alt_text">仅 alt 文本</option>
              <option value="strip">删除</option>
            </select>
          </div>
        </RuleCard>
        </details>
      </div>
    </section>
  )
}
