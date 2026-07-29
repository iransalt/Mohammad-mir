import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MarketRatesView } from './components/MarketRatesView';
import { BubbleGaugeView } from './components/BubbleGaugeView';
import { CalculatorView } from './components/CalculatorView';
import { AiAnalystView } from './components/AiAnalystView';
import { TrendsView } from './components/TrendsView';
import { MarketPriceItem, MarketSummary, CoinBubbleInfo, GoldBubbleInfo } from './types';
import { INITIAL_MARKET_PRICES, INITIAL_MARKET_SUMMARY, MOCK_TREND_DATA } from './data/mockData';
import { calculateCoinBubble, calculateGoldBubble } from './utils/calculations';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [prices, setPrices] = useState<MarketPriceItem[]>(INITIAL_MARKET_PRICES);
  const [summary, setSummary] = useState<MarketSummary>(INITIAL_MARKET_SUMMARY);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch prices from server
  const fetchPrices = async (isLive = false) => {
    setIsLoading(true);
    try {
      const url = isLive ? '/api/prices?live=true' : '/api/prices';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        if (data.prices) setPrices(data.prices);
        if (data.summary) setSummary(data.summary);
        showToast(isLive ? 'قیمت‌های زنده با موفقیت به‌روزرسانی شدند' : 'اطلاعات بازار به‌روزرسانی شد');
      }
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      showToast('خطا در دریافت اطلاعات؛ از داده‌های پشتیبان استفاده شد');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Derive Dollar Rate and Global Ounce Gold
  const usdPrice = useMemo(() => {
    const usdItem = prices.find((p) => p.id === 'usd');
    return usdItem ? usdItem.priceToman : summary.usdPrice;
  }, [prices, summary]);

  const globalOunceUsd = useMemo(() => {
    const ounceItem = prices.find((p) => p.id === 'ounce_gold');
    return ounceItem && ounceItem.priceUsd ? ounceItem.priceUsd : summary.globalOunceGoldUsd;
  }, [prices, summary]);

  // Compute live Coin Bubble List
  const coinsBubble: CoinBubbleInfo[] = useMemo(() => {
    const coinItems = [
      { id: 'imami', name: 'سکه تمام امامی (طرح جدید)', weight: 8.135, icon: 'full' as const },
      { id: 'bahar', name: 'سکه بهار آزادی (طرح قدیم)', weight: 8.135, icon: 'bahar' as const },
      { id: 'half_coin', name: 'نیم سکه بهار آزادی', weight: 4.0675, icon: 'half' as const },
      { id: 'quarter_coin', name: 'ربع سکه بهار آزادی', weight: 2.03375, icon: 'quarter' as const },
      { id: 'gram_coin', name: 'سکه گرمی بانکی', weight: 1.01, icon: 'gram' as const },
    ];

    return coinItems.map((item) => {
      const priceObj = prices.find((p) => p.id === item.id);
      const marketPrice = priceObj ? priceObj.priceToman : 0;
      return calculateCoinBubble(
        item.name,
        marketPrice,
        item.weight,
        0.900, // 22K Purity for Azadi coins
        globalOunceUsd,
        usdPrice,
        item.icon,
        item.id
      );
    });
  }, [prices, usdPrice, globalOunceUsd]);

  // Compute live Gold Bubble List
  const goldsBubble: GoldBubbleInfo[] = useMemo(() => {
    const gold18Item = prices.find((p) => p.id === 'gold18k');
    const gold24Item = prices.find((p) => p.id === 'gold24k');

    return [
      calculateGoldBubble(
        'طلای ۱۸ عیار (هر گرم)',
        gold18Item ? gold18Item.priceToman : summary.gold18kPrice,
        0.750,
        globalOunceUsd,
        usdPrice,
        'gold18'
      ),
      calculateGoldBubble(
        'طلای ۲۴ عیار (هر گرم)',
        gold24Item ? gold24Item.priceToman : summary.gold18kPrice * 1.333,
        1.000,
        globalOunceUsd,
        usdPrice,
        'gold24'
      ),
    ];
  }, [prices, usdPrice, globalOunceUsd, summary]);

  // Keep Summary Imami Coin Bubble updated in state
  const imamiBubbleObj = coinsBubble.find((c) => c.id === 'imami');
  const activeSummary: MarketSummary = {
    ...summary,
    usdPrice,
    globalOunceGoldUsd: globalOunceUsd,
    imamiCoinBubble: imamiBubbleObj ? imamiBubbleObj.bubbleToman : summary.imamiCoinBubble,
    imamiCoinBubblePercent: imamiBubbleObj ? imamiBubbleObj.bubblePercent : summary.imamiCoinBubblePercent,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl animate-bounce border border-amber-300 dir-rtl">
          {toastMessage}
        </div>
      )}

      {/* Main App Container (Mobile viewport centered max-w-md) */}
      <div className="max-w-md mx-auto min-h-screen bg-slate-950 flex flex-col relative border-x border-slate-900 shadow-2xl">
        {/* Header */}
        <Header
          onRefresh={() => fetchPrices(true)}
          isLoading={isLoading}
          lastUpdated={activeSummary.lastUpdatedTime}
          usdPrice={usdPrice}
          imamiPrice={activeSummary.imamiCoinPrice}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView
              summary={activeSummary}
              coinsBubble={coinsBubble}
              prices={prices}
              setActiveTab={setActiveTab}
              onRefresh={() => fetchPrices(true)}
            />
          )}

          {activeTab === 'rates' && <MarketRatesView prices={prices} />}

          {activeTab === 'bubble' && (
            <BubbleGaugeView
              summary={activeSummary}
              coinsBubble={coinsBubble}
              goldsBubble={goldsBubble}
            />
          )}

          {activeTab === 'calculator' && <CalculatorView summary={activeSummary} />}

          {activeTab === 'ai' && (
            <AiAnalystView
              summary={activeSummary}
              trendData={MOCK_TREND_DATA}
              coinsBubble={coinsBubble}
            />
          )}

          {activeTab === 'trends' && <TrendsView trendData={MOCK_TREND_DATA} />}
        </main>

        {/* Android Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
