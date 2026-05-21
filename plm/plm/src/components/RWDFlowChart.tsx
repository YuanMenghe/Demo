import React from 'react';
import { RWDFlowNode as RWDFlowNodeType } from '../types';
import { cn } from '../lib/utils';

interface RWDFlowChartProps {
  data: RWDFlowNodeType;
}

const NodeCard: React.FC<{ node: RWDFlowNodeType }> = ({ node }) => {
  const isOutcome = node.type === 'outcome';
  const isTerminal = node.status === 'terminal';
  
  // Determine color styles based on node type/status
  let bgColor = 'bg-white';
  let borderColor = 'border-slate-200';
  let textColor = 'text-slate-700';
  
  if (node.color) {
    // We use inline styles for dynamic colors from data, but fallback to classes
    // For simplicity in this demo, we'll use the color prop for the border/accent
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col p-3 rounded-lg border shadow-sm min-w-[180px] max-w-[220px] transition-all hover:shadow-md",
        isOutcome ? "bg-slate-50" : "bg-white",
        isTerminal ? "border-l-4 border-l-red-400" : "border-l-4 border-l-emerald-400"
      )}
      style={{ borderLeftColor: node.color }}
    >
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {node.type === 'state' ? '初始队列' : node.type === 'treatment' ? '治疗方案' : '临床结局'}
      </span>
      <span className="font-medium text-slate-900 text-sm leading-tight mb-2">
        {node.label}
      </span>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-slate-700">
          {node.percentage}%
        </span>
        {node.count !== undefined && (
          <span className="text-xs text-slate-400">
            N={node.count}
          </span>
        )}
      </div>
    </div>
  );
};

const FlowBranch: React.FC<{ node: RWDFlowNodeType; isRoot?: boolean }> = ({ node, isRoot = false }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex items-center">
      {/* Node Content */}
      <NodeCard node={node} />

      {/* Connector to Children */}
      {hasChildren && (
        <div className="flex items-center">
          {/* Horizontal Line from Parent */}
          <div className="w-8 h-px bg-slate-300"></div>
          
          {/* Children Container */}
          <div className="flex flex-col gap-6">
            {node.children!.map((child, index) => (
              <div key={child.id} className="flex items-center relative">
                {/* Vertical Connector Logic would go here for a perfect tree, 
                    but for a simple flex layout, we just render branches. 
                    To make it look like a tree, we need a parent wrapper that handles the branching lines.
                    For this MVP, we'll stick to simple horizontal flow. 
                */}
                {/* Connector to Child */}
                {/* <div className="w-4 h-px bg-slate-300"></div> */}
                <FlowBranch node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Improved Tree Layout using CSS Grid/Flex to align connectors
const FlowTree: React.FC<{ node: RWDFlowNodeType }> = ({ node }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex items-center">
      <NodeCard node={node} />
      
      {hasChildren && (
        <>
          <div className="w-12 h-px bg-slate-300 flex-shrink-0"></div>
          <div className="flex flex-col gap-4 relative">
            {/* Vertical Line covering the span of children */}
            {node.children!.length > 1 && (
              <div className="absolute left-0 top-10 bottom-10 w-px bg-slate-300 -ml-px"></div>
            )}
            
            {node.children!.map((child, index) => (
              <div key={child.id} className="flex items-center relative">
                {/* Horizontal connector from vertical line to child */}
                {node.children!.length > 1 && (
                  <div className="w-6 h-px bg-slate-300 flex-shrink-0 -ml-6 mr-0"></div>
                )}
                <FlowTree node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const RWDFlowChart: React.FC<RWDFlowChartProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto p-4 bg-slate-50/50 rounded-xl border border-slate-100">
      <div className="min-w-max">
        <FlowTree node={data} />
      </div>
    </div>
  );
};
