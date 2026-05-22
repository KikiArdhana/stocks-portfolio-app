import { NextResponse } from "next/server";

import YahooFinance from "yahoo-finance2";

const yahooFinance =
  new YahooFinance();

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      symbol,
      yearsAgo,
      amount,
    } = body;

    // VALIDATION
    if (
      !symbol ||
      !yearsAgo ||
      !amount
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 }
      );
    }

    // TODAY
    const today = new Date();

    // TARGET HISTORICAL DATE
    const historicalDate =
      new Date();

    historicalDate.setFullYear(
      today.getFullYear() -
        yearsAgo
    );

    // RANGE START
    const period1 =
      new Date(historicalDate);

    period1.setMonth(
      period1.getMonth() - 1
    );

    // RANGE END
    const period2 =
      new Date(historicalDate);

    period2.setMonth(
      period2.getMonth() + 1
    );

    // GET HISTORICAL DATA
    const history: any =
      await yahooFinance.historical(
        symbol,
        {
          period1,
          period2,
          interval: "1d",
        }
      );

    console.log(
      "HISTORY:",
      history
    );

    // FAIL SAFE
    if (
      !history ||
      history.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No historical data found",
        },
        { status: 400 }
      );
    }

    // FILTER VALID CLOSE PRICE
    const validHistory =
      history.filter(
        (item: any) =>
          item.close &&
          item.close > 0
      );

    if (
      validHistory.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid stock data",
        },
        { status: 400 }
      );
    }

    // HISTORICAL PRICE
    const oldPrice =
      validHistory[0].close;

    // GET CURRENT QUOTE
    const quote: any =
      await yahooFinance.quote(
        symbol
      );

    console.log(
      "QUOTE:",
      quote
    );

    const currentPrice =
      quote?.regularMarketPrice;

    // FAIL SAFE
    if (
      !currentPrice ||
      currentPrice <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to get current price",
        },
        { status: 400 }
      );
    }

    // CALCULATIONS
    const shares =
      amount / oldPrice;

    const currentValue =
      shares * currentPrice;

    const profit =
      currentValue - amount;

    const percentage =
      (profit / amount) * 100;

    // SUCCESS
    return NextResponse.json({
      oldPrice,
      currentPrice,
      currentValue,
      profit,
      percentage,
    });
  } catch (error) {
    console.error(
      "COMPOUND API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      { status: 500 }
    );
  }
}