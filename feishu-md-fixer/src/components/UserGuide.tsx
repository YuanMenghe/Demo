import { useState } from 'react'
import { BRAND_LOGO_URL } from '../brand'

const GUIDE_STORAGE_KEY = 'feishu-md-fixer.guide-seen'

export function getGuideSeen(): boolean {
  try {
    return window.localStorage.getItem(GUIDE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setGuideSeen(seen: boolean): void {
  try {
    if (seen) window.localStorage.setItem(GUIDE_STORAGE_KEY, '1')
    else window.localStorage.removeItem(GUIDE_STORAGE_KEY)
  } catch {}
}

interface UserGuideProps {
  open: boolean
  onClose: () => void
  /** 是否由「首次打开」触发，用于显示「不再自动显示」选项 */
  isFirstTime?: boolean
}

const STEPS = [
  {
    title: '1. 获取内容',
    body: '点击「读取并清洗」从剪贴板读取网页或飞书内容，并自动转成 Markdown。若浏览器不允许读取剪贴板，会弹出粘贴框，在里面按 Ctrl+V。',
  },
  {
    title: '2. 选择模板',
    body: '页头可选择模板（如「飞书：技术文档」「飞书：群聊总结」），不同模板对应不同清洗规则。',
  },
  {
    title: '3. 调整规则',
    body: '右侧边栏可微调：标题升降级、某级标题改为加粗段落、Emoji 处理、是否去掉代码块、引用标记（正文保留）或分割线、空行折叠等。规则稳定后约 150ms 内会按新规则重新处理当前内容。',
  },
  {
    title: '4. 编辑与复制',
    body: '中间区域可以直接改清洗结果。确认后点「复制到飞书」。粘贴、改规则、升降级和序号规范化都可以撤销。',
  },
]

export function UserGuide({ open, onClose, isFirstTime = false }: UserGuideProps) {
  const [noAutoShow, setNoAutoShow] = useState(false)

  const handleClose = () => {
    if (isFirstTime && noAutoShow) setGuideSeen(true)
    onClose()
  }

  if (!open) return null

  return (
    <div className="guide-overlay" onClick={handleClose} role="dialog" aria-labelledby="guide-title">
      <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="guide-header">
          <div className="guide-header-brand">
            <img
              className="guide-logo"
              src={BRAND_LOGO_URL}
              alt=""
              width={36}
              height={36}
              aria-hidden
            />
            <h2 id="guide-title" className="guide-title">使用指南</h2>
          </div>
          <button type="button" className="guide-close" onClick={handleClose} aria-label="关闭">
            ×
          </button>
        </div>
        <div className="guide-body">
          <p className="guide-intro">
            NOAH Markdown 助手（页头青色无限符号风格标识）帮助你把网页或飞书内容整理成适合粘贴的 Markdown。
            按下面四步即可完成「复制 → 清洗 → 粘贴到飞书」。
          </p>
          <ol className="guide-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="guide-step">
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </li>
            ))}
          </ol>
          {isFirstTime && (
            <label className="guide-checkbox">
              <input
                type="checkbox"
                checked={noAutoShow}
                onChange={(e) => setNoAutoShow(e.target.checked)}
              />
              <span>下次不再自动显示</span>
            </label>
          )}
        </div>
        <div className="guide-footer">
          <button type="button" className="btn primary" onClick={handleClose}>
            知道了
          </button>
        </div>
      </div>
    </div>
  )
}
