import { describe, expect, it } from 'vitest'
import { applyPipeline } from './pipeline'
import { BUILTIN_TEMPLATES } from './templates'
import { replaceLatexMath } from './latexText'

const technicalDoc = BUILTIN_TEMPLATES[0]!.config

describe('replaceLatexMath', () => {
  it('turns greek letters and common operators into readable characters', () => {
    const out = replaceLatexMath('SAP 设定了 $\\alpha$ 控制，$\\beta \\leq 0.05$，$n \\times m$，$\\Delta \\pm 1$。')

    expect(out).toBe('SAP 设定了 α 控制，β ≤ 0.05，n × m，Δ ± 1。')
    expect(out).not.toContain('$')
    expect(out).not.toContain('\\')
  })

  it('reads paren and display delimiters, fractions, roots and scripts', () => {
    const out = replaceLatexMath(
      ['\\(\\mu\\)', '$$\\frac{a+b}{c}$$', '$E=mc^2$', '$x_{i}$', '$p_{max}$', '$\\sqrt{n}$', '$\\mathrm{AUC}_{0-t}$'].join('\n'),
    )

    expect(out).toContain('μ')
    expect(replaceLatexMath('另外 \\( \\mu \\) 与 \\[\\alpha+\\beta\\]')).toBe('另外 μ 与 α+β')
    expect(out).toContain('(a+b)/c')
    expect(out).toContain('E=mc²')
    expect(out).toContain('xᵢ')
    expect(out).toContain('pₘₐₓ')
    expect(out).toContain('√n')
    expect(out).toContain('AUC₀₋ₜ')
  })

  it('does not treat ordinary text between dollar signs as a formula', () => {
    const out = replaceLatexMath('预算 $$100 稍后 $$200，见 $x$。')

    expect(out).toContain('$$100 稍后 $$200')
    expect(out).toContain('见 x。')
  })

  it('leaves prices, fenced code and inline code unchanged', () => {
    const out = replaceLatexMath(
      ['价格 $100 和 $1,200.50$。', '', '```', '$\\alpha$', '```', '', '保留 `$\\beta$`。'].join('\n'),
    )

    expect(out).toContain('价格 $100 和 $1,200.50$。')
    expect(out).toContain('$\\alpha$')
    expect(out).toContain('`$\\beta$`')
  })

  it('keeps a formula inside a table cell in that cell', () => {
    const input = ['| 项 | 条件 |', '| --- | --- |', '| 多重性 | SAP 设定了 $\\alpha$ 控制 |'].join('\n')
    const out = applyPipeline(input, { template: technicalDoc })

    expect(out).toContain('α')
    expect(out).not.toContain('\\alpha')
    expect(out).toMatch(/\| 多重性 \| SAP 设定了 α 控制 \|/)
  })

  it('still converts a formula that was wrapped in inline code when inline code is removed', () => {
    const out = applyPipeline('显著性 `$\\alpha$`', { template: technicalDoc })

    expect(out).toContain('α')
    expect(out).not.toContain('\\alpha')
  })
})
