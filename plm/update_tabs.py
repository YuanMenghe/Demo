import sys

with open('src/components/CenterPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = """          {activeTab === 'rwd' && response?.rwdAnalysis ? ("""
end_marker = """            </motion.div>
          ) : activeTab === 'guidelines' ? ("""

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len("            </motion.div>")

    new_content = """          {activeTab === 'drug_info' ? (
            <motion.div
              key="drug_info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {response?.drugInfo?.length ? response.drugInfo.map(drug => (
                <div key={drug.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-800">{drug.name} 说明书摘要</h3>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded font-medium",
                      drug.indicationMatch === 'high' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      适应症匹配: {drug.indicationMatch === 'high' ? '强相关' : drug.indicationMatch === 'medium' ? '中相关' : '补充'}
                    </span>
                  </div>
                  <div className="p-4 space-y-4 text-sm">
                    <div><span className="font-semibold text-slate-700">用法用量：</span><span className="text-slate-600">{drug.dosage}</span></div>
                    <div>
                      <span className="font-semibold text-slate-700">合并用药判断：</span>
                      <div className={cn(
                        "mt-1 p-3 rounded-lg border",
                        drug.interactionCheck.status === 'safe' ? "bg-emerald-50 border-emerald-100 text-emerald-800" :
                        drug.interactionCheck.status === 'warning' ? "bg-amber-50 border-amber-100 text-amber-800" :
                        "bg-rose-50 border-rose-100 text-rose-800"
                      )}>
                        <div className="font-medium">{drug.interactionCheck.suggestion}</div>
                        <div className="text-xs mt-1 opacity-80">原因：{drug.interactionCheck.reason}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="font-semibold text-rose-700 text-xs block mb-1">核心禁忌</span>
                        <ul className="list-disc pl-4 text-slate-600 space-y-1">
                          {drug.contraindications.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-amber-700 text-xs block mb-1">不良反应</span>
                        <ul className="list-disc pl-4 text-slate-600 space-y-1">
                          {drug.adverseReactions.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-500">暂无相关药品说明书信息</div>
              )}
            </motion.div>
          ) : activeTab === 'user_kb' ? (
            <motion.div
              key="user_kb"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Library className="w-5 h-5 text-indigo-600" />
                  科室私有知识库 (RAG)
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">仅基于内部文档回答</span>
              </div>
              {response?.userKb && response.userKb.length > 0 ? (
                <div className="space-y-4">
                  {response.userKb.map((kb, i) => (
                    <div key={kb.id || i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{kb.title}</h4>
                        <span className="text-xs text-slate-400">来源: {kb.sourceFile}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{kb.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Library className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">科室暂无相关文档</p>
                </div>
              )}
            </motion.div>"""

    with open('src/components/CenterPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(content[:start_idx] + new_content + content[end_idx:])
    print('Replaced successfully.')
else:
    print('Markers not found.')
