import React, { useMemo } from 'react';
import type { RWDFlowNode } from '@/types';
import { cn } from '@/lib/utils';

function fmt(n?: number) {
  if (n == null) return '';
  try { return n.toLocaleString(); } catch { return String(n); }
}

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 1000) / 10 : 100;
}

const PALETTE = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function depthColor(d: number) {
  return PALETTE[Math.min(d, PALETTE.length - 1)];
}

function typeLabel(depth: number, isLeaf: boolean) {
  if (depth === 0) return '筛选层级';
  return isLeaf ? '临床结局' : '治疗路径';
}

const Card: React.FC<{
  node: RWDFlowNode;
  depth: number;
  parentValue: number;
  inlineChildren?: boolean;
}> = ({ node, depth, parentValue, inlineChildren }) => {
  const p = pct(node.value, parentValue);
  const color = depthColor(depth);
  const isLeaf = !node.children?.length;

  return (
    <div
      className="flex flex-col rounded-lg border border-slate-200 shadow-sm bg-white overflow-hidden shrink-0"
      style={{ borderLeftColor: color, borderLeftWidth: 3, width: 176 }}
    >
      <div className="px-2.5 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color }}>
          {typeLabel(depth, isLeaf && !inlineChildren)}
        </div>
        <div className="text-xs font-semibold text-slate-800 leading-snug mb-1 line-clamp-2">{node.label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-slate-700 tabular-nums">{p}%</span>
          <span className="text-[10px] text-slate-400 tabular-nums">N={fmt(node.value)}</span>
        </div>
      </div>
      {inlineChildren && node.children?.length && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-2.5 py-1.5 space-y-1">
          {node.children.map(c => {
            const cp = pct(c.value, node.value);
            return (
              <div key={c.id} className="flex items-center gap-1">
                <span className="text-[10px] text-slate-600 truncate flex-1 min-w-0">{c.label}</span>
                <span className="text-[10px] font-bold text-slate-500 tabular-nums shrink-0 w-9 text-right">{cp}%</span>
                <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(6, cp)}%`, backgroundColor: color, opacity: 0.7 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Branch: React.FC<{
  node: RWDFlowNode;
  depth: number;
  parentValue: number;
}> = ({ node, depth, parentValue }) => {
  const kids = node.children ?? [];
  const allLeaves = kids.length > 0 && kids.every(c => !c.children?.length);

  if (kids.length === 0 || allLeaves) {
    return <Card node={node} depth={depth} parentValue={parentValue} inlineChildren={allLeaves} />;
  }

  return (
    <div className="flex items-center">
      <Card node={node} depth={depth} parentValue={parentValue} />
      <div className="w-4 h-px bg-slate-300 shrink-0" />

      <div className={cn('flex flex-col relative', kids.length > 1 ? 'gap-2' : '')}>
        {kids.length > 1 && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-300" />
        )}
        {kids.map((child) => (
          <div key={child.id} className="flex items-center">
            <div className={cn('h-px bg-slate-300 shrink-0', kids.length > 1 ? 'w-4' : 'w-0')} />
            <Branch node={child} depth={depth + 1} parentValue={node.value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export function RWDFlowChart({ data }: { data: RWDFlowNode[] }) {
  if (!data?.length) return null;

  const root = useMemo(() => {
    if (data.length === 1) return data[0];
    return {
      id: '__root__',
      label: '总人群',
      value: data.reduce((s, n) => s + n.value, 0),
      children: data,
    } as RWDFlowNode;
  }, [data]);

  return (
    <div className="w-full overflow-x-auto px-3 py-3">
      <div className="inline-flex">
        <Branch node={root} depth={0} parentValue={root.value} />
      </div>
    </div>
  );
}
