import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import {
  Send,
  Paperclip,
  FileText,
  User,
  Bot,
  FileDown,
  FileType,
  Presentation,
  Lightbulb,
  PenLine,
  Upload,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { getContentStudioMock, type ContentStudioLocale } from '@/data/contentStudioMock';

type Mode = 'qa' | 'creation' | 'material';

export default function ContentStudio() {
  const { t, i18n } = useTranslation();
  const locale: ContentStudioLocale = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const mock = getContentStudioMock(locale);

  const [mode, setMode] = useState<Mode>('qa');
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [creationStep, setCreationStep] = useState<'topic' | 'outline' | 'content'>('topic');
  const [topic, setTopic] = useState(mock.creationTopicExample);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: t('contentStudio.welcomeMessage') }]);
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: input },
      { id: String(Date.now() + 1), role: 'assistant', content: mock.conclusionParagraph + ' [1][2]' },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1 items-start overflow-hidden h-[calc(100vh-3.5rem)]">
        <main className="flex-1 h-full flex flex-col min-w-0">
          {/* Mode tabs */}
          <div className="flex gap-1 p-2 border-b border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setMode('qa')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                mode === 'qa' ? 'bg-medical-teal-100 text-medical-teal-800' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Lightbulb className="w-4 h-4" />
              {mock.modeQA}
            </button>
            <button
              type="button"
              onClick={() => setMode('creation')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                mode === 'creation' ? 'bg-medical-teal-100 text-medical-teal-800' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <PenLine className="w-4 h-4" />
              {mock.modeCreation}
            </button>
            <button
              type="button"
              onClick={() => setMode('material')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                mode === 'material' ? 'bg-medical-teal-100 text-medical-teal-800' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Upload className="w-4 h-4" />
              {mock.modeMaterial}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Q&A mode: sample question + structured answer */}
              {mode === 'qa' && (
                <>
                  <p className="text-xs text-slate-500 mb-2">{t('contentStudio.demoNote')}</p>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-slate-800 text-white p-4 shadow-sm">
                      <p className="text-sm leading-relaxed">{mock.sampleQuestion}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-medical-teal-100 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-medical-teal-700" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white border border-slate-200 p-5 shadow-sm space-y-5">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          {mock.sectionConclusion}
                        </h4>
                        <p className="text-slate-800 leading-relaxed text-sm">
                          {mock.conclusionParagraph.split(' [1][2]')[0]}
                          <CitationBtn evidenceId="ev-1" label="1" activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                          <CitationBtn evidenceId="ev-2" label="2" activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                          .
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          {mock.sectionEvidenceSummary}
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          {mock.evidenceSummaryItems.map((item, idx) => (
                            <li key={idx} className="flex flex-wrap gap-x-2 gap-y-1">
                              <span className="text-slate-500">{mock.labelDesign}:</span> {item.design} ·{' '}
                              <span className="text-slate-500">{mock.labelSample}:</span> {item.sample} ·{' '}
                              <span className="text-slate-500">{mock.labelEndpoint}:</span> {item.endpoint}{' '}
                              <CitationBtn evidenceId={item.evidenceId} label={String(idx + 1)} activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          {mock.sectionDiscussionBoundary}
                        </h4>
                        <p className="text-slate-700 text-sm leading-relaxed">{mock.discussionParagraph}</p>
                        <p className="mt-2 text-amber-800 text-sm bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                          {mock.applicabilityBoundary}
                        </p>
                        <p className="mt-2 text-slate-600 text-sm italic">{mock.conflictCallout}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          {mock.sectionReferences}
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                          {mock.references.map(ref => (
                            <li key={ref.id} className="flex items-baseline gap-1">
                              <span>{ref.short}</span>
                              <CitationBtn evidenceId={ref.evidenceId} label={ref.id} activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Creation mode: topic → outline → content */}
              {mode === 'creation' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">{mock.creationTopicPlaceholder}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCreationStep('outline')}
                      className="px-4 py-2 bg-medical-teal-600 text-white rounded-lg text-sm font-medium hover:bg-medical-teal-700"
                    >
                      {mock.generateOutline}
                    </button>
                    {creationStep !== 'topic' && (
                      <button
                        type="button"
                        onClick={() => setCreationStep(creationStep === 'outline' ? 'content' : 'outline')}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {creationStep === 'outline' ? mock.confirmOutline : mock.generateByModule}
                      </button>
                    )}
                  </div>
                  {creationStep === 'outline' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">{mock.outlineTitle}</h4>
                      <ul className="space-y-2">
                        {mock.outlineSections.map((sec, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-slate-700"
                          >
                            {sec.evidenceId ? (
                              <CitationBtn evidenceId={sec.evidenceId} label={String(idx + 1)} activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                            ) : (
                              <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs">{idx + 1}</span>
                            )}
                            {sec.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {creationStep === 'content' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                      <h4 className="text-sm font-semibold text-slate-800">{mock.generatedModuleTitle}</h4>
                      {mock.generatedParagraphs.map((p, idx) => (
                        <p key={idx} className="text-slate-700 text-sm leading-relaxed">
                          {p.text}{' '}
                          {p.evidenceIds.map((eid, i) => (
                            <CitationBtn key={eid} evidenceId={eid} label={String(idx * 2 + i + 1)} activeId={activeEvidenceId} onSelect={setActiveEvidenceId} />
                          ))}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Material mode: upload + same as creation */}
              {mode === 'material' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">{mock.uploadPdfHint}</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="w-4 h-4" />
                      {t('contentStudio.uploadPdf')}
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">{mock.creationTopicPlaceholder}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500"
                    />
                  </div>
                  <p className="text-sm text-slate-500">{mock.materialHint}</p>
                </div>
              )}

              {/* Multi-turn chat (all modes) */}
              {messages.length > 1 && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  {messages.slice(1).map(msg => (
                    <div
                      key={msg.id}
                      className={cn('flex gap-4', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-medical-teal-100 text-medical-teal-700'
                        )}
                      >
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl p-4 shadow-sm text-sm',
                          msg.role === 'user'
                            ? 'bg-slate-800 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input + Export */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <div className="max-w-3xl mx-auto flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                <FileText className="w-3 h-3" />
                {t('contentStudio.uploadPdf')}
              </button>
            </div>
            <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-medical-teal-500/20 focus-within:border-medical-teal-500">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t('contentStudio.askPlaceholder')}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2 text-sm text-slate-800 placeholder:text-slate-400"
                rows={1}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <span className="text-xs text-slate-400">{t('contentStudio.followUpPlaceholder')}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  title="Demo"
                >
                  <FileType className="w-3.5 h-3.5" />
                  {mock.exportWord}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  title="Demo"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  {mock.exportTxt}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  title="Demo"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  {mock.exportPpt}
                </button>
              </div>
            </div>
          </div>
        </main>

        <EvidencePanel evidenceId={activeEvidenceId} onClose={() => setActiveEvidenceId(null)} />
      </div>
    </div>
  );
}

function CitationBtn({
  evidenceId,
  label,
  activeId,
  onSelect,
}: {
  evidenceId: string;
  label: string;
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const isActive = activeId === evidenceId;
  return (
    <sup
      role="button"
      tabIndex={0}
      onClick={() => onSelect(isActive ? null : evidenceId)}
      onKeyDown={e => e.key === 'Enter' && onSelect(isActive ? null : evidenceId)}
      className={cn(
        'ml-0.5 cursor-pointer font-semibold text-medical-teal-600 hover:underline inline',
        isActive && 'ring-2 ring-yellow-300 bg-yellow-100 rounded px-0.5'
      )}
    >
      [{label}]
    </sup>
  );
}
