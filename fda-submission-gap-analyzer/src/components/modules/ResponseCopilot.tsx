import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, User, Send, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function ResponseCopilot() {
  const { t, language } = useLanguage();
  
  const issuesList = [
    {
      zh: "人群外推性：鉴于试验人群主要为亚洲人（>85%），PK/PD 曲线如何桥接到美国人群？",
      en: "Population Extrapolation: Given the predominantly Asian trial population (>85%), how do PK/PD profiles bridge to the US demographic?"
    },
    {
      zh: "有效性：在总生存期趋势的背景下，PFS 获益的幅度是否具有临床意义？",
      en: "Efficacy: Is the magnitude of the PFS benefit clinically meaningful in the context of the overall survival trend?"
    },
    {
      zh: "安全性：与阳性对照相比，间质性肺病 (ILD) 的发生率和严重程度如何？",
      en: "Safety: What is the incidence and severity of interstitial lung disease (ILD) compared to the active control?"
    }
  ];

  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draft, setDraft] = useState('');

  // Reset draft when language changes to avoid mixed language text
  useEffect(() => {
    setDraft('');
    setIsDrafting(false);
  }, [language]);

  const handleDraftResponse = () => {
    setIsDrafting(true);
    setDraft('');
    
    const responseText = language === 'zh' 
      ? `基于 ICH E5 和 FDA 关于人群外推性的指南，我们建议采取以下回复策略：\n\n1. **PK/PD 桥接**：我们将提供全面的群体 PK 分析，证明种族/民族不会显著影响研究药物的药代动力学。\n2. **疾病流行病学**：我们将提交文献，确认该适应症的疾病生物学和标准治疗在亚洲和美国人群中是一致的。\n3. **亚组分析**：我们将重点展示非亚洲亚组（n=45）的疗效和安全性结果，显示与整体试验结果的一致性。\n\n回复草稿：\n"申办方理解 FDA 对关键试验人口构成的担忧。为了解决这些数据对美国人群的适用性问题，我们已根据 ICH E5(R1) 进行了全面的桥接分析..."`
      : `Based on ICH E5 and FDA guidance on population extrapolation, we propose the following response strategy:\n\n1. **PK/PD Bridging**: We will provide a comprehensive population PK analysis demonstrating that race/ethnicity does not significantly impact the pharmacokinetics of the study drug.\n2. **Disease Epidemiology**: We will submit literature confirming that the disease biology and standard of care for this indication are consistent between the Asian and US populations.\n3. **Subgroup Analysis**: We will highlight the efficacy and safety results from the non-Asian subgroup (n=45), showing consistency with the overall trial results.\n\nDraft Response:\n"The Sponsor acknowledges the FDA's concern regarding the demographic composition of the pivotal trial. To address the applicability of these data to the US population, we have conducted a comprehensive bridging analysis in accordance with ICH E5(R1)..."`;

    let i = 0;
    const interval = setInterval(() => {
      setDraft((prev) => prev + responseText.charAt(i));
      i++;
      if (i >= responseText.length) {
        clearInterval(interval);
        setIsDrafting(false);
      }
    }, 20);
  };

  const currentIssueText = language === 'zh' ? issuesList[selectedIssueIndex].zh : issuesList[selectedIssueIndex].en;

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('回复草拟助手 (Copilot)', 'Response Drafting Copilot')}</h2>
        <p className="text-slate-500 mt-2">
          {t('选择一个预测的 FDA 问题，基于 FDA 指南和先例生成逻辑分析和回复草稿。', 'Select a predicted FDA issue to generate a logic analysis and draft response based on FDA guidance and precedent.')}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Panel: Issues List */}
        <Card className="col-span-1 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertOctagon className="w-4 h-4 mr-2 text-amber-500" />
              {t('预测问题', 'Predicted Issues')}
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {issuesList.map((issue, i) => (
                <div 
                  key={i}
                  onClick={() => { setSelectedIssueIndex(i); setDraft(''); }}
                  className={`p-3 rounded-lg text-sm cursor-pointer transition-colors border ${
                    selectedIssueIndex === i 
                      ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {language === 'zh' ? issue.zh : issue.en}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Panel: Copilot Workspace */}
        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              {t('AI 草拟工作区', 'AI Drafting Workspace')}
            </CardTitle>
            <Button size="sm" onClick={handleDraftResponse} disabled={isDrafting} className="h-8">
              {isDrafting ? t('草拟中...', 'Drafting...') : t('生成草稿', 'Generate Draft')}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* User Message (The Issue) */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-800 max-w-[85%]">
                    <p className="font-semibold mb-1 text-slate-900">{t('FDA 信息请求 (IR)：', 'FDA Information Request:')}</p>
                    {currentIssueText}
                  </div>
                </div>

                {/* AI Response */}
                {(draft || isDrafting) && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tr-none p-4 text-sm text-slate-800 max-w-[95%] w-full">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {draft}
                        {isDrafting && <span className="inline-block w-1.5 h-4 ml-1 bg-blue-500 animate-pulse align-middle"></span>}
                      </div>
                      
                      {!isDrafting && draft && (
                        <div className="mt-4 pt-4 border-t border-blue-200 flex items-center justify-between">
                          <div className="flex items-center text-xs text-blue-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t('参考依据：ICH E5(R1), FDA 多样性指南', 'References: ICH E5(R1), FDA Guidance on Diversity')}
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs bg-white">{t('编辑', 'Edit')}</Button>
                            <Button size="sm" className="h-7 text-xs">{t('复制到剪贴板', 'Copy to Clipboard')}</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4 bg-slate-50">
              <div className="relative">
                <Textarea 
                  placeholder={t('完善草稿或提出后续问题...', 'Refine the draft or ask a follow-up question...')} 
                  className="min-h-[80px] resize-none pr-12 bg-white"
                />
                <Button size="icon" className="absolute bottom-2 right-2 h-8 w-8 rounded-full">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
