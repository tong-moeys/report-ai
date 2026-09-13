import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  ListChecks, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  Check, 
  RefreshCw,
  School,
  ArrowRight
} from 'lucide-react';
import { FullSchoolReport } from '../types';

interface AiAssistantCenterProps {
  report: FullSchoolReport;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantCenter: React.FC<AiAssistantCenterProps> = ({ report }) => {
  const [activeFeature, setActiveFeature] = useState<'synthesis' | 'recommendations' | 'chat'>('synthesis');

  // Executive Synthesis state
  const [synthesisText, setSynthesisText] = useState<string>('');
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState<boolean>(false);
  const [synthesisCopied, setSynthesisCopied] = useState<boolean>(false);

  // Recommendations state
  const [recommendationsText, setRecommendationsText] = useState<string>('');
  const [isGeneratingRecs, setIsGeneratingRecs] = useState<boolean>(false);
  const [recsCopied, setRecsCopied] = useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `ជម្រាបសួរលោកនាយក និងលោកគ្រូ-អ្នកគ្រូ! ខ្ញុំជាជំនួយការ AI សម្រាប់រៀបចំ និងវិភាគរបាយការណ៍សាលាបឋមសិក្សា ${report.info.schoolName}។ ខ្ញុំអាចជួយលោកអ្នកក្នុងការបូកសរុប វិភាគស្ថិតិសិស្ស ពិនិត្យរូបមន្ត និងតាក់តែងសំណូមពរផ្សេងៗ។ តើខ្ញុំអាចជួយអ្វីបានខ្លះថ្ងៃនេះ?`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Handlers
  const handleGenerateSynthesis = async () => {
    setIsGeneratingSynthesis(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report }),
      });
      const data = await res.json();
      if (data.analysis) {
        setSynthesisText(data.analysis);
      }
    } catch (e) {
      console.error(e);
      setSynthesisText('មានបញ្ហាក្នុងការទាញយកទិន្នន័យពី AI។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsGeneratingSynthesis(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecs(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report }),
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendationsText(data.recommendations);
      }
    } catch (e) {
      console.error(e);
      setRecommendationsText('មានបញ្ហាក្នុងការទាញយកទិន្នន័យពី AI។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  const handleSendChat = async (queryText?: string) => {
    const text = queryText || chatInput;
    if (!text.trim()) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          report,
          history: newMsgs.slice(-6),
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMsgs,
        { role: 'assistant', content: 'សូមអភ័យទោស មានការរអាក់រអួលក្នុងបណ្តាញ។ សូមព្យាយាមម្តងទៀត។' },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePrompts = [
    'តើអត្រាសិស្សជាប់ និងសិស្សបោះបង់មានស្ថានភាពយ៉ាងណា?',
    'ជួយវិភាគបញ្ហាប្រឈមនៃមុខវិជ្ជាភាសាអង់គ្លេស',
    'ជួយរៀបចំសំណើជួសជុលបន្ទប់រៀនទៅការិយាល័យអប់រំស្រុក',
    'តើសុខភាពសិក្សា និងការទម្លាក់ព្រូនសម្រេចបានប៉ុន្មាន?',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Feature Selector */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFeature('synthesis')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            activeFeature === 'synthesis'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>របាយការណ៍សំយោគ & វាយតម្លៃរួម (Executive Synthesis)</span>
        </button>

        <button
          onClick={() => setActiveFeature('recommendations')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            activeFeature === 'recommendations'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>ផែនការសកម្មភាព & អនុសាសន៍យុទ្ធសាស្ត្រ (Recommendations)</span>
        </button>

        <button
          onClick={() => setActiveFeature('chat')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            activeFeature === 'chat'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>ជជែកសាកសួរ AI (Interactive Q&A)</span>
        </button>
      </div>

      {/* 1. EXECUTIVE SYNTHESIS */}
      {activeFeature === 'synthesis' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>របាយការណ៍សំយោគ និងវិភាគលទ្ធផលសាលារៀន (AI Executive Synthesis)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI នឹងធ្វើការទាញយកទិន្នន័យស្ថិតិសិស្ស គ្រូបង្រៀន លទ្ធផលប្រឡង សុខភាព និងបញ្ហាប្រឈម ដើម្បីតាក់តែងជារបាយការណ៍សំយោគផ្លូវការ។
              </p>
            </div>

            <div className="flex items-center gap-2">
              {synthesisText && (
                <button
                  onClick={() => handleCopyText(synthesisText, setSynthesisCopied)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {synthesisCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{synthesisCopied ? 'បានចម្លង' : 'ចម្លងអត្ថបទ'}</span>
                </button>
              )}

              <button
                disabled={isGeneratingSynthesis}
                onClick={handleGenerateSynthesis}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-50"
              >
                {isGeneratingSynthesis ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>កំពុងវិភាគ និងសំយោគ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{synthesisText ? 'បង្កើតសំយោគឡើងវិញ' : 'ដំណើរការសំយោគដោយ AI'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {synthesisText ? (
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {synthesisText}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">មិនទាន់មានរបាយការណ៍សំយោគនៅឡើយទេ</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ចុចប៊ូតុង "ដំណើរការសំយោគដោយ AI" ខាងលើ ដើម្បីឱ្យ Gemini Flash វិភាគទិន្នន័យជាក់ស្តែងរបស់សាលា និងបង្កើតរបាយការណ៍បូកសរុប។
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. RECOMMENDATIONS */}
      {activeFeature === 'recommendations' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-amber-600" />
                <span>ផែនការសកម្មភាព និងអនុសាសន៍យុទ្ធសាស្ត្រ (Action Plan & Strategic Recommendations)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ផ្តល់អនុសាសន៍ជាក់ស្តែងសម្រាប់នាយកសាលា លោកគ្រូ-អ្នកគ្រូ គណៈកម្មការទ្រទ្រង់សាលា និងសំណើទៅកម្រង/ការិយាល័យអប់រំ។
              </p>
            </div>

            <div className="flex items-center gap-2">
              {recommendationsText && (
                <button
                  onClick={() => handleCopyText(recommendationsText, setRecsCopied)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {recsCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{recsCopied ? 'បានចម្លង' : 'ចម្លងអត្ថបទ'}</span>
                </button>
              )}

              <button
                disabled={isGeneratingRecs}
                onClick={handleGenerateRecommendations}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-50"
              >
                {isGeneratingRecs ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>កំពុងរៀបចំផែនការ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{recommendationsText ? 'បង្កើតអនុសាសន៍ឡើងវិញ' : 'ទាញយកអនុសាសន៍ដោយ AI'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {recommendationsText ? (
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {recommendationsText}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <ListChecks className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">មិនទាន់មានអនុសាសន៍យុទ្ធសាស្ត្រនៅឡើយទេ</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ចុចប៊ូតុង "ទាញយកអនុសាសន៍ដោយ AI" ខាងលើ ដើម្បីទទួលបានអនុសាសន៍ឆ្លើយតបទៅនឹងចំណុចខ្សោយ និងបញ្ហាប្រឈមរបស់សាលា។
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. INTERACTIVE CHAT */}
      {activeFeature === 'chat' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">ជំនួយការឆ្លាតវៃសាលារៀន (School Report AI)</h4>
                <p className="text-xs text-emerald-600 font-medium">● ត្រៀមរួចរាល់សម្រាប់ឆ្លើយតប</p>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 p-1 rounded hover:bg-slate-100"
              title="ចាប់ផ្តើមសារឡើងវិញ"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              សម្អាតប្រវត្តិជជែក
            </button>
          </div>

          {/* Quick prompt chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] text-slate-500 shrink-0 font-medium ml-1">សំណួររហ័ស៖</span>
            {samplePrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendChat(prompt)}
                disabled={isSendingChat}
                className="text-xs px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-full border border-slate-200 shrink-0 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed whitespace-pre-line shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isSendingChat && (
              <div className="flex gap-3 text-xs sm:text-sm justify-start">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 rounded-xl p-3 rounded-tl-xs flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>កំពុងគិត និងវិភាគទិន្នន័យ...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="សួរអំពីស្ថិតិសិស្ស ការប្រឡង ថវិកា ឬសំណូមពរ..."
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSendingChat || !chatInput.trim()}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>ផ្ញើ</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
