import { useRef, useState } from "react";
import dashboardHtml from "../../../20260422Roche_Dashboard/index.html?raw";
import dashboardCssUrl from "../../../20260422Roche_Dashboard/styles.css?url";
import dashboardJsUrl from "../../../20260422Roche_Dashboard/app.js?url";
import dashboardDataUrl from "../../../20260422Roche_Dashboard/data/dashboard-data.js?url";
import echartsUrl from "../../../20260422Roche_Dashboard/vendor/echarts.min.js?url";

const sections = [
  { id: "overviewSection", label: "总览" },
  { id: "personaSection", label: "用户画像" },
  { id: "featureSection", label: "功能分析" },
  { id: "hotspotSection", label: "科研热点" },
  { id: "reportSection", label: "报告输出" },
];

function assetUrl(url: string) {
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.href).toString();
}

function buildDashboardSrcDoc() {
  const cssHref = assetUrl(dashboardCssUrl);
  const echartsSrc = assetUrl(echartsUrl);
  const dataSrc = assetUrl(dashboardDataUrl);
  const appSrc = assetUrl(dashboardJsUrl);

  return dashboardHtml
    .replace('<link rel="stylesheet" href="./styles.css" />', `<link rel="stylesheet" href="${cssHref}" />`)
    .replace('<script src="./vendor/echarts.min.js"></script>', `<script src="${echartsSrc}"><\/script>`)
    .replace('<script src="./data/dashboard-data.js"></script>', `<script src="${dataSrc}"><\/script>`)
    .replace('<script src="./app.js"></script>', `<script src="${appSrc}"><\/script>`);
}

export function AdminDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("正在加载数据与图表...");

  const scrollToSection = (sectionId: string) => {
    const doc = iframeRef.current?.contentWindow?.document;
    doc?.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reloadDashboard = () => {
    setStatus("正在重新加载 Insight 数据...");
    setIsLoading(true);
    setFrameKey((key) => key + 1);
  };

  const handleLoad = () => {
    setIsLoading(false);
    window.setTimeout(() => {
      const frameWindow = iframeRef.current?.contentWindow as (Window & { DASHBOARD_DATA?: unknown }) | undefined;
      const hasData = Boolean(frameWindow?.DASHBOARD_DATA);
      const hasKpis = Boolean(iframeRef.current?.contentWindow?.document.querySelector("#kpiGrid .kpi-card"));
      setStatus(hasData && hasKpis ? "数据已加载，图表可交互" : "页面已加载，若图表为空请点击刷新");
    }, 500);
  };

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
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                {status}
              </div>
              <button
                type="button"
                onClick={reloadDashboard}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                刷新数据
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-slate-50 p-3 md:p-4">
          <div className="relative h-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="rounded-2xl border border-teal-100 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
                  正在加载 Insight 数据与图表...
                </div>
              </div>
            )}
            <iframe
              key={frameKey}
              ref={iframeRef}
              title="NOAH Insight Dashboard"
              srcDoc={buildDashboardSrcDoc()}
              onLoad={handleLoad}
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
