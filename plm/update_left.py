import sys

with open('src/components/LeftPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add requiredFor and guidelineName in the LeftPanel missingInputs display.
# In LeftPanel.tsx, there are two places: one in the main panel and one in SlimPanel.

replacement_main = """<div className="flex items-start justify-between">
                          <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                        </div>"""

new_replacement_main = """<div className="flex flex-col gap-1 mb-2">
                          <div className="flex items-start justify-between">
                            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                          </div>
                          {(input.requiredFor || input.guidelineName) && (
                            <div className="text-[11px] text-slate-500 leading-snug bg-slate-50 p-1.5 rounded border border-slate-100">
                              {input.requiredFor && <div><span className="font-semibold text-slate-600">解锁:</span> {input.requiredFor}</div>}
                              {input.guidelineName && <div><span className="font-semibold text-slate-600">来源:</span> {input.guidelineName}</div>}
                            </div>
                          )}
                        </div>"""

content = content.replace(replacement_main, new_replacement_main)

# And similarly in SlimPanel:
replacement_slim = """<label className="text-[11px] font-medium text-slate-700 flex items-center gap-1 mb-1.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>"""

new_replacement_slim = """<div className="mb-1.5">
                    <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1 mb-0.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                    {(input.requiredFor || input.guidelineName) && (
                      <div className="text-[9px] text-slate-400 bg-slate-50 p-1 rounded">
                        {input.requiredFor && <div>解锁: {input.requiredFor}</div>}
                        {input.guidelineName && <div>来源: {input.guidelineName}</div>}
                      </div>
                    )}
                  </div>"""

content = content.replace(replacement_slim, new_replacement_slim)

with open('src/components/LeftPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LeftPanel")
