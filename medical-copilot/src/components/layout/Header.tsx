import React from 'react';
import { Bot, User, LogOut, Info, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  const navItems = [
    { name: 'HCP Insights', path: '/' },
    { name: 'Recommendation Expand', path: '/recommendation' },
    { name: 'Content Studio', path: '/studio' },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-medical-teal-700 font-semibold text-lg">
          <Bot className="w-6 h-6" />
          <span>Medical Copilot</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-medical-teal-50 text-medical-teal-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <User className="w-4 h-4" />
          <span>Switch User</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <Info className="w-4 h-4" />
          <span>Learn more</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-700 font-medium text-xs">
            SR
          </div>
          <span className="text-sm font-medium text-slate-700">Sonja Rivera</span>
        </div>
      </div>
    </header>
  );
}
