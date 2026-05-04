import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Pencil, X } from 'lucide-react';
import { useAppStore, AppUser } from '@/store';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

function isWithin7Days(dateStr?: string) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = d.getTime() - today.getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  return days >= 0 && days <= 7;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const users = useAppStore((s) => s.users);
  const updateUser = useAppStore((s) => s.updateUser);

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [editExpiresAt, setEditExpiresAt] = useState('');

  const openEdit = (u: AppUser) => {
    setEditing(u);
    setEditExpiresAt(u.expiresAt || '');
  };

  const save = () => {
    if (!editing) return;
    updateUser(editing.id, { expiresAt: editExpiresAt || undefined });
    setEditing(null);
  };

  const highlightIds = useMemo(() => {
    return new Set(users.filter((u) => u.role === 'admin' && isWithin7Days(u.expiresAt)).map((u) => u.id));
  }, [users]);

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
          <h1 className="font-semibold text-lg text-neutral-900">权限时效管理</h1>
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
                  <th className="px-4 py-3">姓名</th>
                  <th className="px-4 py-3">科室</th>
                  <th className="px-4 py-3">角色</th>
                  <th className="px-4 py-3">账号有效期</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={cn(
                      'border-b border-neutral-100 last:border-0',
                      highlightIds.has(u.id) ? 'bg-amber-50/40' : 'bg-white',
                    )}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{u.dept}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-[11px] px-2 py-1 rounded-full border font-semibold',
                          u.role === 'admin'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200',
                        )}
                      >
                        {u.role === 'admin' ? '管理员' : '医生'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{u.expiresAt || '长期'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 inline-flex items-center gap-1.5"
                      >
                        <Pencil className="w-4 h-4" />
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              className="fixed inset-0 bg-neutral-900/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[520px] bg-white rounded-2xl p-5 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-900">编辑用户</div>
                <button onClick={() => setEditing(null)} className="p-2 rounded-full bg-neutral-100 text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-sm text-neutral-900 font-semibold">{editing.name}</div>
              <div className="mt-1 text-[11px] text-neutral-500">{editing.dept} · {editing.role === 'admin' ? '管理员' : '医生'}</div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-neutral-600 mb-2">账号有效期</label>
                <input
                  type="date"
                  value={editExpiresAt}
                  onChange={(e) => setEditExpiresAt(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="mt-2 text-[11px] text-neutral-500">
                  留空表示长期有效；到期管理员会出现在首页“近7天到期提醒”。
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  onClick={save}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

