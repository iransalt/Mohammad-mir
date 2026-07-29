import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_MARKET_PRICES, INITIAL_MARKET_SUMMARY } from './src/data/mockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Store active prices in memory
  let currentPrices = [...INITIAL_MARKET_PRICES];
  let currentSummary = { ...INITIAL_MARKET_SUMMARY };

  // Helper to initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // 1. GET /api/prices - Retrieve market prices and summary
  app.get('/api/prices', async (req, res) => {
    const isLiveRequested = req.query.live === 'true';

    if (isLiveRequested) {
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `لطفاً آخرین قیمت روز دلار آمریکا (بازار آزاد)، انس جهانی طلا، طلای ۱۸ عیار، و سکه تمام امامی در ایران به تومان را جستجو کن و به صورت یک ابجکت JSON تمیز با کلیدهای usd, ounce, gold18, coinImami برگردان. نمونه پاسخ: {"usd": 193500, "ounce": 2845.5, "gold18": 15080000, "coinImami": 170800000}`,
            config: {
              tools: [{ googleSearch: {} }],
              responseMimeType: 'application/json',
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            if (parsed.usd && parsed.gold18 && parsed.coinImami) {
              currentSummary.usdPrice = parsed.usd;
              currentSummary.globalOunceGoldUsd = parsed.ounce || currentSummary.globalOunceGoldUsd;
              currentSummary.gold18kPrice = parsed.gold18;
              currentSummary.imamiCoinPrice = parsed.coinImami;
              currentSummary.lastUpdatedTime = 'به‌روزرسانی زنده (پایش هوشمند)';

              // Update item list
              currentPrices = currentPrices.map((item) => {
                if (item.id === 'usd') return { ...item, priceToman: parsed.usd, lastUpdated: 'هم‌اکنون' };
                if (item.id === 'gold18k') return { ...item, priceToman: parsed.gold18, lastUpdated: 'هم‌اکنون' };
                if (item.id === 'imami') return { ...item, priceToman: parsed.coinImami, lastUpdated: 'هم‌اکنون' };
                if (item.id === 'ounce_gold' && parsed.ounce) return { ...item, priceUsd: parsed.ounce, lastUpdated: 'هم‌اکنون' };
                return item;
              });
            }
          }
        } catch (err) {
          console.error('Error fetching live rates via Gemini grounding:', err);
        }
      }
    }

    res.json({
      success: true,
      summary: currentSummary,
      prices: currentPrices,
    });
  });

  // 2. POST /api/prices/update - Update price item manually or by client simulation
  app.post('/api/prices/update', (req, res) => {
    const { prices, summary } = req.body;
    if (prices) currentPrices = prices;
    if (summary) currentSummary = { ...currentSummary, ...summary };
    res.json({ success: true, summary: currentSummary, prices: currentPrices });
  });

  // 3. POST /api/ai-analysis - Interactive Melika AI Analyst
  app.post('/api/ai-analysis', async (req, res) => {
    try {
      const { userPrompt, history = [] } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          reply: `سلام! من دستیار هوشمند **ملیکا** هستم.
ارزش دلار فعلی: ${currentSummary.usdPrice.toLocaleString('fa-IR')} تومان
قیمت طلای ۱۸ عیار: ${currentSummary.gold18kPrice.toLocaleString('fa-IR')} تومان
قیمت سکه امامی: ${currentSummary.imamiCoinPrice.toLocaleString('fa-IR')} تومان

پاسخ شما: در حال حاضر کلید API جمینای تنظیم نشده است، اما طبق محاسبات حباب‌سنج ملیکا، سکه‌های کوچک‌تر مانند ربع سکه بیشترین درصد حباب را در بازار دارند و طلای ۱۸ عیار یا شمش طلای ۲۴ عیار کمترین حباب را داراست.`,
        });
      }

      const systemInstruction = `شما "ملیکا"، دستیار تخصصی تحلیل بازار طلا، ارز و حباب سکه در ایران هستید.
لحن شما مؤدبانه، حرفه‌ای، صمیمی و کاملاً کارشناسانه است.
اطلاعات زنده بازار فعلی:
- قیمت دلار آمریکا: ${currentSummary.usdPrice.toLocaleString('fa-IR')} تومان
- قیمت انس جهانی طلا: $${currentSummary.globalOunceGoldUsd.toLocaleString('fa-IR')}
- قیمت گرم طلای ۱۸ عیار: ${currentSummary.gold18kPrice.toLocaleString('fa-IR')} تومان
- قیمت سکه تمام امامی: ${currentSummary.imamiCoinPrice.toLocaleString('fa-IR')} تومان

فرمول محاسبه حباب سکه در ایران:
ارزش ذاتی سکه = (قیمت انس جهانی × قیمت دلار × وزن سکه به گرم × عیار ۰.۹۰۰) تقسیم بر ۳۱.۱۰۳۵
حباب سکه = قیمت بازار - ارزش ذاتی

دستورالعمل‌ها:
۱. به سوالات کاربر دقیق، تحلیلی و همراه با اعداد و ارقام روشن پاسخ دهید.
۲. اگر کاربر درباره خرید طلا یا سکه پرسید، تفاوت حباب انواع سکه (امامی، نیم، ربع، گرمی) را با طلای آبشده یا ۱۸ عیار توضیح دهید.
۳. پاسخ‌ها را به صورت زیبا، با بولت‌پوینت‌های خوانا و قالب‌بندی مارک‌داون ارائه دهید.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        reply: response.text || 'پاسخی از دستیار دریافت نشد.',
      });
    } catch (error: any) {
      console.error('Error in AI analysis route:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'خطا در ارتباط با هوش مصنوعی ملیکا',
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', appName: 'Melika Gold & Currency Bubble' });
  });

  // Setup Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Melika App server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
