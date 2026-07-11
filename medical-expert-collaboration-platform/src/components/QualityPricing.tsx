import React from 'react';
import { Calculator, HelpCircle, Info } from 'lucide-react';

export default function QualityPricing() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">质量与结算说明</h2>
        <p className="text-sm text-slate-500">平台根据任务难度(C)、专家资质(S)和交付质量(Q)确定专家劳务费用。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Calculator className="text-noah-600" size={18} />
            C × S 合格基础价 (Q3质量基准价)
          </h3>
          <span className="text-xs text-slate-500">单位：元/条、元/例或元/任务</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">任务难度 (C) \ 专家资质 (S)</th>
                <th className="px-6 py-3 font-semibold text-center">S1 基础医学人员</th>
                <th className="px-6 py-3 font-semibold text-center">S2 主治级</th>
                <th className="px-6 py-3 font-semibold text-center">S3 副主任级</th>
                <th className="px-6 py-3 font-semibold text-center">S4 主任级</th>
                <th className="px-6 py-3 font-semibold text-center">S5 权威/稀缺专家</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">C1: 1—5分钟</td>
                <td className="px-6 py-4 text-center">5</td>
                <td className="px-6 py-4 text-center">8</td>
                <td className="px-6 py-4 text-center">12</td>
                <td className="px-6 py-4 text-center">20</td>
                <td className="px-6 py-4 text-center font-semibold text-noah-700">30</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">C2: 5—10分钟</td>
                <td className="px-6 py-4 text-center">15</td>
                <td className="px-6 py-4 text-center">25</td>
                <td className="px-6 py-4 text-center">40</td>
                <td className="px-6 py-4 text-center">60</td>
                <td className="px-6 py-4 text-center font-semibold text-noah-700">100</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">C3: 10—30分钟</td>
                <td className="px-6 py-4 text-center">50</td>
                <td className="px-6 py-4 text-center">100</td>
                <td className="px-6 py-4 text-center"><span className="bg-noah-100 text-noah-700 font-bold px-2 py-1 rounded ring-1 ring-noah-400 ring-inset">180</span></td>
                <td className="px-6 py-4 text-center">300</td>
                <td className="px-6 py-4 text-center font-semibold text-noah-700">500</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">C4: 30—60分钟</td>
                <td className="px-6 py-4 text-center">150</td>
                <td className="px-6 py-4 text-center">300</td>
                <td className="px-6 py-4 text-center">600</td>
                <td className="px-6 py-4 text-center">1,000</td>
                <td className="px-6 py-4 text-center font-semibold text-noah-700">1,500</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">C5: 1—3小时</td>
                <td className="px-6 py-4 text-center">400</td>
                <td className="px-6 py-4 text-center">800</td>
                <td className="px-6 py-4 text-center">1,500</td>
                <td className="px-6 py-4 text-center">2,500</td>
                <td className="px-6 py-4 text-center font-semibold text-noah-700">3,300</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">交付质量系数 (Q)</h3>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <div className="font-medium text-red-500 text-sm">Q1 不合格 (系数: 0)</div>
                  <div className="text-xs text-slate-500 mt-1">正确率 &lt; 80% 或有核心医学错误</div>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">重新标注</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <div className="font-medium text-orange-500 text-sm">Q2 需返修 (暂不结算)</div>
                  <div className="text-xs text-slate-500 mt-1">正确率 80%—89% 或论证不足</div>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">返修验收后结算</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-700 text-sm">Q3 合格 (系数: 1)</div>
                  <div className="text-xs text-slate-500 mt-1">正确率 90%—94%，满足基本要求</div>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">按标准价格结算</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <div className="font-bold text-noah-600 text-sm">Q4 优质 (系数: 1.2)</div>
                  <div className="text-xs text-slate-500 mt-1">正确率 ≥ 95%，医学判断准确</div>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">给予质量奖励</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-noah-700 text-sm">Q5 卓越 (系数: 1.5)</div>
                  <div className="text-xs text-slate-500 mt-1">识别关键问题，提出高价值优化建议</div>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">仅限开放式任务</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-noah-50 rounded-lg text-xs text-noah-800 border border-noah-100 leading-relaxed">
              <strong className="block mb-1">计算示例:</strong>
              <ul className="space-y-1">
                <li>• C3-S3 任务复验后达到 Q3：<span className="font-bold text-noah-700">180元</span></li>
                <li>• C4-S4 任务达到 Q4：1,000 × 1.2 ＝ <span className="font-bold text-noah-700">1,200元</span></li>
                <li>• C5-S5 开放式任务达到 Q5：3,300 × 1.5 ＝ <span className="font-bold text-noah-700">4,950元</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">等级与计价说明</h3>
          </div>
          <div className="p-6 text-xs text-slate-600 space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Info size={14} className="text-noah-600" /> 任务难度 (C)</h4>
              <p className="leading-relaxed">根据任务范围、材料复杂度、专业判断深度和标准工时综合确定。时间仅作为参考。预计超过3小时、需要多人评审、正式签署报告或包含复杂统计分析的任务，不适用标准价格表，采用项目制定价。</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Info size={14} className="text-noah-600" /> 专家资质 (S)</h4>
              <p className="leading-relaxed">根据专业资质、相关领域经验、任务匹配度和试标结果综合确定。职称仅作为参考，不自动决定任务等级和结算价格。专家实际资质高于任务要求时，原则上仍按照任务发布时确定的专家等级结算。</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Info size={14} className="text-noah-600" /> 质量等级 (Q)</h4>
              <p className="leading-relaxed">选择类任务最高为Q4，Q5仅适用于开放式任务。出现重大医学错误、虚构证据、数据违规使用或关键结论错误时，不得评为Q3及以上。因任务规范不清、金标准错误或原始材料缺失造成的问题，不计为标注人员质量问题。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
