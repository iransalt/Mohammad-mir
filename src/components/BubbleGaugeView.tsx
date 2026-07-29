import React, { useState } from 'react';
import { CoinBubbleInfo, GoldBubbleInfo, MarketSummary } from '../types';
import { formatToman, formatUsd, formatPercent, toPersianDigits } from '../utils/calculations';
import { Scale, HelpCircle, ShieldAlert, ShieldCheck, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface BubbleGaugeViewProps {
  summary: MarketSummary;
  coinsBubble: CoinBubbleInfo[];
  goldsBubble: GoldBubbleInfo[];
}

export const BubbleGaugeView: React.FC<BubbleGaugeViewProps> = ({
  summary,
  coinsBubble,
  goldsBubble,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>('imami');

  const toggleExpandCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const getRiskBadge = (percent: number) => {
    if (percent > 25) {
      return {
        label: 'پرریسک',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        icon: AlertTriangle,
        desc: 'حباب بیش از ۲۵٪؛ تقاضای کاذب زیاد است.',
      };
    } else if (percent > 12) {
      return {
        label: 'ریسک متوسط',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: ShieldAlert,
        desc: 'حباب متعادل بین ۱۲٪ تا ۲۵٪.',
      };
    } else {
      return {
        label: 'کم‌ریسک',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        icon: ShieldCheck,
        desc: 'حباب زیر ۱۲٪؛ ارزش به قیمت طلا نزدیک است.',
      };
    }
  };

  return (
    <div className="space-y-4 pb-24 dir-rtl text-slate-100 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">حباب‌سنج تخصصی ملیکا</h2>
              <p className="text-xs text-slate-400">محاسبه دقیق حباب انواع سکه و طلا</p>
            </div>
          </div>

          <button
            onClick={() => setShowFormulaModal(true)}
            className="text-xs text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            فرمول حباب؟
          </button>
        </div>

        {/* Calculation Input Parameters display */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">دلار مبنا:</span>
            <strong className="text-emerald-400 font-bold">{formatToman(summary.usdPrice)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">انس جهانی طلا:</span>
            <strong className="text-blue-300 font-mono font-bold">{formatUsd(summary.globalOunceGoldUsd)}</strong>
          </div>
        </div>
      </div>

      {/* Coins Bubble Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 px-1 flex items-center gap-2">
          <span>🪙</span>
          حباب انواع سکه‌های بهار آزادی
        </h3>

        <div className="space-y-3">
          {coinsBubble.map((coin) => {
            const risk = getRiskBadge(coin.bubblePercent);
            const RiskIcon = risk.icon;
            const isExpanded = expandedCardId === coin.id;

            return (
              <div
                key={coin.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-md transition-all hover:border-slate-700"
              >
                {/* Main Card Header */}
                <div
                  onClick={() => toggleExpandCard(coin.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/20 shrink-0">
                      🪙
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{coin.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.color} flex items-center gap-1`}>
                          <RiskIcon className="w-2.5 h-2.5" />
                          {risk.label}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-amber-300 mt-1">
                        قیمت بازار: {formatToman(coin.marketPriceToman)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-left">
                      <div className="text-xs font-black text-rose-400">
                        {formatToman(coin.bubbleToman)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-bold">
                        {toPersianDigits(coin.bubblePercent.toFixed(1))}% حباب
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 bg-slate-950/50 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 text-[10px]">ارزش ذاتی طلا (واقعی)</div>
                        <div className="text-xs font-bold text-emerald-400 mt-1">
                          {formatToman(coin.intrinsicValueToman)}
                        </div>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 text-[10px]">وزن و عیار استاندارد</div>
                        <div className="text-xs font-bold text-slate-200 mt-1">
                          {toPersianDigits(coin.weightGram)} گرم (عیار ۲۲)
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Intrinsic vs Bubble */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>سهم طلا: {toPersianDigits((100 - coin.bubblePercent).toFixed(1))}%</span>
                        <span>سهم حباب: {toPersianDigits(coin.bubblePercent.toFixed(1))}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${Math.max(10, 100 - coin.bubblePercent)}%` }}
                        />
                        <div
                          className="bg-rose-500 h-full"
                          style={{ width: `${Math.min(90, coin.bubblePercent)}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      💡 {risk.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gold Bubble Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-200 px-1 flex items-center gap-2">
          <span>🥇</span>
          حباب طلای ۱۸ و ۲۴ عیار
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goldsBubble.map((gold) => (
            <div
              key={gold.id}
              className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{gold.name}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                  عیار {toPersianDigits(gold.purityRatio * 24)}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-[10px] text-slate-400">قیمت بازار:</div>
                  <div className="text-xs font-bold text-amber-300">
                    {formatToman(gold.marketPriceToman)}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] text-slate-400">ارزش ذاتی:</div>
                  <div className="text-xs font-bold text-emerald-400">
                    {formatToman(gold.intrinsicValueToman)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">تفاوت / حباب:</span>
                <span
                  className={`font-bold ${
                    gold.bubbleToman > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {formatToman(gold.bubbleToman)} ({toPersianDigits(gold.bubblePercent.toFixed(1))}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Explanation Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                فرمول فرمول دقیق محاسبه حباب سکه
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-center text-amber-300 text-[11px]">
                ارزش ذاتی سکه = (قیمت انس طلا × نرخ دلار × وزن سکه × ۰.۹) ÷ ۳۱.۱۰۳۵
              </div>

              <p>
                <strong>چرا حباب تشکیل می‌شود؟</strong><br />
                حباب سکه اختلاف بین قیمت معامله شده در بازار ضرب سکه با ارزش طلای به کار رفته در آن است. علت اصلی حباب بالا، تقاضای بالای مردم برای سرمایه‌گذاری خرد و ضرب محدود بانک مرکزی است.
              </p>

              <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200 text-[11px]">
                💡 <strong>نکته ملیکا:</strong> ربع سکه معمولاً بالاترین درصد حباب را به دلیل نقدشوندگی بالا در بازار ایران دارد.
              </div>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-2xl transition-all"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
