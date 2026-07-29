import React from 'react';
import { RefreshCw, Coins, Activity, Sparkles, Smartphone } from 'lucide-react';
import { getJalaliDateString, getCurrentPersianTime } from '../utils/calculations';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: string;
  usdPrice: number;
  imamiPrice: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  lastUpdated,
  usdPrice,
  imamiPrice,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Android Top App Bar Container */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 border border-amber-300/30">
            <Coins className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-amber-400 tracking-tight">ملیکا</h1>
              <span className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Smartphone className="w-2.5 h-2.5" /> نسخه اندروید
              </span>
            </div>
            <p className="text-[11px] text-slate-400">حباب‌سنج و محاسبه‌گر زنده طلا و ارز</p>
          </div>
        </div>

        {/* Right side: Live status & Refresh button */}
        <div className="flex items-center gap-2">
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-400">بازار آنلاین</span>
            </div>
            <p className="text-[10px] text-slate-400">{getCurrentPersianTime()} - {getJalaliDateString().split(' ')[0]}</p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all duration-200 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-amber-400"
            title="به‌روزرسانی قیمت‌ها"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ticker Sub-bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/60 py-1.5 px-4 overflow-x-auto text-[11px] text-slate-300 no-scrollbar">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4 font-mono dir-rtl">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-slate-400">دلار:</span>
            <span className="font-bold text-emerald-400">
              {usdPrice ? usdPrice.toLocaleString('fa-IR') : '۹۳,۵۰۰'}
            </span>
            <span className="text-[9px] text-slate-500">تومان</span>
          </div>

          <div className="w-px h-3 bg-slate-800 shrink-0" />

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-slate-400">سکه امامی:</span>
            <span className="font-bold text-amber-300">
              {imamiPrice ? (imamiPrice / 1000000).toFixed(1).replace('.', '/') : '۸۲/۵'}
            </span>
            <span className="text-[9px] text-slate-500">ملیون تومان</span>
          </div>

          <div className="w-px h-3 bg-slate-800 shrink-0" />

          <div className="flex items-center gap-1 shrink-0 text-slate-400 text-[10px]">
            <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{lastUpdated || 'به‌روز'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
