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

// GET REALTIME PRICE
export async function getStockPrice(
  ticker: string
) {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`
    );

    const data = await res.json();

    return data.c;
  } catch (error) {
    console.error(error);

    return null;
  }
}