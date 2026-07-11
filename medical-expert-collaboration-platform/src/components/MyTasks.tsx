import React from 'react';
import { Clock, AlertCircle, PlayCircle, FileEdit, ArrowRight } from 'lucide-react';

interface MyTasksProps {
  onProcess: (taskId: string) => void;
}

export default function MyTasks({ onProcess }: MyTasksProps) {
  const activeTasks = [
    {
      id: 'T-2023-108',
      title: '非小细胞肺癌(NSCLC)真实世界研究方案结构化审查',
      type: '混合类',
      difficulty: 'C4',
      status: 'in_progress',
      deadline: '2天后',
      progress: 30,
    },
    {
      id: 'T-2023-095',
      title: '乳腺癌IIT局部审查可行性评估',
      type: '开放式',
      difficulty: 'C3',
      status: 'revision',
      deadline: '4小时后',
      feedback: '核心结论基本正确，但技术路线风险论证不足，缺少可执行的修改建议，请补充。',
      progress: 80,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">我的任务</h2>
        <p className="text-sm text-slate-500 mt-1">您当前正在处理和需要返修的任务</p>
      </div>

      <div className="grid gap-4">
        {activeTasks.map((task) => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors relative overflow-hidden">
            {task.status === 'revision' && (
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            )}
            {task.status === 'in_progress' && (
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {task.id}
                  </span>
                  {task.status === 'revision' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded ring-1 ring-orange-200">
                      <AlertCircle size={12} />
                      Q2 需返修
                    </span>
                  )}
                  {task.status === 'in_progress' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded ring-1 ring-blue-200">
                      <Clock size={12} />
                      进行中
                    </span>
                  )}
                </div>
                
                <h3 className="text-base font-bold text-slate-900 mb-2">{task.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    难度: <span className="font-medium text-slate-700">{task.difficulty}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    类型: <span className="font-medium text-slate-700">{task.type}</span>
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${task.status === 'revision' ? 'text-orange-600' : 'text-slate-700'}`}>
                    剩余时间: {task.deadline}
                  </span>
                </div>

                {task.status === 'revision' && task.feedback && (
                  <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 mb-4 flex gap-2">
                    <FileEdit size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">质检反馈：</span>
                      {task.feedback}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${task.status === 'revision' ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium w-8">{task.progress}%</span>
                </div>
              </div>

              <div className="ml-6 flex flex-col justify-center shrink-0 h-full pt-4">
                <button 
                  onClick={() => onProcess(task.id)}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm ${
                    task.status === 'revision' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-noah-600 hover:bg-noah-700 text-white'
                  }`}
                >
                  {task.status === 'revision' ? '进入返修' : '继续处理'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
