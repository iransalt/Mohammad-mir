import React, { useState } from 'react';
import { GoldInvoiceInput, MarketSummary } from '../types';
import {
  calculateGoldPurchaseInvoice,
  calculateCoinBubble,
  formatToman,
  formatUsd,
  toPersianDigits,
} from '../utils/calculations';
import { Calculator, Scale, FileText, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CalculatorViewProps {
  summary: MarketSummary;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ summary }) => {
  const [activeTab, setActiveTab] = useState<'invoice' | 'bubbleSim'>('invoice');

  // --- State for Gold Invoice Calculator ---
  const [invoiceInput, setInvoiceInput] = useState<GoldInvoiceInput>({
    weightGram: 5,
    gold18kPriceToman: summary.gold18kPrice || 7280000,
    wageType: 'percent',
    wageValue: 12, // 12% standard wage
    profitPercent: 7, // 7% union seller profit
    taxPercent: 9, // 9% tax on wage+profit
    stoneValueToman: 0,
  });

  const invoiceResult = calculateGoldPurchaseInvoice(invoiceInput);

  // --- State for Custom Bubble Simulator ---
  const [customUsd, setCustomUsd] = useState<number>(summary.usdPrice || 93500);
  const [customOunce, setCustomOunce] = useState<number>(summary.globalOunceGoldUsd || 2845.5);
  const [customCoinPrice, setCustomCoinPrice] = useState<number>(summary.imamiCoinPrice || 82500000);
  const [selectedCoinWeight, setSelectedCoinWeight] = useState<number>(8.135); // Default Imami coin weight

  // Compute simulated bubble
  const simBubble = calculateCoinBubble(
    'سکه سفارشی',
    customCoinPrice,
    selectedCoinWeight,
    0.900,
    customOunce,
    customUsd,
    'full',
    'sim'
  );

  return (
    <div className="space-y-4 pb-24 dir-rtl text-slate-100 animate-fadeIn">
      {/* Title & Mode Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">محاسبه‌گر ملیکا</h2>
            <p className="text-xs text-slate-400">فاکتور خرید طلا و شبیه‌ساز اختصاصی حباب</p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invoice'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            محاسبه فاکتور طلا
          </button>

          <button
            onClick={() => setActiveTab('bubbleSim')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bubbleSim'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            شبیه‌ساز حباب دلخواه
          </button>
        </div>
      </div>

      {/* Mode 1: Gold Invoice Calculator */}
      {activeTab === 'invoice' ? (
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>📝</span>
              مشخصات قطعه طلا
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Gold Weight Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">وزن طلا (گرم):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={invoiceInput.weightGram}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      weightGram: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Gold 18K Price Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">قیمت گرم ۱۸ عیار (تومان):</label>
                <input
                  type="number"
                  step="1000"
                  value={invoiceInput.gold18kPriceToman}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      gold18kPriceToman: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Wage Value & Type */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <label className="font-medium">اجرت ساخت:</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setInvoiceInput({ ...invoiceInput, wageType: 'percent' })}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border ${
                        invoiceInput.wageType === 'percent'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      درصدی (٪)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvoiceInput({ ...invoiceInput, wageType: 'toman' })}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border ${
                        invoiceInput.wageType === 'toman'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      تومانی
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={invoiceInput.wageValue}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      wageValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Seller Profit Percent */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">سود فروشنده (استاندارد ۷٪):</label>
                <input
                  type="number"
                  step="0.5"
                  value={invoiceInput.profitPercent}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      profitPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* VAT Tax Percent */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">مالیات ارزش افزوده (قانون جدید ۹٪):</label>
                <input
                  type="number"
                  step="0.5"
                  value={invoiceInput.taxPercent}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      taxPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Stone Value */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">ارزش نگین / سنگ (تومان):</label>
                <input
                  type="number"
                  step="10000"
                  value={invoiceInput.stoneValueToman}
                  onChange={(e) =>
                    setInvoiceInput({
                      ...invoiceInput,
                      stoneValueToman: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Invoice Result Breakdown Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-4 rounded-3xl border border-amber-500/30 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                ریز فاکتور نهایی خرید طلا
              </span>
              <span className="text-[10px] text-slate-400 font-mono">قانون اتحادیه طلا</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>طلا خام ({toPersianDigits(invoiceInput.weightGram)} گرم):</span>
                <strong className="text-slate-100">{formatToman(invoiceResult.rawGoldValue)}</strong>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>مجموع اجرت ساخت:</span>
                <strong className="text-amber-300">{formatToman(invoiceResult.totalWage)}</strong>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>سود فروشنده ({toPersianDigits(invoiceInput.profitPercent)}٪):</span>
                <strong className="text-slate-100">{formatToman(invoiceResult.sellerProfit)}</strong>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>مالیات ۹٪ (بر اجرت + سود):</span>
                <strong className="text-slate-100">{formatToman(invoiceResult.vatTax)}</strong>
              </div>

              {invoiceResult.stoneValue > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>قیمت سنگ/نگین:</span>
                  <strong className="text-slate-100">{formatToman(invoiceResult.stoneValue)}</strong>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">مبلغ قابل پرداخت فاکتور:</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    (هر گرم تمام شده: {formatToman(invoiceResult.perGramCostEffective)})
                  </div>
                </div>
                <div className="text-lg font-black text-amber-400">
                  {formatToman(invoiceResult.finalTotalToman)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Custom Coin Bubble Simulator */
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>⚙️</span>
              تنظیم پارامترهای دلخواه شبیه‌ساز
            </h3>

            <div className="space-y-3 text-xs">
              {/* Dollar Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>نرخ دلار فرضی (تومان):</span>
                  <span className="text-emerald-400 font-bold">{formatToman(customUsd)}</span>
                </div>
                <input
                  type="number"
                  step="500"
                  value={customUsd}
                  onChange={(e) => setCustomUsd(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Global Ounce */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>انس جهانی طلا (دلار):</span>
                  <span className="text-blue-300 font-bold font-mono">{formatUsd(customOunce)}</span>
                </div>
                <input
                  type="number"
                  step="5"
                  value={customOunce}
                  onChange={(e) => setCustomOunce(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Coin Market Price */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>قیمت بازار سکه فرضی (تومان):</span>
                  <span className="text-yellow-400 font-bold">{formatToman(customCoinPrice)}</span>
                </div>
                <input
                  type="number"
                  step="100000"
                  value={customCoinPrice}
                  onChange={(e) => setCustomCoinPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Coin Weight Selector */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">نوع سکه (وزن استاندارد):</label>
                <select
                  value={selectedCoinWeight}
                  onChange={(e) => setSelectedCoinWeight(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value={8.135}>سکه تمام امامی / بهار آزادی (۸٫۱۳۵ گرم)</option>
                  <option value={4.0675}>نیم سکه (۴٫۰۶۷۵ گرم)</option>
                  <option value={2.03375}>ربع سکه (۲٫۰۳۳۷۵ گرم)</option>
                  <option value={1.01}>سکه گرمی (۱٫۰۱ گرم)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="bg-slate-900 p-4 rounded-3xl border border-amber-500/30 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Scale className="w-4 h-4" />
                نتیجه شبیه‌سازی حباب
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">عیار ۲۲ (۹۰۰)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">ارزش ذاتی واقعی طلا:</div>
                <div className="text-xs font-black text-emerald-400 mt-1">
                  {formatToman(simBubble.intrinsicValueToman)}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">مبلغ حباب بازار:</div>
                <div className="text-xs font-black text-rose-400 mt-1">
                  {formatToman(simBubble.bubbleToman)}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
              <span className="text-amber-200">درصد حباب شبیه‌سازی شده:</span>
              <span className="text-base font-black text-amber-400">
                {toPersianDigits(simBubble.bubblePercent.toFixed(1))}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
