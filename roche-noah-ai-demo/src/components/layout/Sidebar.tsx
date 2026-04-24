import { 
  Home, 
  Gift, 
  ChevronDown,
  MoreHorizontal,
  UserPlus,
  PenTool,
  ClipboardList,
  PieChart
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  currentModule: string;
  onNavigate: (module: string) => void;
}

export function Sidebar({ currentModule, onNavigate }: SidebarProps) {

  return (
    <div className="w-64 border-r border-gray-100 h-screen flex flex-col bg-white flex-shrink-0">
      {/* Logo Area */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
          N
        </div>
        <span className="font-semibold text-lg tracking-tight">若生 NOAH AI</span>
        <div className="ml-auto flex items-center justify-center p-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 cursor-pointer">
          <Home size={14} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div>
          <NavItem 
            icon={<Home size={18} />} 
            label="首页" 
            active={currentModule === 'home'}
            onClick={() => onNavigate('home')}
          />
        </div>
        
        <div className="pt-2 pb-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-4 ml-1">科研智能场景</div>
          <div className="space-y-1">
            <NavItem 
              icon={<UserPlus size={18} />} 
              label="1. 科研人才培养" 
              active={currentModule === 'talent'} 
              onClick={() => onNavigate('talent')}
            />
            <NavItem 
              icon={<UserPlus size={18} className="text-indigo-400" />} 
              label="1.1 学习画像(新增)" 
              active={currentModule === 'profile'} 
              onClick={() => onNavigate('profile')}
              indent
            />
            <NavItem 
              icon={<PenTool size={18} />} 
              label="2. 综述辅助写作" 
              active={currentModule === 'thesis'} 
              onClick={() => onNavigate('thesis')}
            />
            <NavItem 
              icon={<ClipboardList size={18} />} 
              label="3. IIT全流程场景" 
              active={currentModule === 'iit'} 
              onClick={() => onNavigate('iit')}
            />
            <NavItem 
              icon={<PieChart size={18} />} 
              label="4. Insight洞见分析" 
              active={currentModule === 'admin'} 
              onClick={() => onNavigate('admin')}
            />
          </div>
        </div>
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-gray-50 space-y-4">
        <div className="flex items-center text-sm text-gray-600 hover:text-teal-600 cursor-pointer">
          <Gift size={16} className="mr-2 text-teal-500" />
          <span>与好友分享 NOAH</span>
          <ChevronDown size={14} className="ml-auto -rotate-90" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[80%]">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
              <span className="text-teal-700 text-xs font-bold">M</span>
            </div>
            <span className="text-sm text-gray-700 truncate">menghe.yuan@noah...</span>
          </div>
          <MoreHorizontal size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, indent }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void, indent?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center py-2.5 text-sm rounded-lg cursor-pointer transition-colors",
        indent ? "pl-9 pr-3" : "px-3",
        active ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      )}>
      <div className={cn("mr-3", active ? "text-gray-900" : "text-gray-500")}>
        {icon}
      </div>
      {label}
    </div>
  );
}
