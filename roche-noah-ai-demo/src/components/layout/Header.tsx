import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="flex justify-end items-center p-4">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-100 text-teal-600 text-sm font-medium hover:bg-teal-50 transition-colors">
        <Sparkles size={14} />
        <span>1,275</span>
        <span className="text-teal-200">|</span>
        <span>升级</span>
      </button>
    </header>
  );
}
