"use client";

import BottomNavbar from "@/components/dashboard/BottomNavbar";

import {
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Newspaper,
  Eye,
} from "lucide-react";

const trendingStocks = [
  {
    ticker: "NVDA",
    company: "NVIDIA",
    price: "$1,064",
    change: "+4.82%",
    positive: true,
  },

  {
    ticker: "TSLA",
    company: "Tesla",
    price: "$178",
    change: "-2.14%",
    positive: false,
  },

  {
    ticker: "AAPL",
    company: "Apple",
    price: "$212",
    change: "+1.32%",
    positive: true,
  },

  {
    ticker: "MSFT",
    company: "Microsoft",
    price: "$428",
    change: "+0.74%",
    positive: true,
  },
];

const news = [
  {
    title:
      "NVIDIA reaches new all-time high after AI demand surge",
    source: "Bloomberg",
    time: "2h ago",
  },

  {
    title:
      "The Fed signals possible interest rate cuts this year",
    source: "Reuters",
    time: "5h ago",
  },

  {
    title:
      "Apple prepares major AI announcement for iPhone ecosystem",
    source: "CNBC",
    time: "7h ago",
  },

  {
    title:
      "Tesla stock drops after weaker-than-expected deliveries",
    source: "Yahoo Finance",
    time: "9h ago",
  },
];

const watchlist = [
  {
    ticker: "GOOGL",
    price: "$177",
    change: "+2.4%",
    positive: true,
  },

  {
    ticker: "META",
    price: "$492",
    change: "+1.8%",
    positive: true,
  },

  {
    ticker: "AMD",
    price: "$164",
    change: "-0.8%",
    positive: false,
  },
];

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white pb-36">

      {/* HEADER */}
      <section className="px-6 pt-10">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-6xl font-bold tracking-tight">
              Market
            </h1>

            <p className="text-zinc-500 text-lg mt-3">

              Live market pulse and stock news

            </p>

          </div>

          {/* LIVE BADGE */}
          <div
            className="
              bg-[#111118]
              border
              border-white/5
              px-4
              py-2
              rounded-full
              flex
              items-center
              gap-2
            "
          >

            <div className="w-2 h-2 rounded-full bg-[#C6FF00]" />

            <span className="text-sm font-medium">
              Live
            </span>

          </div>

        </div>

      </section>

      {/* MARKET SENTIMENT */}
      <section className="px-6 mt-8">

        <div
          className="
            bg-[#C6FF00]
            rounded-[42px]
            p-6
            text-black
            relative
            overflow-hidden
          "
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-lg">
                Market Sentiment
              </p>

              <h2 className="text-5xl font-bold mt-3">

                Bullish 📈

              </h2>

              <p className="mt-4 text-black/70 text-lg max-w-[240px]">

                Tech stocks continue leading the market higher.

              </p>

            </div>

            <div
              className="
                w-16
                h-16
                rounded-full
                bg-black/10
                flex
                items-center
                justify-center
              "
            >

              <Flame size={28} />

            </div>

          </div>

          {/* MINI CHART */}
          <div className="flex items-end gap-3 mt-10 h-28">

            {[30, 45, 55, 70, 85, 110, 130].map(
              (height, index) => (
                <div
                  key={index}
                  style={{
                    height,
                  }}
                  className="
                    flex-1
                    rounded-full
                    bg-black/10
                  "
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* TRENDING */}
      <section className="mt-10">

        <div className="px-6 flex items-center justify-between">

          <h2 className="text-4xl font-bold">
            Trending
          </h2>

          <button className="text-[#C6FF00] font-semibold">

            View All

          </button>

        </div>

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            px-6
            mt-5
            pb-2
          "
        >

          {trendingStocks.map((stock) => (
            <div
              key={stock.ticker}
              className="
                min-w-[230px]
                bg-[#111118]
                border
                border-white/5
                rounded-[34px]
                p-5
                flex
                flex-col
                justify-between
              "
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-3xl font-bold">

                    {stock.ticker}

                  </h3>

                  <p className="text-zinc-500 mt-1">

                    {stock.company}

                  </p>

                </div>

                <div
                  className={`
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${
                      stock.positive
                        ? "bg-[#00FF85]/10 text-[#00FF85]"
                        : "bg-red-500/10 text-red-400"
                    }
                  `}
                >

                  {stock.positive ? (
                    <ArrowUpRight size={22} />
                  ) : (
                    <ArrowDownRight size={22} />
                  )}

                </div>

              </div>

              {/* PRICE */}
              <div className="mt-8">

                <h2 className="text-4xl font-bold">

                  {stock.price}

                </h2>

                <p
                  className={`
                    mt-2
                    text-lg
                    font-semibold
                    ${
                      stock.positive
                        ? "text-[#00FF85]"
                        : "text-red-400"
                    }
                  `}
                >

                  {stock.change}

                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* NEWS */}
      <section className="px-6 mt-10">

        <div className="flex items-center justify-between">

          <h2 className="text-4xl font-bold">
            News
          </h2>

          <Newspaper
            size={24}
            className="text-zinc-500"
          />

        </div>

        <div className="space-y-4 mt-5">

          {news.map((item, index) => (
            <div
              key={index}
              className="
                bg-[#111118]
                border
                border-white/5
                rounded-[32px]
                p-5
              "
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-xl font-semibold leading-relaxed">

                    {item.title}

                  </h3>

                  <div className="flex items-center gap-3 mt-4 text-zinc-500">

                    <span>
                      {item.source}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {item.time}
                    </span>

                  </div>

                </div>

                <div
                  className="
                    min-w-[48px]
                    h-12
                    rounded-full
                    bg-white/[0.04]
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Eye size={18} />

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* WATCHLIST */}
      <section className="px-6 mt-10">

        <div className="flex items-center justify-between">

          <h2 className="text-4xl font-bold">
            Watchlist
          </h2>

          <button className="text-[#C6FF00] font-semibold">

            Manage

          </button>

        </div>

        <div className="space-y-4 mt-5">

          {watchlist.map((stock) => (
            <div
              key={stock.ticker}
              className="
                bg-[#111118]
                border
                border-white/5
                rounded-[28px]
                p-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3 className="text-2xl font-bold">

                  {stock.ticker}

                </h3>

                <p className="text-zinc-500 mt-1">

                  Watching closely

                </p>

              </div>

              <div className="text-right">

                <h2 className="text-3xl font-bold">

                  {stock.price}

                </h2>

                <p
                  className={`
                    mt-1
                    font-semibold
                    ${
                      stock.positive
                        ? "text-[#00FF85]"
                        : "text-red-400"
                    }
                  `}
                >

                  {stock.change}

                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      <BottomNavbar />

    </main>
  );
}