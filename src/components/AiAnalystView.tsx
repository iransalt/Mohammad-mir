import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, MarketSummary, TrendDataPoint, CoinBubbleInfo } from '../types';
import { formatToman, toPersianDigits } from '../utils/calculations';
import { MOCK_TREND_WEEKLY } from '../data/mockData';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertTriangle,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  BarChart2,
} from 'lucide-react';

interface AiAnalystViewProps {
  summary: MarketSummary;
  trendData?: TrendDataPoint[];
  coinsBubble?: CoinBubbleInfo[];
}

export const AiAnalystView: React.FC<AiAnalystViewProps> = ({
  summary,
  trendData = MOCK_TREND_WEEKLY,
  coinsBubble = [],
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'melika',
      text: `سلام! من **ملیکا**، دستیار هوشمند و کارشناس تحلیل بازار طلا، سکه و ارز هستم.

هم‌اکنون در بازار ایران:
• **قیمت دلار:** ${summary.usdPrice.toLocaleString('fa-IR')} تومان
• **طلای ۱۸ عیار:** ${summary.gold18kPrice.toLocaleString('fa-IR')} تومان / گرم
• **سکه امامی:** ${summary.imamiCoinPrice.toLocaleString('fa-IR')} تومان
• **درصد حباب سکه امامی:** ${summary.imamiCoinBubblePercent.toLocaleString('fa-IR')}٪

می‌توانید تحلیل فنی ۲۴ ساعته بالا را مطالعه کنید یا سوالات اختصاصی خود را در چت بپرسید.`,
      timestamp: 'هم‌اکنون',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute 24-Hour Technical Analysis & Indicators
  const technicalAnalysis = useMemo(() => {
    const usd = summary.usdPrice;
    const gold18 = summary.gold18kPrice;
    const coin = summary.imamiCoinPrice;
    const bubblePercent = summary.imamiCoinBubblePercent;

    // Estimate weekly growth rate from trendData
    let usdGrowth = 0;
    let goldGrowth = 0;
    if (trendData && trendData.length > 1) {
      const first = trendData[0];
      const last = trendData[trendData.length - 1];
      usdGrowth = ((last.usd - first.usd) / first.usd) * 100;
      goldGrowth = ((last.gold18k - first.gold18k) / first.gold18k) * 100;
    }

    // Determine 24H Outlook
    let outlook = 'نوسانی با تمایل صعودی';
    let outlookColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    let signalText = 'محتمل‌ترین سناریو، نوسان مثبت محدود دلار و ثبات نسبی طلا با شیب ملایم است.';

    if (bubblePercent > 30) {
      outlook = 'پرریسک با احتمال اصلاح حباب';
      outlookColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      signalText = 'حباب سکه فوق‌العاده بالاست؛ احتمال تخلیه هیجان و اصلاح قیمت سکه در ۲۴ ساعت آینده بیشتر از طلاست.';
    } else if (usdGrowth > 2) {
      outlook = 'صعودی با شتاب بالادستی';
      outlookColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      signalText = 'به دلیل تقاضای بالادستی دلار، طلا و سکه روند صعودی کوتاه مدت را حفظ خواهند کرد.';
    }

    // Resistance & Support levels calculation
    const usdSupport = Math.floor((usd * 0.992) / 100) * 100;
    const usdResistance = Math.ceil((usd * 1.008) / 100) * 100;

    const coinSupport = Math.floor((coin * 0.985) / 100000) * 100000;
    const coinResistance = Math.ceil((coin * 1.015) / 100000) * 100000;

    const goldSupport = Math.floor((gold18 * 0.988) / 10000) * 10000;
    const goldResistance = Math.ceil((gold18 * 1.012) / 10000) * 10000;

    return {
      outlook,
      outlookColor,
      signalText,
      usdGrowth,
      goldGrowth,
      usdSupport,
      usdResistance,
      coinSupport,
      coinResistance,
      goldSupport,
      goldResistance,
      bubbleRiskLevel: bubblePercent > 30 ? 'بسیار بالا' : bubblePercent > 20 ? 'متوسط' : 'کم',
    };
  }, [summary, trendData]);

  const quickPrompts = [
    'پیش‌بینی کامل ۲۴ ساعت آینده بازار طلا و سکه',
    'آیا الان زمان مناسبی برای خرید سکه است؟',
    'چرا حباب ربع سکه همیشه از بقیه بالاتر است؟',
    'تفاوت خرید طلای آبشده با سکه حباب‌دار چیست؟',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: 'هم‌اکنون',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt,
          history: messages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const melikaMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'melika',
          text: data.reply,
          timestamp: 'هم‌اکنون',
        };
        setMessages((prev) => [...prev, melikaMessage]);
      } else {
        throw new Error(data.error || 'پاسخی دریافت نشد');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'melika',
          text: `خطا در دریافت پاسخ: ${err.message || 'لطفاً دوباره تلاش کنید.'}`,
          timestamp: 'هم‌اکنون',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 dir-rtl text-slate-100 flex flex-col h-[calc(100vh-140px)] max-h-[780px] animate-fadeIn">
      {/* Top Header Bar */}
      <div className="bg-slate-900 p-3.5 rounded-3xl border border-slate-800 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white">مشاور هوشمند ملیکا</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">پاسخ‌گویی و تحلیل داده‌های زنده طلا، حباب و تکنیکال</p>
          </div>
        </div>

        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded-xl border border-blue-500/30 flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3" /> آنلاین
        </span>
      </div>

      {/* 24-Hour Technical Analysis & Forecast Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-3.5 rounded-3xl border border-slate-800 shadow-xl space-y-2.5 shrink-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>پیش‌بینی و تحلیل ۲۴ ساعت آینده</span>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-md font-mono">
                  ۲۴H
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">بر اساس الگوریتم هوش مصنوعی و حباب فعلی</p>
            </div>
          </div>

          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-[10px] text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 flex items-center gap-1"
          >
            <span>{showTechnicalDetails ? 'بستن' : 'جزئیات'}</span>
            {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Forecast Status Badge & Signal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>دورنمای ۲۴ ساعت آینده:</span>
            </div>
            <div className={`text-xs font-black px-2 py-1 rounded-xl border w-fit ${technicalAnalysis.outlookColor}`}>
              {technicalAnalysis.outlook}
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>سطح ریسک حباب فعلی:</span>
            </div>
            <div className="text-xs font-black text-rose-300 flex items-center gap-1.5">
              <span>%{toPersianDigits(summary.imamiCoinBubblePercent.toFixed(1))}</span>
              <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded-md border border-rose-500/30 text-rose-300 font-normal">
                ({technicalAnalysis.bubbleRiskLevel})
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Technical Breakdown (Toggleable) */}
        {showTechnicalDetails && (
          <div className="space-y-2 pt-1 text-xs border-t border-slate-800/80 animate-fadeIn">
            <div className="bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>تحلیل فنی کوتاه ملیکا:</span>
              </div>
              <p>{technicalAnalysis.signalText}</p>
            </div>

            {/* Support & Resistance Levels */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                <div className="text-slate-400 font-bold">حمایت/مقاومت دلار</div>
                <div className="text-emerald-400 font-mono">{formatToman(technicalAnalysis.usdSupport, false)}</div>
                <div className="text-rose-400 font-mono">{formatToman(technicalAnalysis.usdResistance, false)}</div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                <div className="text-slate-400 font-bold">حمایت/مقاومت سکه</div>
                <div className="text-emerald-400 font-mono">{formatToman(technicalAnalysis.coinSupport, false)}</div>
                <div className="text-rose-400 font-mono">{formatToman(technicalAnalysis.coinResistance, false)}</div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                <div className="text-slate-400 font-bold">حمایت/مقاومت طلا ۱۸</div>
                <div className="text-emerald-400 font-mono">{formatToman(technicalAnalysis.goldSupport, false)}</div>
                <div className="text-rose-400 font-mono">{formatToman(technicalAnalysis.goldResistance, false)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 transition-all shrink-0 active:scale-95 text-right whitespace-nowrap"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-3xl border border-slate-800/80 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-3xl max-w-[85%] text-xs leading-relaxed space-y-1.5 ${
                msg.sender === 'user'
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100 rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{msg.text}</div>
              <div className="text-[9px] text-slate-500 text-left dir-ltr">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            <span>ملیکا در حال تحلیل و بررسی اطلاعات بازار...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0 pt-1"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="سوال خود را درباره حباب طلا، خرید سکه یا تحلیل بازار بپرسید..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />

        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
};

