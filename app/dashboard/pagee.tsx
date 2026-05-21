"use client";

import { useEffect, useState } from "react";

import {
  Search,
  Bell,
  Plus,
  House,
 BriefcaseBusiness,
  ChartNoAxesCombined,
  User,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";

import AddHoldingModal from "@/components/dashboard/AddHoldingModal";

import EditHoldingModal from "@/components/dashboard/EditHoldingModal";

import {
  getHoldings,
  deleteHolding,
} from "@/services/holding";

import { getStockPrice } from "@/services/stocks";

import { Holding } from "@/types/holding";

import { stockLogos } from "@/lib/logos";

import { toast } from "sonner";

export default function DashboardPage() {
  const [holdings, setHoldings] =
    useState<Holding[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [prices, setPrices] =
    useState<Record<string, number>>(
      {}
    );

  const [editingHolding, setEditingHolding] =
    useState<any>(null);

  const [currency, setCurrency] =
    useState<"USD" | "IDR">("USD");

  const [usdToIdr, setUsdToIdr] =
    useState(17713);

  const [hideBalance, setHideBalance] =
    useState(false);

  async function fetchHoldings() {
    const data = await getHoldings();

    setHoldings(data);
  }

  useEffect(() => {
    fetchHoldings();
  }, []);

  // USD TO IDR RATE
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://open.er-api.com/v6/latest/USD"
        );

        const data = await res.json();

        if (data?.rates?.IDR) {
          setUsdToIdr(data.rates.IDR);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRate();
  }, []);

  // REALTIME STOCK PRICE
  useEffect(() => {
    async function loadPrices() {
      const updatedPrices: Record<
        string,
        number
      > = {};

      for (const holding of holdings) {
        const price =
          await getStockPrice(
            holding.ticker
          );

        if (price) {
          updatedPrices[
            holding.ticker
          ] = price;
        }
      }

      setPrices(updatedPrices);
    }

    if (holdings.length > 0) {
      loadPrices();
    }

    const interval =
      setInterval(
        loadPrices,
        10000
      );

    return () =>
      clearInterval(interval);
  }, [holdings]);

  async function handleDelete(
    id: string
  ) {
    try {
      await deleteHolding(id);

      toast.success(
        "Holding deleted"
      );

      fetchHoldings();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete holding"
      );
    }
  }

  function formatCurrency(
    amount: number
  ) {
    const converted =
      currency === "IDR"
        ? amount * usdToIdr
        : amount;

    return new Intl.NumberFormat(
      currency === "IDR"
        ? "id-ID"
        : "en-US",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(converted);
  }

  const portfolioValue =
    holdings.reduce(
      (acc, holding) => {
        const currentPrice =
          prices[
            holding.ticker
          ] ||
          Number(
            holding.average_price
          );

        return (
          acc +
          currentPrice *
            holding.quantity
        );
      },
      0
    );

  return (
    <main className="min-h-screen bg-[#09090C] text-white pb-32">

      {/* HEADER */}
      <section className="px-5 pt-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-zinc-500 text-lg">
              Welcome back
            </p>

            <h1 className="text-[52px] leading-none font-bold tracking-tight mt-2">
              Kiki
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button
              className="
                w-12
                h-12
                rounded-full
                bg-[#17171F]
                flex
                items-center
                justify-center
                hover:bg-[#20202A]
                transition
              "
            >

              <Search size={21} />

            </button>

            <button
              className="
                w-12
                h-12
                rounded-full
                bg-[#17171F]
                flex
                items-center
                justify-center
                hover:bg-[#20202A]
                transition
              "
            >

              <Bell size={21} />

            </button>

          </div>

        </div>

      </section>

      {/* HERO */}
      <section className="px-5 mt-8">

        <div
          className="
            bg-[#C6FF00]
            rounded-[44px]
            px-7
            pt-7
            pb-6
            text-black
            relative
            overflow-hidden
          "
        >

          {/* TOP */}
          <div className="flex items-start justify-between">

            <p className="text-[20px] opacity-80">
              Total Portfolio
            </p>

            {/* TOGGLE */}
            <div
              className="
                bg-black/10
                p-1
                rounded-full
                flex
                items-center
                gap-1
              "
            >

              <button
                onClick={() =>
                  setCurrency("USD")
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                  transition
                  ${
                    currency ===
                    "USD"
                      ? "bg-black text-white"
                      : "text-black/70"
                  }
                `}
              >

                USD

              </button>

              <button
                onClick={() =>
                  setCurrency("IDR")
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                  transition
                  ${
                    currency ===
                    "IDR"
                      ? "bg-black text-white"
                      : "text-black/70"
                  }
                `}
              >

                IDR

              </button>

            </div>

          </div>

          {/* VALUE + EYE */}
          <div className="mt-10 flex items-center justify-between gap-4">

            <div className="flex-1 min-w-0">

              <h2
                className="
                  font-black
                  leading-[0.9]
                  tracking-[-0.06em]
                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis
                "
                style={{
                  fontSize:
                    currency ===
                    "IDR"
                      ? "clamp(38px, 8vw, 72px)"
                      : "clamp(54px, 10vw, 84px)",
                }}
              >

                {hideBalance
                  ? "••••••"
                  : formatCurrency(
                      portfolioValue
                    )}

              </h2>

            </div>

            {/* EYE */}
            <button
              onClick={() =>
                setHideBalance(
                  !hideBalance
                )
              }
              className="
                w-14
                h-14
                rounded-full
                bg-black/10
                flex
                items-center
                justify-center
                hover:bg-black/20
                transition
                shrink-0
                cursor-pointer
              "
            >

              {hideBalance ? (
                <EyeOff size={22} />
              ) : (
                <Eye size={22} />
              )}

            </button>

          </div>

          {/* BADGES */}
          <div className="flex items-center gap-3 mt-8">

            <div
              className="
                bg-black/10
                px-6
                py-3
                rounded-full
                font-bold
                text-sm
              "
            >

              Live Tracking

            </div>

            <div
              className="
                bg-black/10
                px-6
                py-3
                rounded-full
                font-bold
                text-sm
              "
            >

              Real-Time

            </div>

          </div>

          {/* CHART */}
          <div
            className="
              flex
              items-end
              gap-3
              mt-16
              h-40
            "
          >

            {[40, 80, 60, 100, 50, 120, 70].map(
              (height, index) => (
                <div
                  key={index}
                  style={{
                    height,
                  }}
                  className="
                    flex-1
                    bg-black/10
                    rounded-full
                  "
                />
              )
            )}

          </div>

          {/* BOTTOM INFO */}
          <div className="mt-8 flex flex-col items-center">

            <p
              className="
                text-sm
                font-semibold
                text-black/60
              "
            >

              1 USD ≈ Rp
              {Math.round(
                usdToIdr
              ).toLocaleString()}

            </p>

          </div>

        </div>

      </section>

      {/* HOLDINGS */}
      <section className="px-5 mt-10">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-[48px] leading-none font-bold tracking-tight">

            Holdings

          </h2>

          <button className="text-[#C6FF00] font-semibold text-sm">

            View All

          </button>

        </div>

        <div className="space-y-5">

          {holdings.map(
            (holding, index) => {
              const currentPrice =
                prices[
                  holding.ticker
                ] ||
                Number(
                  holding.average_price
                );

              const pnl =
                (
                  currentPrice -
                  Number(
                    holding.average_price
                  )
                ) *
                Number(
                  holding.quantity
                );

              return (
                <div
                  key={`${holding.id}-${index}`}
                  className="
                    bg-[#13131A]
                    rounded-[38px]
                    px-6
                    py-6
                  "
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex items-center gap-4 min-w-0">

                      {/* LOGO */}
                      <div
                        className="
                          w-16
                          h-16
                          rounded-[22px]
                          bg-white
                          flex
                          items-center
                          justify-center
                          overflow-hidden
                          shrink-0
                        "
                      >

                        <img
                          src={
                            stockLogos[
                              holding
                                .ticker
                            ] ||
                            "https://placehold.co/40x40"
                          }
                          alt={
                            holding.ticker
                          }
                          className="
                            w-10
                            h-10
                            object-contain
                          "
                        />

                      </div>

                      {/* INFO */}
                      <div className="min-w-0">

                        <h3
                          className="
                            text-[28px]
                            leading-none
                            font-bold
                            truncate
                          "
                        >

                          {
                            holding.ticker
                          }

                        </h3>

                        <p className="text-zinc-500 text-sm mt-3">

                          Avg Buy

                        </p>

                        <p className="text-zinc-400 text-lg font-semibold">

                          {hideBalance
                            ? "••••"
                            : formatCurrency(
                                Number(
                                  holding.average_price
                                )
                              )}

                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="text-right shrink-0">

                      <p
                        className="
                          text-[24px]
                          leading-none
                          font-bold
                        "
                      >

                        {hideBalance
                          ? "••••"
                          : formatCurrency(
                              currentPrice
                            )}

                      </p>

                      <p
                        className={`
                          mt-3
                          text-lg
                          font-bold
                          ${
                            pnl >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        `}
                      >

                        {pnl >= 0
                          ? "+"
                          : ""}
                        {Math.round(
                          pnl
                        )}

                      </p>

                    </div>

                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between mt-8">

                    <div>

                      <p className="text-zinc-500 text-sm">

                        Shares

                      </p>

                      <p className="text-2xl font-bold mt-2">

                        {
                          holding.quantity
                        }

                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-5">

                      <button
                        onClick={() =>
                          setEditingHolding(
                            holding
                          )
                        }
                        className="
                          text-zinc-500
                          hover:text-white
                          transition
                        "
                      >

                        <Pencil
                          size={20}
                        />

                      </button>

                      <button
                        onClick={() => {
                          const confirmed =
                            window.confirm(
                              "Delete this holding?"
                            );

                          if (
                            confirmed
                          ) {
                            handleDelete(
                              holding.id
                            );
                          }
                        }}
                        className="
                          text-red-400
                          hover:text-red-300
                          transition
                        "
                      >

                        <Trash2
                          size={20}
                        />

                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>

      {/* FLOATING BUTTON */}
      <button
        onClick={() =>
          setShowModal(true)
        }
        className="
          fixed
          bottom-24
          right-5
          w-20
          h-20
          rounded-full
          bg-[#C6FF00]
          text-black
          flex
          items-center
          justify-center
          shadow-2xl
          active:scale-95
          transition
          z-50
        "
      >

        <Plus size={34} />

      </button>

      {/* BOTTOM NAV */}
      <nav
        className="
          fixed
          bottom-5
          left-1/2
          -translate-x-1/2
          w-[92%]
          max-w-md
          bg-[#15151C]/90
          backdrop-blur-xl
          rounded-full
          px-8
          py-4
          flex
          items-center
          justify-between
          z-40
        "
      >

        <button className="text-[#C6FF00]">

          <House size={24} />

        </button>

        <button className="text-zinc-500">

          <BriefcaseBusiness
            size={24}
          />

        </button>

        <button className="text-zinc-500">

          <ChartNoAxesCombined
            size={24}
          />

        </button>

        <button className="text-zinc-500">

          <User size={24} />

        </button>

      </nav>

      {/* ADD MODAL */}
      {showModal && (
        <AddHoldingModal
          onClose={() =>
            setShowModal(false)
          }
          refresh={fetchHoldings}
        />
      )}

      {/* EDIT MODAL */}
      {editingHolding && (
        <EditHoldingModal
          holding={editingHolding}
          onClose={() =>
            setEditingHolding(null)
          }
          refresh={fetchHoldings}
        />
      )}

    </main>
  );
}