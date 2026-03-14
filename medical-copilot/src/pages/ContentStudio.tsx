import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EvidencePanel } from '@/components/layout/EvidencePanel';
import { Send, Paperclip, FileText, User, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: { text: string; evidenceId: string }[];
}

export default function ContentStudio() {
  const { t, i18n } = useTranslation();
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = t('contentStudio.welcomeMessage');
    setMessages(prev => {
      if (!prev.length) {
        return [{ id: '1', role: 'assistant' as const, content: welcome, timestamp: new Date() }];
      }
      if (prev[0].role === 'assistant') {
        return [{ ...prev[0], content: welcome }, ...prev.slice(1)];
      }
      return prev;
    });
  }, [i18n.language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('contentStudio.aiResponse'),
        timestamp: new Date(),
        citations: [
          { text: t('contentStudio.citation1'), evidenceId: 'ev-1' },
          { text: t('contentStudio.citation2'), evidenceId: 'ev-2' }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1 items-start overflow-hidden h-[calc(100vh-3.5rem)]">
        <main className="flex-1 h-full flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-medical-teal-100 text-medical-teal-700"
                    )}
                  >
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4 shadow-sm",
                      msg.role === 'user'
                        ? "bg-slate-800 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-medical-teal-100 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-medical-teal-700" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2 mb-3">
                <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                  <FileText className="w-3 h-3" />
                  {t('contentStudio.uploadPdf')}
                </button>
              </div>

              <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-medical-teal-500/20 focus-within:border-medical-teal-500 transition-all shadow-sm">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
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
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 flex justify-center gap-4">
                <button type="button" className="text-xs text-slate-500 hover:text-medical-teal-600 transition-colors">{t('contentStudio.generatePpt')}</button>
                <span className="text-slate-300">|</span>
                <button type="button" className="text-xs text-slate-500 hover:text-medical-teal-600 transition-colors">{t('contentStudio.extractStats')}</button>
              </div>
            </div>
          </div>
        </main>

        <EvidencePanel evidenceId={activeEvidenceId} onClose={() => setActiveEvidenceId(null)} />
      </div>
    </div>
  );
}
