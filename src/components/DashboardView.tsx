import React from 'react';
import { MarketSummary, CoinBubbleInfo, MarketPriceItem } from '../types';
import { formatToman, formatUsd, formatPercent, toPersianDigits } from '../utils/calculations';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Coins,
  ChevronLeft,
  Info,
  DollarSign,
  Calculator,
  Bot
} from 'lucide-react';
import { TabType } from './BottomNav';

interface DashboardViewProps {
  summary: MarketSummary;
  coinsBubble: CoinBubbleInfo[];
  prices: MarketPriceItem[];
  setActiveTab: (tab: TabType) => void;
  onRefresh: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  coinsBubble,
  prices,
  setActiveTab,
}) => {
  const usdItem = prices.find((p) => p.id === 'usd');
  const gold18Item = prices.find((p) => p.id === 'gold18k');
  const imamiItem = prices.find((p) => p.id === 'imami');
  const ounceItem = prices.find((p) => p.id === 'ounce_gold');

  // Overall Market Risk Level based on Imami coin bubble percent
  const getMarketRiskBadge = (percent: number) => {
    if (percent > 25) {
      return {
        label: 'حباب بالا (پرریسک)',
        bgColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        barColor: 'bg-rose-500',
        desc: 'تقاضا هیجانی در بازار سکه؛ خرید با ریسک همراه است.',
      };
    } else if (percent > 12) {
      return {
        label: 'حباب متوسط (ریسک معمولی)',
        bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        barColor: 'bg-amber-500',
        desc: 'حباب سکه متناسب با نوسانات دلار است.',
      };
    } else {
      return {
        label: 'حباب پایین (کم‌ریسک)',
        bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        barColor: 'bg-emerald-500',
        desc: 'فرصت مناسب برای خرید؛ حباب نزدیک به ارزش ذاتی است.',
      };
    }
  };

  const riskInfo = getMarketRiskBadge(summary.imamiCoinBubblePercent);

  return (
    <div className="space-y-5 pb-24 dir-rtl text-slate-100 animate-fadeIn">
      {/* Top Banner & Quick Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-4 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -left-6 -top-6 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3" /> پایش هوشمند بازار ایران
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              سامانه ملیکا
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
              محاسبه لحظه‌ای ارزش ذاتی دلار، طلای ۱۸ عیار و درجه حباب تمام سکه‌ها
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs px-3 py-2 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Bot className="w-4 h-4" />
            تحلیل ملیکا
          </button>
        </div>
      </div>

      {/* Primary Price Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* USD Card */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">دلار آزاد</span>
            </div>
            {usdItem && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  usdItem.changePercent >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(usdItem.changePercent)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-lg font-black text-white tracking-tight">
              {formatToman(summary.usdPrice, false)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">تومان</div>
          </div>
        </div>

        {/* 18K Gold Card */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">طلای ۱۸ عیار</span>
            </div>
            {gold18Item && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  gold18Item.changePercent >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(gold18Item.changePercent)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-lg font-black text-amber-300 tracking-tight">
              {formatToman(summary.gold18kPrice, false)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">تومان / گرم</div>
          </div>
        </div>

        {/* Imami Coin Card */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-xs border border-yellow-500/20">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">سکه امامی</span>
            </div>
            {imamiItem && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  imamiItem.changePercent >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(imamiItem.changePercent)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-lg font-black text-yellow-400 tracking-tight">
              {formatToman(summary.imamiCoinPrice, false)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">تومان</div>
          </div>
        </div>

        {/* Global Ounce Card */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                🌐
              </div>
              <span className="text-xs font-bold text-slate-200">انس جهانی</span>
            </div>
            {ounceItem && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  ounceItem.changePercent >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(ounceItem.changePercent)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-lg font-black text-blue-300 tracking-tight font-mono">
              {formatUsd(summary.globalOunceGoldUsd)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">دلار / انس</div>
          </div>
        </div>
      </div>

      {/* Market Bubble Gauge Meter Section */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">شاخص حباب کل سکه (امامی)</h3>
              <p className="text-[10px] text-slate-400">تفاوت قیمت بازار با ارزش واقعی طلا</p>
            </div>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${riskInfo.bgColor}`}>
            {riskInfo.label}
          </span>
        </div>

        {/* Visual Gauge Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">ارزش ذاتی طلا: <strong className="text-slate-200">{formatToman(summary.imamiCoinPrice - summary.imamiCoinBubble)}</strong></span>
            <span className="text-amber-400 font-bold">مبلغ حباب: {formatToman(summary.imamiCoinBubble)} ({toPersianDigits(summary.imamiCoinBubblePercent.toFixed(1))}%)</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${riskInfo.barColor}`}
              style={{ width: `${Math.min(summary.imamiCoinBubblePercent * 2, 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-xl border border-slate-800/80 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{riskInfo.desc}</span>
          </p>
        </div>
      </div>

      {/* Coins Bubble Quick Comparison List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            مقایسه حباب انواع سکه‌ها
          </h3>
          <button
            onClick={() => setActiveTab('bubble')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
          >
            مشاهده کامل
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {coinsBubble.slice(0, 4).map((coin) => (
            <div
              key={coin.id}
              onClick={() => setActiveTab('bubble')}
              className="bg-slate-900/80 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                  🪙
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{coin.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ارزش ذاتی: {formatToman(coin.intrinsicValueToman)}
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs font-bold text-amber-300">
                  {formatToman(coin.marketPriceToman)}
                </div>
                <div className="text-[10px] font-medium text-rose-400 mt-0.5">
                  حباب: {formatToman(coin.bubbleToman)} ({toPersianDigits(coin.bubblePercent.toFixed(1))}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Utility Shortcuts */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className="bg-slate-900/90 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 text-right active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">محاسبه‌گر فاکتور طلا</div>
            <div className="text-[10px] text-slate-400 mt-0.5">اجرت، سود ۷٪ و مالیات</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className="bg-slate-900/90 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 text-right active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">مشاور ملیکا</div>
            <div className="text-[10px] text-slate-400 mt-0.5">تحلیل هوش مصنوعی بازار</div>
          </div>
        </button>
      </div>
    </div>
  );
};
