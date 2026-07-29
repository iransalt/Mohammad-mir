export interface MarketPriceItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'currency' | 'gold' | 'coin' | 'global';
  priceToman: number;
  priceUsd?: number;
  unit: string;
  changeToman: number;
  changePercent: number;
  highToman?: number;
  lowToman?: number;
  lastUpdated: string;
}

export interface CoinBubbleInfo {
  id: string;
  name: string;
  marketPriceToman: number;
  weightGram: number;
  purity: number; // e.g. 0.900 for 22k azadi coins
  intrinsicValueToman: number;
  bubbleToman: number;
  bubblePercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  iconType: 'full' | 'half' | 'quarter' | 'gram' | 'bahar';
}

export interface GoldBubbleInfo {
  id: string;
  name: string;
  marketPriceToman: number;
  purityRatio: number; // 0.750 for 18k, 1.000 for 24k
  intrinsicValueToman: number;
  bubbleToman: number;
  bubblePercent: number;
}

export interface GoldInvoiceInput {
  weightGram: number;
  gold18kPriceToman: number;
  wageType: 'percent' | 'toman';
  wageValue: number; // percentage or fixed toman per gram
  profitPercent: number; // usually 7%
  taxPercent: number; // usually 9%
  stoneValueToman?: number; // ارزش سنگ یا نگین
}

export interface GoldInvoiceResult {
  rawGoldValue: number;
  totalWage: number;
  subtotalBeforeTaxProfit: number;
  sellerProfit: number;
  vatTax: number;
  stoneValue: number;
  finalTotalToman: number;
  perGramCostEffective: number;
}

export interface MarketSummary {
  usdPrice: number;
  globalOunceGoldUsd: number;
  gold18kPrice: number;
  imamiCoinPrice: number;
  imamiCoinBubble: number;
  imamiCoinBubblePercent: number;
  marketSentiment: 'صعودی' | 'نزولی' | 'باثبات' | 'پرنوسان';
  lastUpdatedTime: string;
}

export interface TrendDataPoint {
  date: string;
  dateJalali: string;
  usd: number;
  gold18k: number;
  imamiCoin: number;
  globalOunce: number;
  bubblePercent: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'melika';
  text: string;
  timestamp: string;
  groundingSources?: { title: string; url: string }[];
}
