import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, FileSearch, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface AnalyzingViewProps {
  onComplete: () => void;
}

export default function AnalyzingView({ onComplete }: AnalyzingViewProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: 1,
      title: t('读取 M1–M5 卷宗', 'Reading M1–M5 dossier'),
      description: t('解析 eCTD 目录与各模块子文件夹...', 'Parsing eCTD TOC and module subfolders...'),
      icon: FileSearch,
    },
    {
      id: 2,
      title: t('材料完整性检查', 'Material completeness'),
      description: t('形式缺失项清单 + 技术完整性报告...', 'Formal missing list + technical integrity report...'),
      icon: CheckCircle2,
    },
    {
      id: 3,
      title: t('科学性审查', 'Scientific validity'),
      description: t('对照指南审查研究设计、终点与统计学...', 'Reviewing design, endpoints, and statistics vs guidance...'),
      icon: ShieldCheck,
    },
    {
      id: 4,
      title: t('可能的审查问题预测', 'Predicted review questions'),
      description: t('基于历史审评与 CRL 先例生成问题清单...', 'Generating questions from review history and CRL precedent...'),
      icon: AlertTriangle,
    },
  ];

  useEffect(() => {
    const totalDuration = 8000;
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 100 / (totalDuration / 50);
      setProgress(Math.min(currentProgress, 100));

      const stepIndex = Math.min(Math.floor((currentProgress / 100) * steps.length), steps.length - 1);
      setCurrentStep(stepIndex);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('申报审查分析进行中', 'Submission review in progress')}</h2>
          <p className="text-slate-500">{t('正在处理 M1–M5 输入并生成审查报告。', 'Processing M1–M5 inputs and generating the review report.')}</p>
        </div>

        <Progress value={progress} className="h-3 mb-10" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                  isCurrent ? 'bg-blue-50 border border-blue-100' : 'bg-transparent'
                }`}
              >
                <div
                  className={`mt-1 flex-shrink-0 ${
                    isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4
                    className={`font-semibold ${
                      isCompleted ? 'text-slate-900' : isCurrent ? 'text-blue-900' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      isCompleted ? 'text-slate-600' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
