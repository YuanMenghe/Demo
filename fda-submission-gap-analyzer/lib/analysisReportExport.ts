import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import type { AnalysisExportContext, ExportLanguage } from './reportExportContent';
import {
  buildReportSubtitle,
  buildReportTitle,
  getOrderedSectionsForModules,
} from './reportExportContent';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeFilePart(s: string): string {
  return s.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').slice(0, 96) || 'report';
}

function baseFileName(ctx: AnalysisExportContext, lang: ExportLanguage): string {
  const stamp = ctx.analysisDate.replace(/[: ]/g, '-').slice(0, 16);
  return safeFilePart(`${ctx.analysisName}_${stamp}_${lang}`);
}

function buildMetaParagraphs(lang: ExportLanguage, ctx: AnalysisExportContext): string[] {
  const l = lang === 'zh';
  return [
    l ? `项目：${ctx.projectName}` : `Project: ${ctx.projectName}`,
    l ? `分析名称：${ctx.analysisName}` : `Analysis: ${ctx.analysisName}`,
    l ? `时间：${ctx.analysisDate}` : `Date: ${ctx.analysisDate}`,
    l ? `分析文档数：${ctx.fileCount}` : `Documents analyzed: ${ctx.fileCount}`,
    l
      ? `包含模块：${ctx.modules.join(', ')}`
      : `Modules included: ${ctx.modules.join(', ')}`,
  ];
}

export function buildReportHtmlString(ctx: AnalysisExportContext, lang: ExportLanguage): string {
  const title = buildReportTitle(lang);
  const subtitle = buildReportSubtitle(lang);
  const meta = buildMetaParagraphs(lang, ctx);
  const sections = getOrderedSectionsForModules(lang, ctx.modules);

  const metaHtml = meta.map((p) => `<p style="margin:0 0 8px 0;">${escapeHtml(p)}</p>`).join('');
  const sectionsHtml = sections
    .map(
      (sec) => `
      <h2 style="font-size:15px;margin:18px 0 8px 0;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">${escapeHtml(sec.heading)}</h2>
      ${sec.paragraphs.map((line) => `<p style="margin:0 0 8px 0;white-space:pre-wrap;">${escapeHtml(line)}</p>`).join('')}
    `
    )
    .join('');

  return `
    <div style="font-family:'Segoe UI','Microsoft YaHei','PingFang SC',system-ui,sans-serif;font-size:12px;line-height:1.55;color:#0f172a;">
      <h1 style="font-size:20px;margin:0 0 6px 0;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 16px 0;color:#64748b;">${escapeHtml(subtitle)}</p>
      <div style="margin-bottom:20px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        ${metaHtml}
      </div>
      ${sectionsHtml}
    </div>
  `;
}

async function buildPdfBlob(html: string): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-12000px';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.padding = '16mm 18mm';
  container.style.boxSizing = 'border-box';
  container.style.background = '#ffffff';
  container.innerHTML = html;
  document.body.appendChild(container);

  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

  try {
    const blob = await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(container)
      .outputPdf('blob');
    return blob as Blob;
  } finally {
    document.body.removeChild(container);
  }
}

async function buildDocxBlob(ctx: AnalysisExportContext, lang: ExportLanguage): Promise<Blob> {
  const title = buildReportTitle(lang);
  const subtitle = buildReportSubtitle(lang);
  const meta = buildMetaParagraphs(lang, ctx);
  const sections = getOrderedSectionsForModules(lang, ctx.modules);

  const children: Paragraph[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: subtitle, color: '64748B' })],
    }),
    new Paragraph({ text: '' }),
    ...meta.map((line) => new Paragraph({ text: line })),
    new Paragraph({ text: '' }),
  ];

  for (const sec of sections) {
    children.push(
      new Paragraph({
        text: sec.heading,
        heading: HeadingLevel.HEADING_2,
      })
    );
    for (const p of sec.paragraphs) {
      children.push(new Paragraph({ text: p }));
    }
    children.push(new Paragraph({ text: '' }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadAnalysisPdf(ctx: AnalysisExportContext, lang: ExportLanguage): Promise<void> {
  const html = buildReportHtmlString(ctx, lang);
  const blob = await buildPdfBlob(html);
  saveAs(blob, `${baseFileName(ctx, lang)}.pdf`);
}

export async function downloadAnalysisDocx(ctx: AnalysisExportContext, lang: ExportLanguage): Promise<void> {
  const blob = await buildDocxBlob(ctx, lang);
  saveAs(blob, `${baseFileName(ctx, lang)}.docx`);
}

export async function downloadAnalysisBundleZip(ctx: AnalysisExportContext, lang: ExportLanguage): Promise<void> {
  const html = buildReportHtmlString(ctx, lang);
  const [pdfBlob, docxBlob] = await Promise.all([buildPdfBlob(html), buildDocxBlob(ctx, lang)]);
  const zip = new JSZip();
  const base = baseFileName(ctx, lang);
  zip.file(`${base}.pdf`, pdfBlob);
  zip.file(`${base}.docx`, docxBlob);
  const out = await zip.generateAsync({ type: 'blob' });
  saveAs(out, `${base}.zip`);
}
