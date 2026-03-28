import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { useLanguage } from '@/lib/i18n';
import { BookMarked, FileUp, Trash2, StickyNote } from 'lucide-react';
import { CitationUserLink } from './CitationLink';

export default function KnowledgeBaseView() {
  const { t } = useLanguage();
  const { entries, addTextEntry, addPdfEntry, removeEntry } = useKnowledge();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSaveText = () => {
    if (!note.trim()) return;
    addTextEntry(title || t('未命名笔记', 'Untitled note'), note);
    setTitle('');
    setNote('');
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setErr(t('请上传 PDF 文件', 'Please upload a PDF file'));
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      await addPdfEntry(file);
    } catch (ex: unknown) {
      if (ex instanceof Error && ex.message === 'FILE_TOO_LARGE') {
        setErr(t('文件过大（演示限制约 900KB）', 'File too large (demo limit ~900KB)'));
      } else {
        setErr(t('上传失败', 'Upload failed'));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookMarked className="w-7 h-7 text-blue-600" />
          {t('用户知识库', 'User knowledge base')}
        </h1>
        <p className="text-slate-500 mt-2">
          {t(
            '上传自然语言笔记或 PDF 文档，作为分析时的参考上下文（本地浏览器保存，演示用途）。',
            'Add plain-text notes or PDFs as reference context for analyses (stored locally in your browser; demo).'
          )}
        </p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            {t('自然语言笔记', 'Natural language notes')}
          </CardTitle>
          <CardDescription>{t('标题可选。内容将保存在本地。', 'Optional title. Content is saved locally.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder={t('标题（可选）', 'Title (optional)')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder={t('在此输入您的监管偏好、产品背景、关键假设等…', 'Enter regulatory preferences, product context, key assumptions…')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[140px]"
          />
          <Button onClick={handleSaveText} disabled={!note.trim()} className="bg-blue-600 hover:bg-blue-700">
            {t('保存到知识库', 'Save to knowledge base')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            {t('文档上传', 'Document upload')}
          </CardTitle>
          <CardDescription>{t('支持 PDF。大文件可能超出浏览器存储配额。', 'PDF supported. Large files may exceed storage quota.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-slate-700">{t('选择 PDF', 'Choose PDF')}</span>
            <input type="file" accept="application/pdf" className="text-sm" onChange={(e) => void handleFile(e)} disabled={uploading} />
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('已保存条目', 'Saved entries')}</h2>
        {entries.length === 0 ? (
          <p className="text-slate-500 text-sm">{t('暂无条目', 'No entries yet')}</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900">{e.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{new Date(e.createdAt).toLocaleString()}</div>
                  {e.kind === 'text' && e.textContent && (
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap line-clamp-4">{e.textContent}</p>
                  )}
                  {e.kind === 'pdf' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">{e.pdfName}</span>
                      <CitationUserLink entryId={e.id} />
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-red-600" onClick={() => removeEntry(e.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
