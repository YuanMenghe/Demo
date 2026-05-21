import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function SettingsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col">
      <header className="h-12 border-b border-slate-200 flex items-center px-4 gap-2 bg-white">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-slate-700">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <span className="font-semibold text-slate-800">设置</span>
      </header>
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <p className="text-slate-500 text-sm">Patient Like Me（数字孪生）系统设置页，可在此配置 API、偏好等。</p>
      </main>
    </div>
  );
}
