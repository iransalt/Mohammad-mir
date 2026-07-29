import React, { useState, useMemo } from 'react';
import { TrendDataPoint } from '../types';
import { formatToman, formatUsd, toPersianDigits } from '../utils/calculations';
import { MOCK_TREND_WEEKLY, MOCK_TREND_MONTHLY, MOCK_TREND_YEARLY } from '../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Coins,
  DollarSign,
  Flame,
  Award,
  Maximize2,
} from 'lucide-react';

type TimeframeType = 'weekly' | 'monthly' | 'yearly';
type MetricType = 'gold18k' | 'imamiCoin' | 'usd' | 'globalOunce' | 'bubblePercent';

interface TrendsViewProps {
  trendData?: TrendDataPoint[];
}

export const TrendsView: React.FC<TrendsViewProps> = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('weekly');
  const [metric, setMetric] = useState<MetricType>('gold18k');

  // Select appropriate dataset based on timeframe
  const activeDataset: TrendDataPoint[] = useMemo(() => {
    switch (timeframe) {
      case 'weekly':
        return MOCK_TREND_WEEKLY;
      case 'monthly':
        return MOCK_TREND_MONTHLY;
      case 'yearly':
        return MOCK_TREND_YEARLY;
      default:
        return MOCK_TREND_WEEKLY;
    }
  }, [timeframe]);

  // Metric configurations & styling
  const metricConfigs: Record<
    MetricType,
    {
      label: string;
      shortLabel: string;
      unit: string;
      color: string;
      category: 'iran' | 'global';
      icon: React.ReactNode;
      formatter: (v: number) => string;
    }
  > = {
    gold18k: {
      label: 'طلای ۱۸ عیار (ایران)',
      shortLabel: 'طلا ۱۸ عیار',
      unit: 'تومان / گرم',
      color: '#f59e0b',
      category: 'iran',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      formatter: (v: number) => formatToman(v, false),
    },
    imamiCoin: {
      label: 'سکه تمام امامی (ایران)',
      shortLabel: 'سکه امامی',
      unit: 'تومان',
      color: '#eab308',
      category: 'iran',
      icon: <Coins className="w-4 h-4 text-yellow-400" />,
      formatter: (v: number) => formatToman(v, false),
    },
    usd: {
      label: 'دلار آزاد (ایران)',
      shortLabel: 'دلار آزاد',
      unit: 'تومان',
      color: '#10b981',
      category: 'iran',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      formatter: (v: number) => formatToman(v, false),
    },
    globalOunce: {
      label: 'انس جهانی طلا (جهانی)',
      shortLabel: 'انس طلا',
      unit: 'دلار / انس',
      color: '#3b82f6',
      category: 'global',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      formatter: (v: number) => formatUsd(v),
    },
    bubblePercent: {
      label: 'درصد حباب سکه امامی',
      shortLabel: 'حباب سکه',
      unit: 'درصد (٪)',
      color: '#f43f5e',
      category: 'iran',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      formatter: (v: number) => `%${toPersianDigits(v.toFixed(1))}`,
    },
  };

  const activeConfig = metricConfigs[metric];

  // Calculate statistics (Min, Max, Avg, Growth Rate)
  const stats = useMemo(() => {
    if (!activeDataset || activeDataset.length === 0) {
      return { min: 0, max: 0, avg: 0, growth: 0, isPositive: true };
    }

    const values = activeDataset.map((d) => d[metric]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    const startVal = values[0];
    const endVal = values[values.length - 1];
    const growth = startVal ? ((endVal - startVal) / startVal) * 100 : 0;

    return {
      min,
      max,
      avg,
      growth,
      isPositive: growth >= 0,
    };
  }, [activeDataset, metric]);

  const timeframeLabels: Record<TimeframeType, { label: string; subtext: string }> = {
    weekly: { label: 'هفتگی', subtext: '۷ روز اخیر' },
    monthly: { label: 'ماهانه', subtext: '۳۰ روز اخیر' },
    yearly: { label: 'سالانه', subtext: '۱۲ ماه گذشته' },
  };

  return (
    <div className="space-y-4 pb-24 dir-rtl text-slate-100 animate-fadeIn">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>تحلیل و نمودارهای تاریخی</span>
          </h2>
          <p className="text-xs text-slate-400">
            روند روزانه طلا، سکه، دلار و انس جهانی در ایران و بین‌الملل
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-md">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Timeframe Selector Bar */}
      <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-1 text-xs">
        {(['weekly', 'monthly', 'yearly'] as TimeframeType[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-2 px-3 rounded-xl font-black transition-all text-center flex items-center justify-center gap-1.5 ${
              timeframe === tf
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{timeframeLabels[tf].label}</span>
          </button>
        ))}
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {(Object.keys(metricConfigs) as MetricType[]).map((mKey) => {
          const cfg = metricConfigs[mKey];
          const isSelected = metric === mKey;
          return (
            <button
              key={mKey}
              onClick={() => setMetric(mKey)}
              className={`py-2 px-3 rounded-2xl font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-slate-800 border-amber-500/60 text-amber-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cfg.icon}
              <span>{cfg.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Stats Bar (Max, Min, Avg, Growth) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400">سقف دوره ({timeframeLabels[timeframe].label})</div>
          <div className="text-xs font-black text-emerald-400">
            {activeConfig.formatter(stats.max)}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400">کف دوره ({timeframeLabels[timeframe].label})</div>
          <div className="text-xs font-black text-rose-400">
            {activeConfig.formatter(stats.min)}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400">میانگین دوره</div>
          <div className="text-xs font-black text-amber-300">
            {activeConfig.formatter(stats.avg)}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400">تغییر کل دوره</div>
          <div
            className={`text-xs font-black flex items-center gap-0.5 dir-ltr justify-end ${
              stats.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {stats.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>%{toPersianDigits(Math.abs(stats.growth).toFixed(1))}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-slate-800">{activeConfig.icon}</div>
            <div>
              <h3 className="text-xs font-black text-white">نمودار {activeConfig.label}</h3>
              <p className="text-[10px] text-slate-400">
                بازه {timeframeLabels[timeframe].subtext}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-xl border border-slate-700 font-mono">
            واحد: {activeConfig.unit}
          </span>
        </div>

        {/* Recharts Canvas */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeDataset}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="dateJalali" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 10 }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => {
                  if (metric === 'bubblePercent') return `%${val}`;
                  if (metric === 'globalOunce') return `$${val}`;
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  return `${(val / 1000).toFixed(0)}k`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as TrendDataPoint;
                    const val = dataPoint[metric];
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 dir-rtl min-w-[170px]">
                        <div className="text-slate-400 text-[10px] flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>تاریخ: {dataPoint.dateJalali}</span>
                          </span>
                          <span className="font-mono text-[9px]">{dataPoint.date}</span>
                        </div>
                        <div className="font-black text-amber-300 pt-0.5">
                          {activeConfig.shortLabel}: {activeConfig.formatter(val)}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <div>دلار: {formatToman(dataPoint.usd, false)}</div>
                          <div>طلا ۱۸: {formatToman(dataPoint.gold18k, false)}</div>
                          <div>سکه: {formatToman(dataPoint.imamiCoin, false)}</div>
                          <div>انس: {formatUsd(dataPoint.globalOunce)}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={activeConfig.color}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Data Detail Table */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>جدول تاریخچه قیمت‌ها ({timeframeLabels[timeframe].label})</span>
          </h3>
          <span className="text-[10px] text-slate-400">
            {activeDataset.length} رکورد ثبت‌شده
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="space-y-1 text-xs min-w-[340px]">
            <div className="grid grid-cols-5 text-slate-400 text-[10px] pb-1 font-bold border-b border-slate-800/80 text-center">
              <span className="text-right">تاریخ</span>
              <span>دلار</span>
              <span>طلا ۱۸</span>
              <span>سکه امامی</span>
              <span className="text-left">انس جهانی</span>
            </div>

            {activeDataset.map((dp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 text-slate-300 py-2 border-b border-slate-800/40 text-[11px] items-center text-center hover:bg-slate-800/30 transition-colors rounded-lg px-0.5"
              >
                <span className="font-bold text-slate-200 text-right">{dp.dateJalali}</span>
                <span className="text-emerald-400 font-mono">{formatToman(dp.usd, false)}</span>
                <span className="text-amber-300 font-mono">{formatToman(dp.gold18k, false)}</span>
                <span className="font-bold text-yellow-400 font-mono">{formatToman(dp.imamiCoin, false)}</span>
                <span className="text-left font-mono text-blue-400">{formatUsd(dp.globalOunce)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
