import React, { useState } from 'react';
import { MarketPriceItem } from '../types';
import { formatToman, formatUsd, formatPercent } from '../utils/calculations';
import { Search, TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';

interface MarketRatesViewProps {
  prices: MarketPriceItem[];
}

export const MarketRatesView: React.FC<MarketRatesViewProps> = ({ prices }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'currency' | 'gold' | 'coin' | 'global'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'همه نمادها' },
    { id: 'currency', label: 'ارزها' },
    { id: 'gold', label: 'طلا و مثقال' },
    { id: 'coin', label: 'انواع سکه' },
    { id: 'global', label: 'بازار جهانی' },
  ];

  const filteredPrices = prices.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.includes(searchTerm) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 dir-rtl text-slate-100 animate-fadeIn">
      {/* Title & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">نرخ روز طلا، سکه و ارز</h2>
            <p className="text-xs text-slate-400">قیمت‌های لحظه‌ای بازار آزاد ایران و بازارهای جهانی</p>
          </div>
          <span className="text-[11px] text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            {prices.length} نماد فعال
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی دلار، یورو، سکه امامی، ۱۸ عیار..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredPrices.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800/80">
            نمادی با عبارت جستجو شده پیدا نشد.
          </div>
        ) : (
          filteredPrices.map((item) => {
            const isPositive = item.changePercent >= 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 hover:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-800 transition-all flex flex-col gap-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm border border-slate-700/60">
                      {item.category === 'currency' && '💵'}
                      {item.category === 'gold' && '🥇'}
                      {item.category === 'coin' && '🪙'}
                      {item.category === 'global' && '🌐'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {item.name}
                        <span className="text-[10px] font-mono text-slate-500 font-normal">
                          ({item.nameEn})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-black text-amber-300 tracking-tight">
                      {item.priceUsd !== undefined && item.priceUsd > 0
                        ? formatUsd(item.priceUsd)
                        : formatToman(item.priceToman, false)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.unit}</div>
                  </div>
                </div>

                {/* Sub-row: High / Low & Change percentage */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {item.changeToman !== 0 && `${formatToman(Math.abs(item.changeToman), false)} `}
                        ({formatPercent(item.changePercent)})
                      </span>
                    </span>
                  </div>

                  {item.highToman && item.lowToman ? (
                    <div className="text-slate-400 flex items-center gap-2">
                      <span>کف: {formatToman(item.lowToman, false)}</span>
                      <span className="text-slate-600">|</span>
                      <span>سقف: {formatToman(item.highToman, false)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
