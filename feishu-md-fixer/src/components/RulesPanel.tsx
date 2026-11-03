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

  const boldLevel = config.heading.convertLevelToBoldParagraph
  const blankTight = config.text.collapseBlankLines && config.text.maxBlankLines === 0

  return (
    <section className="pane rules-pane">
      <div className="rules-header">
        <h2 className="rules-heading">规则</h2>
      </div>

      <div className="rules-list">
        <div className="rule-actions">
          <button
            type="button"
            className="btn outline btn-sm"
            onClick={() => onUndo?.()}
            disabled={!canUndo}
            title="撤销粘贴、手改、升降级和序号规范化。改规则不进撤销。（Ctrl+Z）"
          >
            撤销
          </button>
          <button
            type="button"
            className="btn outline btn-sm"
            onClick={() => onRedo?.()}
            disabled={!canRedo}
            title="重做刚才撤销的粘贴、手改、升降级或序号规范化。（Ctrl+Y）"
          >
            重做
          </button>
        </div>

        <div className="rule-section">标题</div>
        <div className="rule-row">
          <span className="rule-row-label">升降级</span>
          <div className="rule-controls">
            <button
              type="button"
              className="btn outline btn-sm"
              onClick={() => onShiftHeadings?.(-1)}
              title="所有标题升一级（H2→H1），马上改当前正文"
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
        </div>
        <div className="rule-row">
          <span className="rule-row-label">改为加粗</span>
          <select
            className="rule-select"
            aria-label="某级标题改为正文加粗"
            title="把某一级标题改成加粗正文。选关闭则保持标题。"
            value={boldLevel ?? ''}
            onChange={(e) => {
              const raw = e.target.value
              update('heading', {
                convertLevelToBoldParagraph: raw === '' ? null : Number.parseInt(raw, 10),
              })
            }}
          >
            <option value="">关闭</option>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <option key={level} value={level}>
                H{level}
              </option>
            ))}
          </select>
        </div>

        <div className="rule-section">序号</div>
        <div className="rule-row">
          <span className="rule-row-label">中文序号</span>
          <button
            type="button"
            className="btn outline btn-sm"
            onClick={() => onNormalizeNumbering?.()}
            title="一、为 1.，（1）缩进为下一级，① 再缩进一级。紧挨着的跳号会写成 21．以免被收成第 2 条，复制到飞书时还原。"
          >
            立即规范
          </button>
        </div>

        <div className="rule-section">清理</div>
        <label className="rule-check" title="把 1️⃣ 2️⃣ 转成 1. 2. 3.">
          <input
            type="checkbox"
            checked={config.emoji.stripNumberEmojiToOrderedList}
            onChange={(e) =>
              update('emoji', { stripNumberEmojiToOrderedList: e.target.checked })
            }
          />
          <span>数字 Emoji 转列表</span>
        </label>
        <label className="rule-check">
          <input
            type="checkbox"
            checked={config.emoji.stripAll}
            onChange={(e) => update('emoji', { stripAll: e.target.checked })}
          />
          <span>删除所有 Emoji</span>
        </label>
        <label className="rule-check">
          <input
            type="checkbox"
            checked={config.code.removeCodeBlocks}
            onChange={(e) => update('code', { removeCodeBlocks: e.target.checked })}
          />
          <span>删除代码块</span>
        </label>
        <label className="rule-check" title="去掉反引号，保留里面的文字">
          <input
            type="checkbox"
            checked={config.code.removeInlineCode}
            onChange={(e) => update('code', { removeInlineCode: e.target.checked })}
          />
          <span>删除行内代码</span>
        </label>
        <label className="rule-check" title="去掉引用符号，保留文字">
          <input
            type="checkbox"
            checked={config.blockquote.removeAll}
            onChange={(e) => update('blockquote', { removeAll: e.target.checked })}
          />
          <span>删除引用格式</span>
        </label>
        <label className="rule-check" title="去掉 --- 和 ***">
          <input
            type="checkbox"
            checked={config.structural.removeThematicBreaks}
            onChange={(e) =>
              update('structural', { removeThematicBreaks: e.target.checked })
            }
          />
          <span>删除分割线</span>
        </label>

        <div className="rule-section">版式</div>
        <div className="rule-row">
          <span className="rule-row-label">空行</span>
          <select
            className="rule-select"
            aria-label="块之间的空行"
            title="不留空行会马上收紧块与块的间距。代码块内部的空行会保留。"
            value={blankTight ? 0 : 1}
            onChange={(e) =>
              update('text', {
                collapseBlankLines: true,
                maxBlankLines: Number.parseInt(e.target.value, 10) === 0 ? 0 : 1,
              })
            }
          >
            <option value={1}>保留一段间距</option>
            <option value={0}>不留空行</option>
          </select>
        </div>
        <div className="rule-row">
          <span className="rule-row-label">脚注</span>
          <select
            className="rule-select"
            aria-label="脚注"
            value={config.footnote.mode}
            onChange={(e) =>
              update('footnote', {
                mode: e.target.value as TemplateConfig['footnote']['mode'],
              })
            }
          >
            <option value="endnote">文末注释</option>
            <option value="keep">保留原文</option>
          </select>
        </div>
        <div className="rule-row">
          <span className="rule-row-label">链接</span>
          <select
            className="rule-select"
            aria-label="链接"
            value={config.linksAndImages.simplifyLinksMode}
            onChange={(e) =>
              update('linksAndImages', {
                simplifyLinksMode: e.target.value as TemplateConfig['linksAndImages']['simplifyLinksMode'],
              })
            }
          >
            <option value="text_with_url">文本（url）</option>
            <option value="text_only">仅文本</option>
            <option value="none">保持原样</option>
          </select>
        </div>
        <div className="rule-row">
          <span className="rule-row-label">图片</span>
          <select
            className="rule-select"
            aria-label="图片"
            value={config.linksAndImages.imagesMode}
            onChange={(e) =>
              update('linksAndImages', {
                imagesMode: e.target.value as TemplateConfig['linksAndImages']['imagesMode'],
              })
            }
          >
            <option value="keep">保留</option>
            <option value="alt_text">仅 alt</option>
            <option value="strip">删除</option>
          </select>
        </div>
      </div>
    </section>
  )
}
