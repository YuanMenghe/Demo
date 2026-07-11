import React from 'react';
import { ShoppingCart, Check, Star, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CustomerServices() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">临床研究与证据评价服务</h2>
        <p className="text-sm text-slate-500">
          基于高等级医学专家网络，为您的研究方案、统计设计、伦理风险提供结构化的专业评估，保障医学严谨性与可行性。
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 单模块 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow relative flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-2">单模块方法学评估</h3>
            <p className="text-xs text-slate-500 mb-6 flex-1 leading-relaxed">一项研究设计或方法学模块的专业评估，快速排查核心风险。</p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-noah-600">¥399<span className="text-xs text-slate-400 font-normal"> 起</span></span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 mb-8">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>S3/S4 资深专家独立审核</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>核心缺陷标识</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>针对性修改建议</span>
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors mt-auto">
              立即发起
            </button>
          </div>
        </div>

        {/* 完整方案 */}
        <div className="bg-white rounded-2xl border border-noah-500 shadow-sm overflow-hidden relative flex flex-col">
          <div className="absolute top-0 inset-x-0 h-1 bg-noah-500"></div>
          <div className="absolute top-0 right-0 bg-noah-50 text-noah-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-noah-200">
            最受欢迎
          </div>
          <div className="p-6 flex-1 flex flex-col mt-2">
            <h3 className="text-base font-bold text-slate-900 mb-2">完整方案单专家评估</h3>
            <p className="text-xs text-slate-500 mb-6 flex-1 leading-relaxed">一名专家完成全面的结构化评审，覆盖研究基础、技术路线及可行性。</p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-noah-600">¥1,500<span className="text-xs text-slate-400 font-normal"> 起</span></span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 mb-8">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>S4/S5 高级专家系统审查</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>全维度结构化报告</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>关键证据与风险提示</span>
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-noah-600 hover:bg-noah-700 text-white text-sm font-semibold rounded-lg transition-colors mt-auto shadow-sm">
              立即发起
            </button>
          </div>
        </div>

        {/* 双专家 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow relative flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-2">双专家方案论证</h3>
            <p className="text-xs text-slate-500 mb-6 flex-1 leading-relaxed">两名专家独立评价及差异说明，提供更客观、多视角的论证。</p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-noah-600">¥3,000<span className="text-xs text-slate-400 font-normal"> 起</span></span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 mb-8">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>双盲独立评审机制</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>观点冲突分析与合议</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-500 shrink-0 mt-0.5" />
                <span>提高模型置信度和安全性</span>
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors mt-auto">
              立即发起
            </button>
          </div>
        </div>

        {/* 稀缺专家组 */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:shadow-sm transition-shadow relative flex flex-col text-white">
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-orange-400 fill-orange-400" />
              <h3 className="text-base font-bold text-white">稀缺专家组综合论证</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 flex-1 leading-relaxed">顶级专家团队评审和正式报告，解决极高难度、罕见病或重度交叉领域问题。</p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-white">¥6,000<span className="text-xs text-slate-400 font-normal"> 起</span></span>
              <div className="text-[10px] text-slate-500 mt-1">需按项目制单独报价</div>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-400 shrink-0 mt-0.5" />
                <span>学科带头人领衔定制</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-400 shrink-0 mt-0.5" />
                <span>复杂病例多学科会诊(MDT)级</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-noah-400 shrink-0 mt-0.5" />
                <span>出具正式专家共识报告</span>
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold rounded-lg transition-colors mt-auto">
              联系专属顾问
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8">
        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm">
          <ShieldCheck size={18} className="text-noah-600" />
          服务边界与承诺说明
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-600">
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>纯粹评估：</strong>不提供文案润色、不直接修改申请书文本。</li>
            <li><strong>无利益绑定：</strong>客观评价，不承诺基金中标或发表成功。</li>
          </ul>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>学术合规：</strong>绝不允许专家使用基金评审中的未公开信息。</li>
            <li><strong>核心聚焦：</strong>服务成果严格聚焦于研究问题、方法学、统计设计、伦理风险和可行性评价。</li>
          </ul>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
        <span>基于风险路由机制：普通内容由模型与S1处理；复杂、高风险或具有强业务价值的需求，才进入高阶专家(S3-S5)流程。</span>
      </div>
    </div>
  );
}
