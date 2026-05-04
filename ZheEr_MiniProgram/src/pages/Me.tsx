import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Shield, UserCircle2 } from 'lucide-react';
import { useAppStore } from '@/store';

export default function Me() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const isAdmin = currentUser.role === 'admin';

  const roleLabel = useMemo(() => {
    if (currentUser.role === 'admin') return '管理员';
    return '医生';
  }, [currentUser.role]);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 relative">
      <header className="px-4 py-3 bg-white flex items-center justify-between border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-1 -ml-1 text-neutral-900 active:bg-neutral-100 rounded-full"
            aria-label="回到首页"
            title="回到首页"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg text-neutral-900">我的</h1>
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

      <main className="flex-1 overflow-y-auto p-4 pb-[96px] space-y-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-neutral-900 truncate">{currentUser.name}</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                  {roleLabel}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {currentUser.dept} · 账号有效期：{currentUser.expiresAt || '长期'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-neutral-900">权限示例</div>
            <div className="text-xs text-neutral-400">演示用</div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentUser({ role: 'doctor' })}
              className={`py-2.5 rounded-xl border text-sm font-medium ${
                currentUser.role === 'doctor'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}
            >
              普通医生
            </button>
            <button
              onClick={() => setCurrentUser({ role: 'admin' })}
              className={`py-2.5 rounded-xl border text-sm font-medium ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}
            >
              管理员
            </button>
          </div>

          <div className="mt-3 text-[11px] text-neutral-500 leading-relaxed">
            管理员可进入配置后台，管理指南条目、审核流与权限时效；普通医生仅可查看与使用。
          </div>

          <button
            disabled={!isAdmin}
            onClick={() => navigate('/admin')}
            className="mt-4 w-full bg-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            进入管理员配置后台
          </button>
        </div>
      </main>

      <div className="absolute bottom-0 inset-x-0 h-[64px] bg-white border-t border-neutral-200 flex px-2 pb-safe z-10">
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-neutral-400"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-emerald-600">
          <UserCircle2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </div>
    </div>
  );
}

