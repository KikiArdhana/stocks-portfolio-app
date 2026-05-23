"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  TrendingUp,
  TrendingDown,
  Flame,
  Newspaper,
} from "lucide-react";

import {
  getMarketIndexes,
  getTrendingStocks,
  getMarketNews,
  getMarketInsight,
} from "@/services/market";

import BottomNavbar from "@/components/dashboard/BottomNavbar";

export default function MarketPage() {
  const [indexes, setIndexes] =
    useState<any[]>([]);

  const [gainers, setGainers] =
    useState<any[]>([]);

  const [losers, setLosers] =
    useState<any[]>([]);

  const [news, setNews] =
    useState<any[]>([]);

  const [insight, setInsight] =
    useState<any>(null);

  async function loadData() {
    const marketIndexes =
      await getMarketIndexes();

    const trending =
      await getTrendingStocks();

    const marketNews =
      await getMarketNews();

    const marketInsight =
      await getMarketInsight();

    setIndexes(
      marketIndexes
    );

    setGainers(
      trending.gainers
    );

    setLosers(
      trending.losers
    );

    setNews(
      marketNews
    );

    setInsight(
      marketInsight
    );
  }

  useEffect(() => {
    loadData();

    const interval =
      setInterval(
        loadData,
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        pt-4
        pb-32
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <div className="p-3 mt-5">

          <p className="text-zinc-500 text-[11px] tracking-[0.25em] uppercase">
            Live pulse today
          </p>

          <h1
            className="
              text-5xl
              font-black
              tracking-tight
              leading-none
            "
          >
            Market
          </h1>

        </div>


      </div>

      {/* MARKET MOOD */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          p-4
          mb-4
          bg-gradient-to-br
          from-[#C6FF00]
          to-[#9DFF00]
          text-black
        "
      >

        {/* glow */}
        <div
          className="
            absolute
            -right-10
            -top-10
            w-40
            h-40
            rounded-full
            bg-black/10
          "
        />

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Flame size={16} />

              <p className="font-bold text-sm">
                Market Mood
              </p>

            </div>

            <div
              className="
                bg-black
                text-[#C6FF00]
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
              "
            >
              LIVE
            </div>

          </div>

          <div className="mt-3 flex items-end justify-between">

            <div>

              <h2 className="text-4xl font-semibold leading-none">
                {
                  insight?.mood
                }
              </h2>

              <p
                className="
                  text-sm
                  font-medium
                  mt-2
                  max-w-[350px]
                "
              >
                {
                  insight?.reason
                }
              </p>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-black
                flex
                items-center
                justify-center
              "
            >
              <TrendingUp
                className="
                  text-[#C6FF00]
                "
              />
            </div>

          </div>

        </div>

      </div>

      {/* INDEXES */}
     <div className="grid grid-cols-4 gap-2 mb-5 p-2">

  {indexes.map((item) => (

    <div
      key={item.name}
      className="
        bg-[#0B0B11]
        border border-white/[0.05]
        rounded-lg
        p-3
        min-w-0
      "
    >

      <p className="text-[10px] text-zinc-500 truncate">
        {item.name}
      </p>

      <p className="text-[22px] font-bold mt-2 leading-none">
        ${Math.round(item.price)}
      </p>

      <p
        className={`
          text-[12px]
          font-semibold
          mt-2
          ${
            item.change >= 0
              ? "text-[#00FFAE]"
              : "text-red-500"
          }
        `}
      >
        {item.change >= 0 ? "+" : ""}
        {item.change.toFixed(2)}%
      </p>

    </div>

  ))}

</div>


      {/* NEWS */}
      <div className="p-3 mt-5">

        <div className="flex items-center gap-3 mb-4">

          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-[#14141D]
              flex
              items-center
              justify-center
            "
          >
            <Newspaper size={18} />
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Market News
            </h2>

            <p className="text-xs text-zinc-500">
              Updated live
            </p>

          </div>

        </div>

        <div className="space-y-4">

          {news.map(
            (
              item,
              index
            ) => (

              <a
                key={index}
                href={item.url}
                target="_blank"
                className="
                  block
                  bg-[#0F1018]
                  rounded-3xl
                  overflow-hidden
                  border border-white/5
                "
              >

                {item.image && (
                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.headline
                    }
                    className="
                      w-full
                      h-40
                      object-cover
                    "
                  />
                )}

                <div className="p-4">

                  <p className="text-[#C6FF00] text-xs font-semibold mb-2 uppercase">
                    {
                      item.source
                    }
                  </p>

                  <h3
                    className="
                      text-base
                      font-bold
                      leading-snug
                      line-clamp-3
                    "
                  >
                    {
                      item.headline
                    }
                  </h3>

                </div>

              </a>

            )
          )}

        </div>

      </div>

      <BottomNavbar />

    </main>
  );
}