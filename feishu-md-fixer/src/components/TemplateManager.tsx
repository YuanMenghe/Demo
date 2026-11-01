import type { Template } from '../core/templates'
import { BUILTIN_TEMPLATES, createTemplateFrom, saveCustomTemplates } from '../core/templates'

interface TemplateManagerProps {
  open: boolean
  onClose: () => void
  templates: Template[]
  onChange: (next: Template[]) => void
}

export function TemplateManager({ open, onClose, templates, onChange }: TemplateManagerProps) {
  if (!open) return null

  const handleDuplicate = (id: string) => {
    const base = templates.find((t) => t.id === id)
    if (!base) return
    const next = [...templates, createTemplateFrom(base)]
    onChange(next)
    saveCustomTemplates(next)
  }

  const handleDelete = (id: string) => {
    if (BUILTIN_TEMPLATES.some((t) => t.id === id)) return
    const next = templates.filter((t) => t.id !== id)
    onChange(next)
    saveCustomTemplates(next)
  }

  const handleNameChange = (id: string, name: string) => {
    const next = templates.map((t) =>
      t.id === id && !t.builtin
        ? {
            ...t,
            name,
          }
        : t
    )
    onChange(next)
    saveCustomTemplates(next)
  }

  return (
    <div className="template-manager-backdrop" onClick={onClose}>
      <div className="template-manager" onClick={(e) => e.stopPropagation()}>
        <div className="template-manager-header">
          <h3>模板管理</h3>
          <button className="btn ghost" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="template-manager-body">
          {templates.map((tpl) => (
            <div key={tpl.id} className="template-row">
              <div className="template-row-main">
                {tpl.builtin ? (
                  <div className="template-name builtin">{tpl.name}</div>
                ) : (
                  <input
                    className="template-name-input"
                    value={tpl.name}
                    onChange={(e) => handleNameChange(tpl.id, e.target.value)}
                  />
                )}
                <div className="template-row-desc">{tpl.description}</div>
              </div>
              <div className="template-row-actions">
                <button className="btn ghost" onClick={() => handleDuplicate(tpl.id)}>
                  复制
                </button>
                {!tpl.builtin && (
                  <button className="btn ghost" onClick={() => handleDelete(tpl.id)}>
                    删除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="template-hint">
          说明：当前版本支持复制内置模板并重命名，配置项默认随模板类型预设。
        </p>
      </div>
    </div>
  )
}

