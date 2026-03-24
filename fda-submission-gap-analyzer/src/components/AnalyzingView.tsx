import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, FileSearch, ShieldCheck, AlertTriangle, FileSignature } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface AnalyzingViewProps {
  onComplete: () => void;
}

export default function AnalyzingView({ onComplete }: AnalyzingViewProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 1, title: t('读取 CDE 文件', 'Reading CDE Documents'), description: t('解析 eCTD 结构并提取内容...', 'Parsing eCTD structure and extracting content...'), icon: FileSearch },
    { id: 2, title: t('模块 1：材料完整性', 'Module 1: Material Completeness'), description: t('对照 21 CFR Part 11 & eCTD 4.0 标准检查...', 'Checking against 21 CFR Part 11 & eCTD 4.0 standards...'), icon: CheckCircle2 },
    { id: 3, title: t('模块 2：科学性审查', 'Module 2: Scientific Validity'), description: t('对照 FDA 指南审查研究设计、终点和统计学...', 'Reviewing study design, endpoints, and statistics against FDA guidance...'), icon: ShieldCheck },
    { id: 4, title: t('模块 3：重点审查问题', 'Module 3: Key Review Issues'), description: t('从 FDA CRL 数据库识别潜在问题...', 'Identifying potential questions from FDA CRL Database...'), icon: AlertTriangle },
    { id: 5, title: t('模块 4：回复辅助草拟', 'Module 4: Response Copilot'), description: t('准备草拟环境和逻辑分析...', 'Preparing drafting environment and logic analysis...'), icon: FileSignature },
  ];

  useEffect(() => {
    const totalDuration = 8000;
    const stepDuration = totalDuration / steps.length;
    
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
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('AI 差距分析进行中', 'AI Gap Analysis in Progress')}</h2>
          <p className="text-slate-500">{t('正在将您的 CDE 申报材料与 FDA NDA/BLA 要求进行比对。', 'Comparing your CDE submission against FDA NDA/BLA requirements.')}</p>
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
                <div className={`mt-1 flex-shrink-0 ${
                  isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    isCompleted ? 'text-slate-900' : isCurrent ? 'text-blue-900' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    isCompleted ? 'text-slate-600' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                  }`}>
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
