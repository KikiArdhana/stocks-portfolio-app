const API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

// ========================================
// MARKET INDEXES (REALTIME)
// ========================================

export async function getMarketIndexes() {
  try {
    const indexes = [
      {
        symbol: "SPY",
        name: "S&P 500",
      },

      {
        symbol: "QQQ",
        name: "Nasdaq",
      },

      {
        symbol: "DIA",
        name: "Dow",
      },

      {
        symbol: "IWM",
        name: "Russell",
      },
    ];

    const results =
      await Promise.all(
        indexes.map(
          async (index) => {
            const res =
              await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${index.symbol}&token=${API_KEY}`,
                {
                  cache:
                    "no-store",
                }
              );

            const data =
              await res.json();

            return {
              ...index,

              price:
                data.c || 0,

              change:
                data.dp || 0,
            };
          }
        )
      );

    return results;
  } catch (error) {
    console.error(error);

    return [];
  }
}

// ========================================
// REAL MARKET TOP GAINERS / LOSERS
// ========================================

export async function getTrendingStocks() {
  try {
    const res =
      await fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=demo`,
        {
          cache: "no-store",
        }
      );

    const gainers =
      await res.json();

    const res2 =
      await fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=demo`,
        {
          cache: "no-store",
        }
      );

    const losers =
      await res2.json();

    return {
      gainers:
        gainers.slice(0, 5),

      losers:
        losers.slice(0, 5),
    };
  } catch (error) {
    console.error(error);

    return {
      gainers: [],
      losers: [],
    };
  }
}

// ========================================
// MARKET NEWS
// ========================================

export async function getMarketNews() {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`,
      {
        cache: "no-store",
      }
    );

    const data =
      await res.json();

    return data.slice(0, 5);
  } catch (error) {
    console.error(error);

    return [];
  }
}

// ========================================
// DYNAMIC MARKET INSIGHT
// ========================================

export async function getMarketInsight() {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`,
      {
        cache: "no-store",
      }
    );

    const news =
      await res.json();

    const headlines =
      news
        .slice(0, 10)
        .map(
          (
            item: any
          ) =>
            item.headline
              .toLowerCase()
        )
        .join(" ");

    const qqq =
      await fetch(
        `https://finnhub.io/api/v1/quote?symbol=QQQ&token=${API_KEY}`,
        {
          cache: "no-store",
        }
      );

    const qqqData =
      await qqq.json();

    const change =
      qqqData.dp || 0;

    let mood =
      "Neutral";

    if (change > 1.5)
      mood = "Bullish";

    if (change < -1.5)
      mood = "Fear";

    let reason =
      "Investors are watching the market carefully.";

    if (
      headlines.includes(
        "ai"
      ) ||
      headlines.includes(
        "nvidia"
      ) ||
      headlines.includes(
        "tech"
      )
    ) {
      reason =
        "AI and tech companies are currently driving market momentum.";
    }

    else if (
      headlines.includes(
        "oil"
      ) ||
      headlines.includes(
        "middle east"
      )
    ) {
      reason =
        "Energy and geopolitical tensions are impacting investor sentiment.";
    }

    else if (
      headlines.includes(
        "fed"
      ) ||
      headlines.includes(
        "interest rate"
      )
    ) {
      reason =
        "Interest rate expectations and Federal Reserve decisions are moving the market.";
    }

    else if (
      headlines.includes(
        "health"
      ) ||
      headlines.includes(
        "drug"
      )
    ) {
      reason =
        "Healthcare and pharmaceutical sectors are seeing unusual activity today.";
    }

    return {
      mood,
      reason,
    };
  } catch (error) {
    console.error(error);

    return {
      mood: "Neutral",

      reason:
        "Market insight unavailable.",
    };
  }
}