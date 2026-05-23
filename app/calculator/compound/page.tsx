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
    useState("");

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
      mt-4
      bg-[#D9FF00]
      text-black
      rounded-2xl
      px-4
      py-3
      flex
      items-center
      justify-between
      gap-3
    "
  >

    {/* LEFT */}
    <div className="flex items-center gap-3 min-w-0">

      {/* LOGO */}
      <div
        className="
          w-12
          h-12
          rounded-2xl
          bg-black
          flex
          items-center
          justify-center
          shrink-0
          overflow-hidden
        "
      >

        <img
          src={`https://assets.parqet.com/logos/symbol/${selectedStock.symbol}?format=png`}
          alt={selectedStock.symbol}
          className="
            w-7
            h-7
            object-contain
          "
        />

      </div>

      {/* INFO */}
      <div className="min-w-0">

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            font-bold
            opacity-60
          "
        >
          Selected Stock
        </p>

        <h3
          className="
            text-lg
            font-bold
            leading-tight
            truncate
            max-w-[170px]
          "
        >
          {selectedStock.description}
        </h3>

      </div>

    </div>

    {/* TICKER */}
    <div
      className="
        px-3
        py-2
        rounded-lg
        bg-black/10
        text-sm
        font-bold
        shrink-0
      "
    >
      {selectedStock.symbol}
    </div>

  </div>
)}

        </div>

      </section>

    {/* YEARS */}
<section className="px-6 mt-5">

  <div
    className="
      relative
      overflow-hidden
      bg-[#111118]
      rounded-[22px]
      p-5
      border
      border-white/5
    "
  >

    {/* GLOW */}
    <div
      className="
        absolute
        top-0
        right-0
        w-40
        h-40
        bg-[#D9FF00]/10
        rounded-full
        blur-3xl
      "
    />

    {/* TOP */}
    <div className="relative z-10 flex items-start justify-between">

      <div>

        <p
          className="
            text-zinc-500
            text-xs
            uppercase
            tracking-[0.25em]
          "
        >
          Time Horizon
        </p>

        <h2
          className="
            text-[40px]
            font-black
            leading-none
            mt-3
          "
        >
          {years}
          <span className="ml-2 text-[#D9FF00]">
            Years
          </span>
        </h2>

        <p className="text-zinc-500 mt-2 text-sm">
         From the past
        </p>

      </div>

      {/* LEVEL STYLE BADGE */}
      <div
        className="
          px-4
          py-2
          rounded-2xl
          bg-[#D9FF00]
          text-black
          font-black
          text-sm
          shadow-[0_0_25px_rgba(217,255,0,0.25)]
        "
      >
        {years <= 3 && "SHORT"}
        {years > 3 &&
          years <= 7 &&
          "MED"}
        {years > 7 && "LONG"}
      </div>

    </div>

    {/* PROGRESS VISUAL */}
    <div className="relative z-10 mt-7">

      <div className="flex justify-between mb-3">

        {[1, 3, 5, 7, 10].map(
          (value) => (

            <div
              key={value}
              className={`
                text-xs
                font-bold
                transition-all
                ${
                  years >= value
                    ? "text-[#D9FF00]"
                    : "text-zinc-600"
                }
              `}
            >
              {value}Y
            </div>

          )
        )}

      </div>

      {/* RANGE */}
      <div className="relative">

        {/* TRACK GLOW */}
        <div
          className="
            absolute
            top-1/2
            left-0
            -translate-y-1/2
            h-2
            w-full
            rounded-full
            bg-white/5
          "
        />

        {/* ACTIVE TRACK */}
        <div
          className="
            absolute
            top-1/2
            left-0
            -translate-y-1/2
            h-2
            rounded-full
            bg-[#D9FF00]
            transition-all
          "
          style={{
            width: `${
              ((years - 1) / 9) * 100
            }%`,
          }}
        />

        <input
          type="range"
          min="1"
          max="10"
          value={years}
          onChange={(e) =>
            setYears(
              Number(e.target.value)
            )
          }
          className="
            relative
            z-10
            w-full
            appearance-none
            bg-transparent
            cursor-pointer
            slider
          "
        />

      </div>

    </div>

    {/* MINI ACHIEVEMENT */}
    <div
      className="
        relative
        z-10
        mt-6
        flex
        items-center
        gap-2
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

      <p className="text-xs text-zinc-500">

        {years >= 7
          ? "Long-term investor mindset unlocked"
          : years >= 4
          ? "Strong compound growth potential"
          : "Short-term investment simulation"}

      </p>

    </div>

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
  result && (() => {

    const isPositive =
      result.profit >= 0;

    return (

      <div
        className="
          fixed
          inset-0
          bg-black/80
          backdrop-blur-md
          z-[100]
          flex
          items-center
          justify-center
          p-5
        "
      >

        {/* CONFETTI ONLY POSITIVE */}

        {isPositive && (

          <div className="absolute inset-0 overflow-hidden pointer-events-none">

            {[...Array(18)].map(
              (_, index) => (

                <div
                  key={index}
                  className="
                    absolute
                    w-2
                    h-8
                    rounded-full
                    animate-confetti
                  "
                  style={{
                    left: `${Math.random() * 100}%`,

                    top: "-20px",

                    background:
                      [
                        "#D9FF00",
                        "#00FFAE",
                        "#ffffff",
                        "#4ADE80",
                      ][index % 4],

                    animationDelay: `${index * 0.08}s`,

                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />

              )
            )}

          </div>

        )}

        {/* GLOW */}

        <div
          className={`
            absolute
            w-[320px]
            h-[320px]
            rounded-full
            blur-3xl
            animate-pulse

            ${
              isPositive
                ? "bg-[#D9FF00]/20"
                : "bg-red-500/20"
            }
          `}
        />

        {/* CARD */}

        <div
          className="
            relative
            w-full
            max-w-md
            bg-[#111118]
            border
            border-white/5
            rounded-[32px]
            p-5
            overflow-hidden
            animate-[modalShow_.4s_ease]
          "
        >

          {/* TOP LIGHT */}

          <div
            className={`
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-40
              h-1
              blur-sm

              ${
                isPositive
                  ? "bg-[#D9FF00]"
                  : "bg-red-500"
              }
            `}
          />

          {/* CLOSE */}

          <button
            onClick={() =>
              setShowResultModal(false)
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

          {/* STATUS BADGE */}

          <div
            className={`
              inline-flex
              items-center
              gap-2
              border
              rounded-2xl
              px-4
              py-2
              mb-5

              ${
                isPositive
                  ? "bg-[#D9FF00]/10 border-[#D9FF00]/20"
                  : "bg-red-500/10 border-red-500/20"
              }
            `}
          >

            <div
              className={`
                w-2
                h-2
                rounded-full
                animate-pulse

                ${
                  isPositive
                    ? "bg-[#D9FF00]"
                    : "bg-red-500"
                }
              `}
            />

            <p
              className={`
                font-semibold
                text-sm

                ${
                  isPositive
                    ? "text-[#D9FF00]"
                    : "text-red-400"
                }
              `}
            >

              {selectedStock?.symbol}

            </p>

            <span className="text-lg">

              {isPositive
                ? "🎉"
                : "📉"}

            </span>

          </div>

          {/* TITLE */}

          <p className="text-zinc-500 text-sm leading-relaxed">

            {isPositive
              ? "Today your investment would be worth"
              : "This investment underperformed over time"}

          </p>

          {/* VALUE */}

          <h2
            className="
              text-[30px]
              sm:text-[38px]
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
              className={`
                rounded-3xl
                p-5
                min-w-0
                border

                ${
                  isPositive
                    ? "bg-white/[0.03] border-[#00FF99]/10"
                    : "bg-white/[0.03] border-red-500/10"
                }
              `}
            >

              <p className="text-zinc-500 text-sm">
                Total Profit
              </p>

              <h3
                className={`
                  text-[16px]
                  sm:text-[22px]
                  font-bold
                  mt-3
                  leading-snug
                  break-words

                  ${
                    isPositive
                      ? "text-[#00FF99]"
                      : "text-red-400"
                  }
                `}
              >

                {isPositive
                  ? "+"
                  : "-"}

                {formatMoney(
                  Math.abs(
                    result.profit
                  )
                )}

              </h3>

            </div>

            {/* RETURN */}

            <div
              className={`
                rounded-3xl
                p-5
                min-w-0
                border

                ${
                  isPositive
                    ? "bg-white/[0.03] border-[#D9FF00]/10"
                    : "bg-white/[0.03] border-red-500/10"
                }
              `}
            >

              <p className="text-zinc-500 text-sm">
                Return
              </p>

              <h3
                className={`
                  text-[22px]
                  sm:text-[30px]
                  font-bold
                  mt-3
                  break-words
                  leading-tight

                  ${
                    isPositive
                      ? "text-[#D9FF00]"
                      : "text-red-400"
                  }
                `}
              >

                {isPositive
                  ? "+"
                  : "-"}

                {Math.abs(
                  result.percentage
                ).toFixed(0)}
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

              <span
                className={`
                  font-semibold

                  ${
                    isPositive
                      ? "text-[#D9FF00]"
                      : "text-red-400"
                  }
                `}
              >

                $
                {result.currentPrice.toFixed(
                  2
                )}

              </span>

            </div>

          </div>

          {/* DISCLAIMER */}

          <div
            className="
              mt-8
              bg-white/[0.03]
              border
              border-white/5
              rounded-2xl
              px-4
              py-3
            "
          >

            <div className="flex items-start gap-3">

              <div
                className="
                  w-6
                  h-6
                  rounded-full
                  bg-yellow-500/15
                  text-yellow-400
                  flex
                  items-center
                  justify-center
                  text-xs
                  shrink-0
                  mt-0.5
                "
              >
                !
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">

                Historical calculations are based on approximate market prices and intended for simulation purposes only.

              </p>

            </div>

          </div>

        </div>

      </div>

    );

  })()}

    </main>
  );
}