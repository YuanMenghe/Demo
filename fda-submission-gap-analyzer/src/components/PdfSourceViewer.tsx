import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCitation } from '@/contexts/CitationContext';
import { useLanguage } from '@/lib/i18n';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export default function PdfSourceViewer() {
  const { viewer, closeViewer } = useCitation();
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewer.open || !viewer.pdfBlob || !canvasRef.current) return;

    let cancelled = false;
    const scale = 1.35;

    (async () => {
      const data = await viewer.pdfBlob.arrayBuffer();
      if (cancelled) return;
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const page = await pdf.getPage(viewer.page);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const task = page.render({ canvasContext: ctx, viewport, canvas });
      await task.promise;
    })().catch(() => {
      /* ignore */
    });

    return () => {
      cancelled = true;
    };
  }, [viewer.open, viewer.pdfBlob, viewer.page]);

  const { rect } = viewer;

  return (
    <Dialog open={viewer.open} onOpenChange={(open) => !open && closeViewer()}>
      <DialogContent
        className="max-w-[min(960px,calc(100%-2rem))] max-h-[90vh] overflow-y-auto sm:max-w-4xl"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{t('引用溯源 · 原文 PDF', 'Citation · Source PDF')}</DialogTitle>
          <p className="text-sm text-muted-foreground">{viewer.title}</p>
        </DialogHeader>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 overflow-x-auto">
          <div ref={wrapRef} className="relative inline-block min-w-0">
            <canvas ref={canvasRef} className="block max-w-full h-auto shadow-sm bg-white" />
            <div
              className="absolute pointer-events-none rounded-sm border-2 border-amber-400 bg-amber-300/35 shadow-[0_0_0_1px_rgba(251,191,36,0.5)]"
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.w * 100}%`,
                height: `${rect.h * 100}%`,
              }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {t('黄色区域为本次分析关联的原文片段（演示）。', 'Yellow overlay marks the linked excerpt (demo).')}
        </p>
      </DialogContent>
    </Dialog>
  );
}
