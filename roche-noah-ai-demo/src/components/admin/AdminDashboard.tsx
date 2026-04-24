import dashboardHtml from "../../../20260422Roche_Dashboard/index.html?raw";
import dashboardCss from "../../../20260422Roche_Dashboard/styles.css?raw";
import dashboardJs from "../../../20260422Roche_Dashboard/app.js?raw";
import dashboardData from "../../../20260422Roche_Dashboard/data/dashboard-data.js?raw";
import echartsUrl from "../../../20260422Roche_Dashboard/vendor/echarts.min.js?url";

function escapeInlineScript(source: string) {
  return source.replace(/<\/script/gi, "<\\/script");
}

function buildDashboardSrcDoc() {
  return dashboardHtml
    .replace('<link rel="stylesheet" href="./styles.css" />', `<style>${dashboardCss}</style>`)
    .replace('<script src="./vendor/echarts.min.js"></script>', `<script src="${echartsUrl}"><\\/script>`)
    .replace('<script src="./data/dashboard-data.js"></script>', `<script>${escapeInlineScript(dashboardData)}<\\/script>`)
    .replace('<script src="./app.js"></script>', `<script>${escapeInlineScript(dashboardJs)}<\\/script>`);
}

const dashboardSrcDoc = buildDashboardSrcDoc();

export function AdminDashboard() {
  return (
    <div className="h-full w-full bg-slate-50 p-4 md:p-6">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-teal-50/60 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">Insight Analytics</div>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Insight 洞见分析</h2>
              <p className="mt-1 text-sm text-slate-500">围绕平台总览、用户画像、科研热点和报告输出，统一放入当前若生 NOAH AI 工作台中查看。</p>
            </div>
            <div className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              已接入第 4 个标签
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-slate-50 p-3 md:p-4">
          <div className="h-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
            <iframe
              title="NOAH Insight Dashboard"
              srcDoc={dashboardSrcDoc}
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
