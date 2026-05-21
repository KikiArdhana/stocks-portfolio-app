"use client";

import { useMemo, useState } from "react";

import BottomNavbar from "@/components/dashboard/BottomNavbar";

export default function CalculatorPage() {
  const [initialAmount, setInitialAmount] =
    useState(1000);

  const [
    monthlyInvestment,
    setMonthlyInvestment,
  ] = useState(500);

  const [years, setYears] = useState(20);

  const [returnRate, setReturnRate] =
    useState(12);

  const result = useMemo(() => {
    const monthlyRate =
      returnRate / 100 / 12;

    const months = years * 12;

    let total = initialAmount;

    for (let i = 0; i < months; i++) {
      total =
        total * (1 + monthlyRate) +
        monthlyInvestment;
    }

    const invested =
      initialAmount +
      monthlyInvestment * months;

    const profit = total - invested;

    return {
      total,
      invested,
      profit,
    };
  }, [
    initialAmount,
    monthlyInvestment,
    years,
    returnRate,
  ]);

  function formatCurrency(
    number: number
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    ).format(number);
  }

  return (
    <main className="min-h-screen bg-black text-white pb-40">

      {/* MAIN CARD */}
      <section className="px-6 mt-8">

        <div className="bg-[#C6FF00] rounded-[42px] p-6 text-black relative overflow-hidden">

          {/* TOP */}
          <div className="flex items-center justify-between">

            <div>

              <p className="text-lg">
                Future Portfolio
              </p>

              <h2 className="text-6xl font-bold mt-3 leading-none">

                {formatCurrency(
                  result.total
                )}

              </h2>

            </div>

          </div>

          {/* RESULT STATS */}
          <div className="grid grid-cols-2 gap-3 mt-7">

            <div className="bg-black/10 rounded-3xl p-4">

              <p className="text-sm opacity-70">
                Invested
              </p>

              <h3 className="text-2xl font-bold mt-2">

                {formatCurrency(
                  result.invested
                )}

              </h3>

            </div>

            <div className="bg-black/10 rounded-3xl p-4">

              <p className="text-sm opacity-70">
                Profit
              </p>

              <h3 className="text-2xl font-bold mt-2">

                {formatCurrency(
                  result.profit
                )}

              </h3>

            </div>

          </div>

          {/* CHART */}
          <div className="flex items-end gap-3 mt-10 h-36">

            {[40, 65, 55, 90, 70, 120, 140].map(
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

      {/* INPUTS */}
      <section className="px-6 mt-8 space-y-5">

        {/* INITIAL */}
        <div className="bg-[#111118] rounded-[32px] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-500">
                Initial Amount
              </p>

              <h3 className="text-3xl font-bold mt-2">

                {formatCurrency(
                  initialAmount
                )}

              </h3>

            </div>

          </div>

          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={initialAmount}
            onChange={(e) =>
              setInitialAmount(
                Number(e.target.value)
              )
            }
            className="w-full mt-6"
          />

        </div>

        {/* MONTHLY */}
        <div className="bg-[#111118] rounded-[32px] p-5">

          <p className="text-zinc-500">
            Monthly Investment
          </p>

          <h3 className="text-3xl font-bold mt-2">

            {formatCurrency(
              monthlyInvestment
            )}

          </h3>

          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={monthlyInvestment}
            onChange={(e) =>
              setMonthlyInvestment(
                Number(e.target.value)
              )
            }
            className="w-full mt-6"
          />

        </div>

        {/* RETURN */}
        <div className="bg-[#111118] rounded-[32px] p-5">

          <p className="text-zinc-500">
            Expected Return
          </p>

          <h3 className="text-3xl font-bold mt-2">

            {returnRate}%
          </h3>

          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={returnRate}
            onChange={(e) =>
              setReturnRate(
                Number(e.target.value)
              )
            }
            className="w-full mt-6"
          />

        </div>

        {/* YEARS */}
        <div className="bg-[#111118] rounded-[32px] p-5">

          <p className="text-zinc-500">
            Investment Duration
          </p>

          <h3 className="text-3xl font-bold mt-2">

            {years} Years
          </h3>

          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={years}
            onChange={(e) =>
              setYears(
                Number(e.target.value)
              )
            }
            className="w-full mt-6"
          />

        </div>

      </section>

      {/* MOTIVATION */}
      <section className="px-6 mt-8">

        <div className="bg-[#111118] rounded-[32px] p-6">

          <p className="text-zinc-500 text-lg">
            If you stay consistent...
          </p>

          <h2 className="text-4xl font-bold mt-3 leading-tight">

            You could reach{" "}
            <span className="text-[#C6FF00]">

              {formatCurrency(
                result.total
              )}

            </span>{" "}
            in {years} years.

          </h2>

        </div>

      </section>

      <BottomNavbar />

    </main>
  );
}