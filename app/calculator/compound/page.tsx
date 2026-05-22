"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ChevronRight,
  Calculator,
} from "lucide-react";

import StockSearch from "@/components/StockSearch";

type Stock = {
  symbol: string;
  description: string;
};

export default function CompoundPage() {
  const [currency, setCurrency] =
    useState<"USD" | "IDR">("USD");

  const usdToIdr = 17645;

  const [amount, setAmount] =
    useState("10000");

  const [selectedStock, setSelectedStock] =
    useState<Stock | null>(null);

  const [years, setYears] =
    useState(5);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [showResultModal, setShowResultModal] =
    useState(false);

  // FORMAT INPUT
  function formatInput(
    value: string
  ) {
    const numbers =
      value.replace(/\D/g, "");

    if (!numbers) return "";

    if (currency === "IDR") {
      return Number(
        numbers
      ).toLocaleString("id-ID");
    }

    return Number(
      numbers
    ).toLocaleString("en-US");
  }

  // RAW NUMBER
  function getRawAmount() {
    return Number(
      amount.replace(/\./g, "")
    );
  }

  // FORMAT MONEY
  function formatMoney(
    value: number
  ) {
    if (currency === "IDR") {
      return `Rp${Math.floor(
        value * usdToIdr
      ).toLocaleString("id-ID")}`;
    }

    return `$${Math.floor(
      value
    ).toLocaleString("en-US")}`;
  }

  async function handleCalculate() {
    if (!selectedStock) {
      alert("Choose stock first");
      return;
    }

    try {
      setLoading(true);

      let finalAmount =
        getRawAmount();

      // CONVERT IDR -> USD
      if (currency === "IDR") {
        finalAmount =
          finalAmount / usdToIdr;
      }

      const res = await fetch(
        "/api/compound",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            symbol:
              selectedStock.symbol,
            yearsAgo: years,
            amount: finalAmount,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Unable to calculate"
        );

        return;
      }

      setResult(data);

      setShowResultModal(true);
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32">

      {/* HEADER */}

      <section className="px-6 pt-10">

        <div className="flex items-center gap-2 text-sm text-zinc-500">

          <Link
            href="/portfolio"
            className="hover:text-white transition"
          >
            Calculator
          </Link>

          <ChevronRight size={16} />

          <p className="text-[#D9FF00]">
            Compound
          </p>

        </div>

        <div className="flex items-center gap-4 mt-5">

          <div
            className="
              w-16
              h-16
              rounded-3xl
              bg-[#D9FF00]
              flex
              items-center
              justify-center
              text-black
              shrink-0
            "
          >

            <Calculator size={30} />

          </div>

          <div>

            <p className="text-zinc-500 text-sm">
              Investment Simulator
            </p>

            <h1 className="text-3xl font-bold leading-none mt-1">
              Compound
            </h1>

          </div>

        </div>

      </section>

      {/* TOGGLE */}

      <section className="px-6 mt-6">

        <div
          className="
            inline-flex
            items-center
            gap-1
            bg-[#111118]
            border
            border-white/5
            rounded-2xl
            p-2
          "
        >

          <button
            onClick={() =>
              setCurrency("USD")
            }
            className={`
              h-10
              px-5
              rounded-xl
              text-sm
              font-semibold
              transition
              ${
                currency === "USD"
                  ? "bg-[#D9FF00] text-black"
                  : "text-zinc-500 hover:text-white"
              }
            `}
          >
            USD $
          </button>

          <button
            onClick={() =>
              setCurrency("IDR")
            }
            className={`
              h-10
              px-5
              rounded-xl
              text-sm
              font-semibold
              transition
              ${
                currency === "IDR"
                  ? "bg-[#D9FF00] text-black"
                  : "text-zinc-500 hover:text-white"
              }
            `}
          >
            IDR Rp
          </button>

        </div>

      </section>

      {/* INVESTMENT */}

      <section className="px-6 mt-6">

        <div
          className="
            bg-[#111118]
            rounded-[14px]
            p-6
            border
            border-white/5
          "
        >

          <p className="text-zinc-500 text-md">
            Investment Amount
          </p>

          <div
            className="
              flex
              items-center
              mt-4
              bg-white/[0.04]
              border
              border-white/5
              rounded-2xl
              px-5
              h-16
              focus-within:border-[#D9FF00]
              transition
            "
          >

            <span className="text-2xl font-bold mr-3 shrink-0">

              {currency === "USD"
                ? "$"
                : "Rp"}

            </span>

            <input
              type="text"
              value={amount}
              onChange={(e) =>
                setAmount(
                  formatInput(
                    e.target.value
                  )
                )
              }
              className="
                bg-transparent
                outline-none
                text-2xl
                font-bold
                w-full
              "
            />

          </div>

        </div>

      </section>

      {/* STOCK */}

      <section className="px-6 mt-6">

        <div
          className="
            bg-[#111118]
            rounded-[14px]
            p-6
            border
            border-white/5
          "
        >

          <p className="text-zinc-500 text-lg mb-4">
            Choose Stock
          </p>

          <StockSearch
            onSelect={(
              stock: any
            ) => {
              setSelectedStock({
                symbol:
                  stock.symbol,
                description:
                  stock.description,
              });
            }}
          />

          {selectedStock && (
            <div
              className="
                mt-5
                bg-[#D9FF00]
                text-black
                rounded-3xl
                p-5
              "
            >

              <p className="text-sm font-medium">
                Selected Stock
              </p>

              <h3 className="text-3xl font-bold mt-2 break-words">

                {
                  selectedStock.description
                }

              </h3>

              <p className="mt-1 font-medium">

                {
                  selectedStock.symbol
                }

              </p>

            </div>
          )}

        </div>

      </section>

      {/* YEARS */}

      <section className="px-6 mt-6">

        <div
          className="
            bg-[#111118]
            rounded-[14px]
            p-6
            border
            border-white/5
          "
        >

          <p className="text-zinc-500 text-lg">
            Time Horizon
          </p>

          <h2 className="text-4xl font-bold mt-5">
            {years} Years Ago
          </h2>

          <input
            type="range"
            min="1"
            max="10"
            value={years}
            onChange={(e) =>
              setYears(
                Number(
                  e.target.value
                )
              )
            }
            className="
              w-full
              mt-7
              accent-[#D9FF00]
            "
          />

        </div>

      </section>

      {/* SCENARIO */}

      <section className="px-6 mt-6">

        <div
          className="
            bg-[#111118]
            rounded-[34px]
            p-6
            border
            border-white/5
          "
        >

          <p className="text-zinc-500 text-lg">
            Scenario
          </p>

          <h2
            className="
              text-[34px]
              leading-tight
              font-bold
              mt-5
              break-words
            "
          >

            If you invested

            <span className="text-[#D9FF00]">

              {" "}

              {currency === "USD"
                ? "$"
                : "Rp"}

              {getRawAmount().toLocaleString(
                currency === "USD"
                  ? "en-US"
                  : "id-ID"
              )}

            </span>

            {" "}in{" "}

            <span className="text-[#D9FF00]">

              {selectedStock
                ? selectedStock.symbol
                : "a stock"}

            </span>

            <br />

            {years} years ago...

          </h2>

          <button
            onClick={
              handleCalculate
            }
            disabled={
              !selectedStock ||
              loading
            }
            className="
              w-full
              h-16
              rounded-3xl
              bg-[#D9FF00]
              text-black
              font-bold
              text-xl
              mt-8
              disabled:opacity-40
              transition
            "
          >

            {loading
              ? "Calculating..."
              : "Calculate Growth"}

          </button>

        </div>

      </section>

      {/* RESULT MODAL */}
{/* RESULT MODAL */}

{showResultModal &&
  result && (

    <div
      className="
        fixed
        inset-0
        bg-black/75
        backdrop-blur-md
        z-[100]
        flex
        items-center
        justify-center
        p-5
        animate-in
        fade-in
        duration-300
      "
    >

      {/* GLOW EFFECT */}
      <div
        className="
          absolute
          w-[320px]
          h-[320px]
          rounded-full
          bg-[#D9FF00]/20
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          relative
          w-full
          max-w-md
          bg-[#111118]
          border
          border-white/5
          rounded-[36px]
          p-6
          overflow-hidden
          animate-in
          zoom-in-95
          slide-in-from-bottom-5
          duration-300
        "
      >

        {/* TOP LIGHT */}
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-40
            h-1
            bg-[#D9FF00]
            blur-sm
          "
        />

        {/* CLOSE */}

        <button
          onClick={() =>
            setShowResultModal(
              false
            )
          }
          className="
            absolute
            top-5
            right-5
            w-11
            h-11
            rounded-2xl
            bg-white/5
            hover:bg-white/10
            transition
            text-zinc-400
          "
        >
          ✕
        </button>

        {/* STOCK */}

        <div
          className="
            inline-flex
            items-center
            gap-2
            bg-[#D9FF00]/10
            border
            border-[#D9FF00]/20
            rounded-2xl
            px-4
            py-2
            mb-5
          "
        >

          <div
            className="
              w-2
              h-2
              rounded-full
              bg-[#D9FF00]
              animate-pulse
            "
          />

          <p className="text-[#D9FF00] font-semibold text-sm">

            {selectedStock?.symbol}

          </p>

        </div>

        {/* TITLE */}

        <p className="text-zinc-500 text-sm leading-relaxed">

          Today your investment
          would be worth

        </p>

        {/* VALUE */}

        <h2
          className="
            text-[34px]
            sm:text-[42px]
            font-black
            mt-5
            leading-tight
            break-words
          "
        >

          {formatMoney(
            result.currentValue
          )}

        </h2>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-4 mt-8">

          {/* PROFIT */}

          <div
            className="
              bg-white/[0.03]
              rounded-3xl
              p-5
              min-w-0
            "
          >

            <p className="text-zinc-500 text-sm">
              Total Profit
            </p>

            <h3
              className="
                text-[16px]
                sm:text-[22px]
                font-bold
                text-[#00FF99]
                mt-3
                leading-snug
                break-words
              "
            >

              +
              {formatMoney(
                result.profit
              )}

            </h3>

          </div>

          {/* RETURN */}

          <div
            className="
              bg-white/[0.03]
              rounded-3xl
              p-5
              min-w-0
            "
          >

            <p className="text-zinc-500 text-sm">
              Return
            </p>

            <h3
              className="
                text-[22px]
                sm:text-[30px]
                font-bold
                text-[#D9FF00]
                mt-3
                break-words
                leading-tight
              "
            >

              +
              {result.percentage.toFixed(
                0
              )}
              %

            </h3>

          </div>

        </div>

        {/* INFO */}

        <div className="mt-8 pt-6 border-t border-white/5">

          <p className="text-zinc-500 text-sm leading-relaxed">

            Based on historical stock price

          </p>

          <div className="mt-4 flex items-center gap-2 flex-wrap">

            <span className="text-white font-semibold">

              $
              {result.oldPrice.toFixed(
                2
              )}

            </span>

            <span className="text-zinc-500">
              →
            </span>

            <span className="text-[#D9FF00] font-semibold">

              $
              {result.currentPrice.toFixed(
                2
              )}

            </span>

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            mt-8
            bg-[#D9FF00]/5
            border
            border-[#D9FF00]/10
            rounded-2xl
            px-4
            py-3
          "
        >

          <p className="text-xs text-zinc-400 leading-relaxed">

            Historical calculations are based on approximate market prices and intended for simulation purposes only.

          </p>

        </div>

      </div>

    </div>

)}

    </main>
  );
}