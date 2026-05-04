import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

type GuidelineStatus = '草稿' | '已发布' | '已停用';
type GuidelineSource = 'NCCN' | 'CSCO' | 'ESMO' | 'ASCO';
type DataSource = '用户上传' | '免费指南';

interface GuidelineRow {
  id: string;
  source: GuidelineSource;
  tumor: string;
  status: GuidelineStatus;
  version: string;
  dataSource: DataSource;
}

const MOCK: GuidelineRow[] = [
  { id: 'g1', source: 'NCCN', tumor: 'DLBCL', status: '已发布', version: '2025.v3', dataSource: '免费指南' },
  { id: 'g2', source: 'CSCO', tumor: '滤泡淋巴瘤（FL）', status: '草稿', version: '2025.1', dataSource: '用户上传' },
  { id: 'g3', source: 'ESMO', tumor: '套细胞淋巴瘤（MCL）', status: '已停用', version: '2024.2', dataSource: '免费指南' },
];

function badgeClass(status: GuidelineStatus) {
  switch (status) {
    case '已发布':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case '草稿':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case '已停用':
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
}

export default function AdminGuidelines() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [onlyUploaded, setOnlyUploaded] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK.filter((r) => {
      if (onlyUploaded && r.dataSource !== '用户上传') return false;
      if (!q) return true;
      return (
        r.source.toLowerCase().includes(q) ||
        r.tumor.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q) ||
        r.dataSource.toLowerCase().includes(q)
      );
    });
  }, [query, onlyUploaded]);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 relative">
      <header className="px-4 py-3 bg-white flex items-center justify-between border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="p-1 -ml-1 text-neutral-900 active:bg-neutral-100 rounded-full"
            aria-label="返回"
            title="返回"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg text-neutral-900">指南条目列表</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 -mr-2 rounded-full text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
          aria-label="回到首页"
          title="回到首页"
        >
          <Home className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索来源 / 瘤种 / 状态 / 版本 / 数据来源"
                className="w-full bg-neutral-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              onClick={() => setOnlyUploaded((v) => !v)}
              className={cn(
                'px-3 py-2.5 rounded-xl border text-xs font-semibold',
                onlyUploaded
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white border-neutral-200 text-neutral-700',
              )}
            >
              仅用户上传
            </button>
          </div>

          <div className="mt-3 text-[11px] text-neutral-500 leading-relaxed">
            说明：付费指南用户上传后，可提供<strong>科室内部使用</strong>（演示逻辑：以“数据来源=用户上传”标识）。
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr className="text-[11px] font-semibold text-neutral-600">
                  <th className="px-4 py-3">指南来源</th>
                  <th className="px-4 py-3">适用瘤种</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">版本号</th>
                  <th className="px-4 py-3">数据来源</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{r.source}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{r.tumor}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] px-2 py-1 rounded-full border font-semibold', badgeClass(r.status))}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{r.version}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{r.dataSource}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-sm text-neutral-500 text-center">
                      无匹配数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

