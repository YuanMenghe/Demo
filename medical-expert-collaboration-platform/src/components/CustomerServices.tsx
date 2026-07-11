import React from 'react';
import { ShoppingCart, Check, Star, ShieldCheck, Eye, Monitor, ArrowLeftRight } from 'lucide-react';

const servicePlans = [
  {
    title: '单模块方法学评估',
    desc: '一项研究设计或方法学模块的专业评估，快速排查核心风险。',
    price: '399',
    featured: false,
    dark: false,
    perks: ['S3/S4 资深专家独立审核', '核心缺陷标识', '针对性修改建议'],
  },
  {
    title: '完整方案单专家评估',
    desc: '一名专家完成全面的结构化评审，覆盖研究基础、技术路线及可行性。',
    price: '1,500',
    featured: true,
    dark: false,
    perks: ['S4/S5 高级专家系统审查', '全维度结构化报告', '关键证据与风险提示'],
  },
  {
    title: '双专家方案论证',
    desc: '两名专家独立评价及差异说明，提供更客观、多视角的论证。',
    price: '3,000',
    featured: false,
    dark: false,
    perks: ['双盲独立评审机制', '观点冲突分析与合议', '提高模型置信度和安全性'],
  },
  {
    title: '稀缺专家组综合论证',
    desc: '顶级专家团队评审和正式报告，解决极高难度、罕见病或重度交叉领域问题。',
    price: '6,000',
    featured: false,
    dark: true,
    perks: ['学科带头人领衔定制', '复杂病例多学科会诊(MDT)级', '出具正式专家共识报告'],
  },
];

export default function CustomerServices() {
  return (
    <div className="space-y-5">
      {/* 上下文说明 */}
      <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/40 p-4 md:p-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Eye size={18} className="text-amber-700" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-amber-950">C 端服务界面预览</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800 border border-amber-300/50">
                仅交互示意
              </span>
            </div>
            <p className="text-sm text-amber-900/80 leading-relaxed">
              本页展示的是<strong className="font-semibold">客户侧产品</strong>的服务选购界面，不属于当前专家工作台的功能。
              您在此看到的是「客户如何发起评估需求」的参考样式，所有按钮均为演示，无法实际操作。
            </p>
          </div>
        </div>
      </div>

      {/* 双端关系示意 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-noah-50 border border-noah-100 text-noah-800">
          <Monitor size={16} className="shrink-0 text-noah-600" />
          <span><strong>当前系统</strong> · 专家工作台（领取任务、审查、结算）</span>
        </div>
        <ArrowLeftRight size={16} className="text-slate-300 shrink-0 hidden sm:block" />
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-100 border border-dashed border-slate-300 text-slate-600">
          <ShoppingCart size={16} className="shrink-0 text-slate-400" />
          <span><strong>下方预览</strong> · 客户侧独立站点（选购服务、下单）</span>
        </div>
      </div>

      {/* 预览画框 */}
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-200/80 border-b border-slate-300/80">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-slate-500 font-mono bg-white/60 px-3 py-0.5 rounded border border-slate-300/60">
              customer.noah-ai.com / services
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded bg-white/50 border border-slate-300/50">
            预览
          </span>
        </div>

        <div className="p-4 md:p-6 bg-white space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-2">临床研究与证据评价服务</h3>
            <p className="text-sm text-slate-500">
              基于高等级医学专家网络，为研究方案、统计设计、伦理风险提供结构化专业评估。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {servicePlans.map((plan) => (
              <div
                key={plan.title}
                className={`rounded-2xl border overflow-hidden relative flex flex-col ${
                  plan.dark
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : plan.featured
                      ? 'bg-white border-noah-500 shadow-sm'
                      : 'bg-white border-slate-200'
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute top-0 inset-x-0 h-1 bg-noah-500" />
                    <div className="absolute top-0 right-0 bg-noah-50 text-noah-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-noah-200">
                      最受欢迎
                    </div>
                  </>
                )}
                <div className={`p-5 flex-1 flex flex-col ${plan.featured ? 'mt-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {plan.dark && <Star size={14} className="text-orange-400 fill-orange-400" />}
                    <h4 className={`text-sm font-bold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                      {plan.title}
                    </h4>
                  </div>
                  <p className={`text-xs mb-5 flex-1 leading-relaxed ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>
                  <div className="mb-5">
                    <span className={`text-xl font-bold ${plan.dark ? 'text-white' : 'text-noah-600'}`}>
                      ¥{plan.price}
                      <span className={`text-xs font-normal ${plan.dark ? 'text-slate-400' : 'text-slate-400'}`}> 起</span>
                    </span>
                  </div>
                  <ul className={`space-y-2 text-xs mb-6 ${plan.dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check size={13} className={`shrink-0 mt-0.5 ${plan.dark ? 'text-noah-400' : 'text-noah-500'}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled
                    className={`w-full py-2 px-4 text-sm font-semibold rounded-lg mt-auto cursor-not-allowed opacity-60 ${
                      plan.featured
                        ? 'bg-noah-600 text-white'
                        : plan.dark
                          ? 'bg-white/90 text-slate-900'
                          : 'bg-slate-50 border border-slate-200 text-slate-500'
                    }`}
                    title="此为演示按钮，不可操作"
                  >
                    {plan.dark ? '联系专属顾问' : '立即发起'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm">
              <ShieldCheck size={16} className="text-noah-600" />
              服务边界与承诺说明
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600">
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong>纯粹评估：</strong>不提供文案润色、不直接修改申请书文本。</li>
                <li><strong>无利益绑定：</strong>客观评价，不承诺基金中标或发表成功。</li>
              </ul>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong>学术合规：</strong>不允许专家使用基金评审中的未公开信息。</li>
                <li><strong>核心聚焦：</strong>聚焦研究问题、方法学、统计设计、伦理风险和可行性评价。</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 pb-2">
            基于风险路由：普通内容由模型与 S1 处理；复杂、高风险需求进入高阶专家 (S3–S5) 流程
          </p>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 px-4">
        专家在此平台完成审查后，评估结果将交付至客户侧系统 — 两个产品面向不同用户，此处仅合并展示以便理解业务全貌。
      </p>
    </div>
  );
}
