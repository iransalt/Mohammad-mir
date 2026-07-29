import { CoinBubbleInfo, GoldBubbleInfo, GoldInvoiceInput, GoldInvoiceResult } from '../types';

export const OUNCE_GRAM_CONVERSION = 31.1034768; // 1 Troy Ounce in Grams

// Persian digit mapping
export function toPersianDigits(num: number | string): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

// Format currency in Tomans
export function formatToman(amount: number, includeUnit = true): string {
  const rounded = Math.round(amount);
  const formattedStr = rounded.toLocaleString('en-US');
  const persianStr = toPersianDigits(formattedStr);
  return includeUnit ? `${persianStr} تومان` : persianStr;
}

// Format USD currency
export function formatUsd(amount: number): string {
  const formattedStr = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${toPersianDigits(formattedStr)}`;
}

// Format Percentage
export function formatPercent(value: number): string {
  const formatted = Math.abs(value).toFixed(1);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}%${toPersianDigits(formatted)}`;
}

/**
 * Calculates Coin Intrinsic Value & Market Bubble
 */
export function calculateCoinBubble(
  coinName: string,
  marketPriceToman: number,
  weightGram: number,
  purity: number, // e.g. 0.900
  globalOunceUsd: number,
  usdRateToman: number,
  iconType: CoinBubbleInfo['iconType'],
  id: string
): CoinBubbleInfo {
  // Intrinsic Value = (Global Ounce * USD Rate * Weight * Purity) / 31.1035
  const intrinsicValueToman = Math.round(
    (globalOunceUsd * usdRateToman * weightGram * purity) / OUNCE_GRAM_CONVERSION
  );

  const bubbleToman = marketPriceToman - intrinsicValueToman;
  const bubblePercent = (bubbleToman / intrinsicValueToman) * 100;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (bubblePercent > 20) {
    riskLevel = 'high';
  } else if (bubblePercent > 10) {
    riskLevel = 'medium';
  }

  return {
    id,
    name: coinName,
    marketPriceToman,
    weightGram,
    purity,
    intrinsicValueToman,
    bubbleToman,
    bubblePercent,
    riskLevel,
    iconType,
  };
}

/**
 * Calculates 18K / 24K Gold Intrinsic Value & Market Bubble
 */
export function calculateGoldBubble(
  goldName: string,
  marketPriceToman: number,
  purityRatio: number, // 0.750 for 18k, 1.000 for 24k
  globalOunceUsd: number,
  usdRateToman: number,
  id: string
): GoldBubbleInfo {
  const intrinsicValueToman = Math.round(
    (globalOunceUsd * usdRateToman * purityRatio) / OUNCE_GRAM_CONVERSION
  );

  const bubbleToman = marketPriceToman - intrinsicValueToman;
  const bubblePercent = (bubbleToman / intrinsicValueToman) * 100;

  return {
    id,
    name: goldName,
    marketPriceToman,
    purityRatio,
    intrinsicValueToman,
    bubbleToman,
    bubblePercent,
  };
}

/**
 * Gold Invoice / Purchase Cost Calculator
 * Based on Iranian standard gold taxation law:
 * Tax = 9% of (Wage + Seller Profit)
 * Profit = 7% of (Raw Gold + Wage)
 */
export function calculateGoldPurchaseInvoice(input: GoldInvoiceInput): GoldInvoiceResult {
  const {
    weightGram,
    gold18kPriceToman,
    wageType,
    wageValue,
    profitPercent = 7,
    taxPercent = 9,
    stoneValueToman = 0,
  } = input;

  const rawGoldValue = Math.round(weightGram * gold18kPriceToman);

  let totalWage = 0;
  if (wageType === 'percent') {
    totalWage = Math.round(rawGoldValue * (wageValue / 100));
  } else {
    totalWage = Math.round(weightGram * wageValue);
  }

  const subtotalBeforeTaxProfit = rawGoldValue + totalWage;
  const sellerProfit = Math.round(subtotalBeforeTaxProfit * (profitPercent / 100));
  
  // Tax applies to (Wage + Profit) according to Iranian gold union rules
  const vatTax = Math.round((totalWage + sellerProfit) * (taxPercent / 100));

  const finalTotalToman = rawGoldValue + totalWage + sellerProfit + vatTax + stoneValueToman;
  const perGramCostEffective = weightGram > 0 ? Math.round(finalTotalToman / weightGram) : 0;

  return {
    rawGoldValue,
    totalWage,
    subtotalBeforeTaxProfit,
    sellerProfit,
    vatTax,
    stoneValue: stoneValueToman,
    finalTotalToman,
    perGramCostEffective,
  };
}

// Current Persian/Jalali date mock formatter
export function getJalaliDateString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    calendar: 'persian',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  try {
    return new Intl.DateTimeFormat('fa-IR', options).format(now);
  } catch {
    return 'امروز - بازار آنلاین';
  }
}

export function getCurrentPersianTime(): string {
  const now = new Date();
  const hours = toPersianDigits(now.getHours().toString().padStart(2, '0'));
  const minutes = toPersianDigits(now.getMinutes().toString().padStart(2, '0'));
  return `${hours}:${minutes}`;
}
