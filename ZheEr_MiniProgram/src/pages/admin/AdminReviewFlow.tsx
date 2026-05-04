import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, X, Eye, Undo2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

type ReviewStatus = '待审核' | '已退回' | '已发布';

interface ReviewItem {
  id: string;
  title: string;
  dept: string;
  updatedAt: string;
  status: ReviewStatus;
}

const MOCK: ReviewItem[] = [
  { id: 'r1', title: 'DLBCL 一线方案规则集（v1）', dept: '血液科', updatedAt: '2026-05-03 10:12', status: '待审核' },
  { id: 'r2', title: 'FL 风险分层补充条款（v2）', dept: '肿瘤科', updatedAt: '2026-05-02 16:40', status: '待审核' },
  { id: 'r3', title: 'MCL 维持治疗注意事项（v1）', dept: '血液科', updatedAt: '2026-04-28 09:05', status: '已退回' },
];

function statusBadge(status: ReviewStatus) {
  switch (status) {
    case '待审核':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case '已退回':
      return 'bg-red-50 text-red-700 border-red-200';
    case '已发布':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

export default function AdminReviewFlow() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ReviewItem[]>(MOCK);

  const [detailItem, setDetailItem] = useState<ReviewItem | null>(null);
  const [returningItem, setReturningItem] = useState<ReviewItem | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const canSubmitReturn = useMemo(() => returnReason.trim().length > 0, [returnReason]);

  const openReturn = (item: ReviewItem) => {
    setReturningItem(item);
    setReturnReason('');
  };

  const submitReturn = () => {
    if (!returningItem || !canSubmitReturn) return;
    setItems((prev) =>
      prev.map((x) => (x.id === returningItem.id ? { ...x, status: '已退回' } : x)),
    );
    setReturningItem(null);
  };

  const publish = (item: ReviewItem) => {
    if (!confirm('确认发布该规则？')) return;
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: '已发布' } : x)));
  };

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
          <h1 className="font-semibold text-lg text-neutral-900">规则审核流</h1>
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
        <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr className="text-[11px] font-semibold text-neutral-600">
                  <th className="px-4 py-3">规则条目</th>
                  <th className="px-4 py-3">科室</th>
                  <th className="px-4 py-3">更新时间</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{it.title}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{it.dept}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{it.updatedAt}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] px-2 py-1 rounded-full border font-semibold', statusBadge(it.status))}>
                        {it.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDetailItem(it)}
                          className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          查看详情
                        </button>
                        <button
                          onClick={() => openReturn(it)}
                          className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 flex items-center gap-1.5"
                        >
                          <Undo2 className="w-4 h-4" />
                          退回修改
                        </button>
                        <button
                          onClick={() => publish(it)}
                          className="px-3 py-2 rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 active:bg-neutral-700 flex items-center gap-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          发布
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {detailItem && (
          <>
            <motion.div
              className="fixed inset-0 bg-neutral-900/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailItem(null)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[520px] bg-white rounded-2xl p-5 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-900">规则详情</div>
                <button onClick={() => setDetailItem(null)} className="p-2 rounded-full bg-neutral-100 text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-sm text-neutral-800 font-semibold">{detailItem.title}</div>
              <div className="mt-2 text-[11px] text-neutral-500">
                这里是演示详情内容：包括规则适用范围、触发条件、引用条款与变更说明等。
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Return modal: reason required */}
      <AnimatePresence>
        {returningItem && (
          <>
            <motion.div
              className="fixed inset-0 bg-neutral-900/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturningItem(null)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[520px] bg-white rounded-2xl p-5 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-900">退回修改</div>
                <button onClick={() => setReturningItem(null)} className="p-2 rounded-full bg-neutral-100 text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-[11px] text-neutral-600">
                退回 <span className="font-semibold text-neutral-900">{returningItem.title}</span>
              </div>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="必须填写退回原因（否则无法提交）"
                className="mt-3 w-full h-28 bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => setReturningItem(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  disabled={!canSubmitReturn}
                  onClick={submitReturn}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold',
                    canSubmitReturn
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
                  )}
                >
                  提交退回
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

