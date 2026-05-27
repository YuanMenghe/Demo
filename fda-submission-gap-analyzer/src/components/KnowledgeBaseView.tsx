import { useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { useLanguage } from '@/lib/i18n';
import {
  BookMarked,
  FileText,
  Trash2,
  StickyNote,
  UploadCloud,
  Loader2,
  Inbox,
  HardDrive,
  AlertCircle,
} from 'lucide-react';
import { CitationUserLink } from './CitationLink';

type AddMode = 'note' | 'file';

function formatBytes(bytes: number, lang: 'zh' | 'en') {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${lang === 'zh' ? 'KB' : 'KB'}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBaseView() {
  const { t, language } = useLanguage();
  const { entries, addTextEntry, addFileEntry, removeEntry, getFileBlob } = useKnowledge();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addMode, setAddMode] = useState<AddMode>('note');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const addPanelRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const notes = entries.filter((e) => e.kind === 'text').length;
    const pdfs = entries.filter((e) => e.kind === 'pdf').length;
    const docs = entries.filter((e) => e.kind === 'docx').length;
    const csvs = entries.filter((e) => e.kind === 'csv').length;
    const bytes = entries.reduce((sum, e) => {
      if ((e.kind === 'pdf' || e.kind === 'docx') && e.fileDataBase64) {
        return sum + Math.floor((e.fileDataBase64.length * 3) / 4);
      }
      return sum + (e.textContent?.length ?? 0);
    }, 0);
    return { notes, pdfs, docs, csvs, total: entries.length, bytes };
  }, [entries]);

  const handleSaveText = () => {
    if (!note.trim()) return;
    addTextEntry(title || t('未命名笔记', 'Untitled note'), note);
    setTitle('');
    setNote('');
    setErr(null);
  };

  const processFile = async (file: File) => {
    const name = file.name || '';
    const ext = name.split('.').pop()?.toLowerCase();
    const ok =
      file.type === 'application/pdf' ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'pdf' ||
      ext === 'csv' ||
      ext === 'docx';
    if (!ok) {
      setErr(t('请上传 PDF / Word(.docx) / CSV 文件', 'Please upload PDF / Word(.docx) / CSV'));
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      await addFileEntry(file);
    } catch (ex: unknown) {
      if (ex instanceof Error && ex.message === 'FILE_TOO_LARGE') {
        setErr(t('文件过大（演示限制约 900KB）', 'File too large (demo limit ~900KB)'));
      } else if (ex instanceof Error && ex.message === 'UNSUPPORTED_TYPE') {
        setErr(t('暂不支持该文件类型', 'Unsupported file type'));
      } else {
        setErr(t('上传失败', 'Upload failed'));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void processFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const downloadEntry = (entryId: string, fallbackName: string) => {
    const blob = getFileBlob(entryId);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fallbackName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const modeBtn = (mode: AddMode, label: string, icon: ReactNode) => (
    <button
      type="button"
      onClick={() => {
        setAddMode(mode);
        setErr(null);
      }}
      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        addMode === mode
          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-0px)] bg-slate-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookMarked className="w-6 h-6" />
              </span>
              {t('用户知识库', 'User knowledge base')}
            </h1>
            <p className="text-slate-500 mt-3 max-w-2xl">
              {t(
                '添加监管偏好、产品背景或参考 PDF，分析时将作为补充上下文（数据保存在本机浏览器，演示用途）。',
                'Add regulatory preferences, product context, or reference PDFs for analysis context (stored locally in your browser; demo).'
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 h-auto">
              {t('笔记', 'Notes')} {stats.notes}
            </Badge>
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 h-auto">
              PDF {stats.pdfs}
            </Badge>
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 h-auto">
              Word {stats.docs}
            </Badge>
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 h-auto">
              CSV {stats.csvs}
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 h-auto gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              {formatBytes(stats.bytes, language)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Add panel */}
          <Card ref={addPanelRef} className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('添加内容', 'Add content')}</CardTitle>
              <CardDescription>
                {t('选择笔记或 PDF，保存后可在分析报告中引用。', 'Save a note or PDF to reference during analysis.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                {modeBtn('note', t('笔记', 'Note'), <StickyNote className="w-4 h-4" />)}
                {modeBtn('file', t('文件', 'File'), <FileText className="w-4 h-4" />)}
              </div>

              {addMode === 'note' ? (
                <div className="space-y-3">
                  <Input
                    placeholder={t('标题（可选）', 'Title (optional)')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder={t(
                      '监管偏好、产品背景、关键假设、既往沟通要点…',
                      'Regulatory preferences, product context, key assumptions, prior communications…'
                    )}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[160px] resize-y"
                  />
                  <Button
                    onClick={handleSaveText}
                    disabled={!note.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {t('保存笔记', 'Save note')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                    className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'
                    } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
                  >
                    {uploading ? (
                      <Loader2 className="w-10 h-10 text-blue-500 mx-auto animate-spin" />
                    ) : (
                      <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
                    )}
                    <p className="text-sm font-medium text-slate-700 mt-3">
                      {t('拖拽 PDF / Word / CSV 到此处，或点击选择', 'Drag PDF / Word / CSV here or click to browse')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('单文件 ≤ 900KB（演示限制）', 'Max ~900KB per file (demo limit)')}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.csv,application/pdf,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={handleFileInput}
                    disabled={uploading}
                  />
                </div>
              )}

              {err && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{err}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Entries list */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {t('已保存条目', 'Saved entries')}
                <span className="ml-2 text-sm font-normal text-slate-500">({stats.total})</span>
              </h2>
            </div>

            {entries.length === 0 ? (
              <Card className="border-slate-200 border-dashed bg-white/80">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Inbox className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900">{t('知识库还是空的', 'Your knowledge base is empty')}</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">
                    {t('在左侧添加笔记或 PDF，条目会显示在这里，并可在材料完整性等模块中引用。', 'Add a note or PDF on the left; entries appear here and can be cited in analysis modules.')}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <Button
                      type="button"
                      onClick={() => {
                        setAddMode('note');
                        addPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {t('添加笔记', 'Add note')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAddMode('file');
                        addPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {t('上传文件', 'Upload file')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-3">
                {entries.map((e) => (
                  <li key={e.id}>
                    <Card className="border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div
                            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                              e.kind === 'pdf' || e.kind === 'docx'
                                ? 'bg-amber-50 text-amber-600'
                                : e.kind === 'csv'
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'bg-teal-50 text-teal-600'
                            }`}
                          >
                            {e.kind === 'pdf' || e.kind === 'docx' || e.kind === 'csv' ? (
                              <FileText className="w-5 h-5" />
                            ) : (
                              <StickyNote className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-medium text-slate-900 truncate">{e.title}</span>
                                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                    {e.kind === 'pdf'
                                      ? 'PDF'
                                      : e.kind === 'docx'
                                        ? 'DOCX'
                                        : e.kind === 'csv'
                                          ? 'CSV'
                                          : t('笔记', 'Note')}
                                  </Badge>
                                </div>
                                <time className="text-xs text-slate-400 mt-0.5 block">
                                  {new Date(e.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                                </time>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeEntry(e.id)}
                                aria-label={t('删除', 'Delete')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {e.kind === 'text' && e.textContent && (
                              <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap line-clamp-3 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                                {e.textContent}
                              </p>
                            )}

                            {(e.kind === 'pdf' || e.kind === 'docx') && (
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-slate-500 truncate max-w-[260px]">{e.fileName ?? e.title}</span>
                                {e.fileDataBase64 && (
                                  <span className="text-xs text-slate-400">
                                    {formatBytes(Math.floor((e.fileDataBase64.length * 3) / 4), language)}
                                  </span>
                                )}
                                {e.kind === 'pdf' ? (
                                  <CitationUserLink entryId={e.id} />
                                ) : (
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-blue-600"
                                    onClick={() => downloadEntry(e.id, e.fileName ?? e.title)}
                                  >
                                    {t('下载', 'Download')}
                                  </Button>
                                )}
                              </div>
                            )}

                            {e.kind === 'csv' && (
                              <div className="mt-3 space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                  <span className="text-slate-500 truncate max-w-[260px]">{e.fileName ?? e.title}</span>
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-blue-600"
                                    onClick={() => downloadEntry(e.id, e.fileName ?? e.title)}
                                  >
                                    {t('下载', 'Download')}
                                  </Button>
                                </div>
                                {typeof e.textContent === 'string' && e.textContent.trim() && (
                                  <pre className="text-xs leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100 overflow-x-auto max-h-40">
                                    {e.textContent.split('\n').slice(0, 12).join('\n')}
                                    {e.textContent.split('\n').length > 12 ? '\n…' : ''}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
