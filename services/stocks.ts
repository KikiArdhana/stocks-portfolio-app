const API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

// SEARCH STOCKS
export async function searchStocks(
  query: string
) {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
    );

    const data = await res.json();

    return data.result || [];
  } catch (error) {
    console.error(error);

    return [];
  }
}

// GET REALTIME STOCK QUOTE
export async function getStockQuote(
  symbol: string
) {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );

    return res.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

// GET ONLY CURRENT PRICE
export async function getStockPrice(
  ticker: string
) {
  try {
    const quote =
      await getStockQuote(ticker);

    return quote?.c || null;
  } catch (error) {
    console.error(error);

    return null;
  }
}

// GET HISTORICAL PRICE
export async function getHistoricalPrice(
  symbol: string,
  yearsAgo: number
) {
  try {
    const now = Math.floor(
      Date.now() / 1000
    );

    // target date
    const target =
      now -
      yearsAgo *
        365 *
        24 *
        60 *
        60;

    // BIGGER RANGE (180 DAYS)
    const from =
      target - 90 * 86400;

    const to =
      target + 90 * 86400;

    const res = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=W&from=${from}&to=${to}&token=${API_KEY}`
    );

    const data = await res.json();

    console.log(
      "HISTORICAL DATA:",
      data
    );

    // FAIL SAFE
    if (
      !data ||
      !data.c ||
      !Array.isArray(data.c)
    ) {
      return null;
    }

    // FILTER VALID PRICES
    const validPrices =
      data.c.filter(
        (price: number) =>
          price > 0
      );

    if (
      validPrices.length === 0
    ) {
      return null;
    }

    // USE AVERAGE PRICE
    const averagePrice =
      validPrices.reduce(
        (
          acc: number,
          curr: number
        ) => acc + curr,
        0
      ) / validPrices.length;

    return averagePrice;
  } catch (error) {
    console.error(
      "Historical Error:",
      error
    );

    return null;
  }
}