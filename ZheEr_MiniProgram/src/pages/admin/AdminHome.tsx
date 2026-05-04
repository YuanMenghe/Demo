import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, ClipboardList, ShieldCheck, Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

function daysUntil(dateStr?: string) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = d.getTime() - today.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export default function AdminHome() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const users = useAppStore((s) => s.users);

  const expiringAdmins = useMemo(() => {
    return users
      .filter((u) => u.role === 'admin')
      .map((u) => ({ ...u, days: daysUntil(u.expiresAt) }))
      .filter((u) => u.days >= 0 && u.days <= 7)
      .sort((a, b) => a.days - b.days);
  }, [users]);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 relative">
      <header className="px-4 py-3 bg-white flex items-center justify-between border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/me')}
            className="p-1 -ml-1 text-neutral-900 active:bg-neutral-100 rounded-full"
            aria-label="返回"
            title="返回"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold text-lg text-neutral-900 leading-tight">管理员配置后台</h1>
            <p className="text-[10px] text-neutral-500">当前：{currentUser.name}（{currentUser.dept}）</p>
          </div>
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

      <main className="flex-1 overflow-y-auto p-4 pb-[24px] space-y-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
          <div className="font-semibold text-neutral-900">入口</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              onClick={() => navigate('/admin/guidelines')}
              className="w-full text-left px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 transition-colors flex items-center gap-3"
            >
              <ClipboardList className="w-5 h-5 text-emerald-700" />
              <div className="min-w-0">
                <div className="font-semibold text-neutral-900">指南条目列表</div>
                <div className="text-[11px] text-neutral-500">来源/瘤种/状态/版本/数据来源</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/review')}
              className="w-full text-left px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 transition-colors flex items-center gap-3"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div className="min-w-0">
                <div className="font-semibold text-neutral-900">规则审核流</div>
                <div className="text-[11px] text-neutral-500">查看详情 / 退回修改（必填原因）/ 发布</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="w-full text-left px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 transition-colors flex items-center gap-3"
            >
              <Users className="w-5 h-5 text-emerald-700" />
              <div className="min-w-0">
                <div className="font-semibold text-neutral-900">权限时效管理</div>
                <div className="text-[11px] text-neutral-500">用户编辑弹窗：账号有效期日期选择器</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-neutral-900">近7天到期管理员提醒</div>
            <div className="text-[11px] text-neutral-400">看板</div>
          </div>

          {expiringAdmins.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
              近 7 天暂无管理员到期。
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {expiringAdmins.map((u) => (
                <div
                  key={u.id}
                  className={cn(
                    'px-3 py-2 rounded-xl border flex items-start justify-between gap-3',
                    u.days <= 2 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200',
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 truncate">{u.name}</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5 truncate">{u.dept}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <AlertTriangle className={cn('w-4 h-4', u.days <= 2 ? 'text-red-600' : 'text-amber-600')} />
                    <div className="text-[11px] font-semibold text-neutral-900">{u.expiresAt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

