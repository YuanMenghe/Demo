import type { Template } from '../core/templates'

interface TemplateSelectorProps {
  templates: Template[]
  activeId: string
  onChange: (id: string) => void
}

export function TemplateSelector({ templates, activeId, onChange }: TemplateSelectorProps) {
  const current = templates.find((t) => t.id === activeId)

  return (
    <div className="template-area">
      <label className="template-label">
        模板：
        <select value={activeId} onChange={(e) => onChange(e.target.value)}>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
      </label>
      {current && <span className="template-desc">{current.description}</span>}
    </div>
  )
}

