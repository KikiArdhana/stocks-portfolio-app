"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import { searchStocks } from "@/services/stocks";

type Props = {
  onSelect: (stock: any) => void;
};

export default function StockSearch({
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<
    any[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  async function handleSearch(
    value: string
  ) {
    setQuery(value);

    if (value.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const data =
        await searchStocks(value);

      const filtered = data.filter(
        (stock: any) =>
          stock.symbol &&
          stock.description &&
          stock.type === "Common Stock"
      );

      setResults(filtered.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">

      {/* INPUT */}
      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search stock..."
          value={query}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          className="
            w-full
            bg-[#1A1A22]
            border border-white/5
            rounded-2xl
            pl-12
            pr-5
            py-4
            outline-none
            text-white
            placeholder:text-zinc-600
            focus:border-[#C6FF00]/40
            transition
          "
        />

      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div
          className="
            absolute
            top-full
            left-0
            right-0
            mt-3
            bg-[#15151C]
            border border-white/5
            rounded-3xl
            overflow-hidden
            z-50
            shadow-2xl
          "
        >

          {results.map(
            (stock, index) => (

              <button
                key={`${stock.symbol}-${index}`}
                onClick={() => {
                  onSelect(stock);

                  setResults([]);

                  setQuery(
                    stock.symbol
                  );
                }}
                className="
                  w-full
                  px-5
                  py-4
                  flex
                  items-center
                  justify-between
                  hover:bg-white/[0.03]
                  active:scale-[0.99]
                  transition
                  duration-150
                  cursor-pointer
                "
              >

                <div className="flex items-center gap-4">

                  {/* AVATAR */}
                  <div className="w-11 h-11 rounded-2xl bg-[#C6FF00] text-black flex items-center justify-center font-bold text-sm">

                    {stock.symbol
                      .slice(0, 2)
                      .toUpperCase()}

                  </div>

                  {/* INFO */}
                  <div className="text-left">

                    <p className="font-semibold text-white">
                      {stock.symbol}
                    </p>

                    <p className="text-sm text-zinc-500 line-clamp-1">
                      {stock.description}
                    </p>

                  </div>

                </div>

                {/* TYPE */}
                <div className="text-right">

                  <p className="text-xs text-zinc-500">
                    {stock.displaySymbol ||
                      stock.type}
                  </p>

                </div>

              </button>

            )
          )}

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-3 text-sm text-zinc-500">
          Searching...
        </div>
      )}

    </div>
  );
}