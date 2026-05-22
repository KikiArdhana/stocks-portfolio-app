"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNavbar from "@/components/dashboard/BottomNavbar";
import AddHoldingModal from "@/components/dashboard/AddHoldingModal";
import EditHoldingModal from "@/components/dashboard/EditHoldingModal";
import {
  getHoldings,
  deleteHolding,
} from "@/services/holding";
import { getStockPrice } from "@/services/stocks";
import { getStockLogo } from "@/lib/logos";
import { Holding } from "@/types/holding";
import {
  Search,
  Bell,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "sonner";
export default function DashboardPage() {
  const [holdings, setHoldings] =
    useState<Holding[]>([]);

  const [prices, setPrices] =
    useState<Record<string, number>>(
      {}
    );

  const [user, setUser] =
    useState<any>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingHolding, setEditingHolding] =
    useState<any>(null);

  const [currency, setCurrency] =
    useState<"USD" | "IDR">("USD");

  const [usdToIdr, setUsdToIdr] =
    useState(17713);

  const [hideBalance, setHideBalance] =
    useState(false);

  const [sortBy, setSortBy] =
  useState("value-high");
  
  const [showSortModal, setShowSortModal] =
  useState(false);

  const [username, setUsername] =
  useState("");

  useEffect(() => {
  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username);
    }
  }

  getProfile();
}, []);

  // USER
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);
    }

    getUser();
  }, []);

  // FETCH HOLDINGS
  async function fetchHoldings() {
    const data = await getHoldings();

    setHoldings(data);
  }

  useEffect(() => {
    fetchHoldings();
  }, []);

  // USD TO IDR
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

  // STOCK PRICES
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

  // DELETE
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

  // FORMAT PORTFOLIO ONLY
  function formatPortfolio(
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

  // TOTAL PORTFOLIO
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

  // SORT
  const sortedHoldings = [
  ...holdings,
].sort((a, b) => {
  const priceA =
    prices[a.ticker] ||
    Number(a.average_price);

  const priceB =
    prices[b.ticker] ||
    Number(b.average_price);

  const valueA =
    priceA * a.quantity;

  const valueB =
    priceB * b.quantity;

  const pnlA =
    (priceA -
      Number(a.average_price)) *
    a.quantity;

  const pnlB =
    (priceB -
      Number(b.average_price)) *
    b.quantity;

  switch (sortBy) {
    case "value-high":
      return valueB - valueA;

    case "value-low":
      return valueA - valueB;

    case "profit-high":
      return pnlB - pnlA;

    case "profit-low":
      return pnlA - pnlB;

    case "az":
      return a.ticker.localeCompare(
        b.ticker
      );

    case "za":
      return b.ticker.localeCompare(
        a.ticker
      );

    default:
      return 0;
  }
});

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white pb-32">

      {/* HEADER */}
      <section className="px-5 pt-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-zinc-500 text-md mt-5">
              Welcome back
            </p>

            <h1
              className="
                text-[38px]
                leading-none
                font-bold
                tracking-tight
                mt-5
              "
            >

              @{username}
              {
                user
                  ?.user_metadata
                  ?.username
              }

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
              "
            >

              <Bell size={21} />

            </button>

          </div>

        </div>

      </section>

      {/* HERO */}
      <section className="px-5 mt-7">

        <div
          className="
            bg-[#C6FF00]
            rounded-[42px]
            px-6
            pt-6
            pb-5
            text-black
            overflow-hidden
            relative
          "
        >

          {/* TOP */}
          <div className="flex items-start justify-between">

            <p
              className="
                text-[28px]
                font-medium
                tracking-tight
              "
            >

              Portfolio

            </p>

            {/* TOGGLE */}
            <div
              className="
                bg-black/10
                rounded-full
                p-1
                flex
                items-center
              "
            >

              <button
                onClick={() =>
                  setCurrency(
                    "USD"
                  )
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
                      : "text-black/60"
                  }
                `}
              >

                USD

              </button>

              <button
                onClick={() =>
                  setCurrency(
                    "IDR"
                  )
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
                      : "text-black/60"
                  }
                `}
              >

                IDR

              </button>

            </div>

          </div>

          {/* VALUE */}
          <div className="flex items-center justify-between mt-8 gap-4">

            <div className="min-w-0 flex-1">

              <h2
                className="
                  font-bold
                  leading-none
                  tracking-tight
                  truncate
                "
                style={{
                  fontSize:
                    currency ===
                    "IDR"
                      ? "clamp(28px,7vw,54px)"
                      : "62px",
                }}
              >

                {hideBalance
                  ? "••••••"
                  : formatPortfolio(
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
                shrink-0
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
          <div className="flex gap-3 mt-7">

            <div
              className="
                bg-black/10
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
              "
            >

              Live Tracking

            </div>

            <div
              className="
                bg-black/10
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
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
              mt-10
              h-28
            "
          >

            {[
              40,
              75,
              55,
              95,
              50,
              115,
              65,
            ].map(
              (
                height,
                index
              ) => (
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

          {/* RATE */}
          <div className="mt-5 text-center">

           <p
  className="
    text-xs
    font-semibold
    text-black/55
  "
>
  1 USD ≈ Rp
  {new Intl.NumberFormat(
    "id-ID"
  ).format(
    Math.round(usdToIdr)
  )}
</p>

          </div>

        </div>

      </section>

      {/* HOLDINGS */}
      <section className="px-5 mt-10">

        {/* TITLE */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h2
            className="
              text-[48px]
              leading-none
              font-bold
              tracking-tight
            "
          >

            Holdings

          </h2>

          <button
            className="
              text-[#C6FF00]
              text-sm
              font-semibold
            "
          >

            View All

          </button>

        </div>

        {/* SORT */}
        {/* SORT BAR */}
<div className="flex items-center justify-between mb-5">

  <button
    onClick={() =>
      setShowSortModal(true)
    }
    className="
      flex
      items-center
      gap-2
      text-zinc-400
      text-sm
      font-semibold
    "
  >

    Sort:
    {" "}

    <span className="text-white">

      {sortBy === "value-high"
        ? "Value High → Low"
        : sortBy === "value-low"
        ? "Value Low → High"
        : sortBy === "profit-high"
        ? "Highest Profit"
        : sortBy === "profit-low"
        ? "Lowest Profit"
        : sortBy === "az"
        ? "A → Z"
        : "Z → A"}

    </span>

  </button>

</div>

        {/* LIST */}
        {/* LIST */}
<div className="space-y-3">

  {sortedHoldings.map(
    (
      holding,
      index
    ) => {
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

      const pnlPercentage =
        (
          ((currentPrice -
            Number(
              holding.average_price
            )) /
            Number(
              holding.average_price
            )) *
          100
        );

      return (
        <div
          key={`${holding.id}-${index}`}
          className="
            bg-[#13131A]
            rounded-[26px]
            px-4
            py-4
          "
        >

          {/* TOP */}
          <div className="flex justify-between items-start">

            {/* LEFT */}
            <div className="flex gap-3">

              {/* LOGO */}
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  shrink-0
                "
              >

                <img
                  src={getStockLogo(
                    holding.ticker
                  )}
                  alt={
                    holding.ticker
                  }
                  className="
                    w-10
                    h-10
                    object-contain
                  "
                  onError={(
                    e
                  ) => {
                    e.currentTarget.src =
                      `https://placehold.co/40x40/111111/FFFFFF?text=${holding.ticker[0]}`;
                  }}
                />

              </div>

              {/* INFO */}
              <div>

                <h3
                  className="
                    text-[22px]
                    font-bold
                    leading-none
                  "
                >

                  {
                    holding.ticker
                  }

                </h3>

                <p
                  className="
                    text-zinc-500
                    text-sm
                    mt-2
                  "
                >

                  Avg Buy $
                  {Math.round(
                    Number(
                      holding.average_price
                    )
                  )}

                </p>

              </div>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <p
                className="
                  text-[22px]
                  font-bold
                  leading-none
                "
              >

                $
                {Math.round(
                  currentPrice
                )}

              </p>

              <p
                className={`
                  mt-2
                  text-sm
                  font-semibold
                  ${
                    pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                `}
              >

                {pnlPercentage >= 0
                  ? "+"
                  : ""}
                {pnlPercentage.toFixed(
                  2
                )}
                %

              </p>

            </div>

          </div>

          {/* DIVIDER */}
          <div
            className="
              h-px
              bg-white/5
              my-4
            "
          />

          {/* BOTTOM */}
          <div className="flex items-end justify-between">

            {/* STATS */}
            <div className="flex gap-8">

              <div>

                <p
                  className="
                    text-zinc-500
                    text-xs
                  "
                >

                  Shares

                </p>

                <p
                  className="
                    text-xl
                    font-bold
                    mt-1
                  "
                >

                  {Number(
                    holding.quantity
                  ).toFixed(
                    2
                  )}

                </p>

              </div>

              <div>

                <p
                  className="
                    text-zinc-500
                    text-xs
                  "
                >

                  Profit / Loss

                </p>

                <p
                  className={`
                    text-xl
                    font-bold
                    mt-1
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
                  $
                  {Math.round(
                    pnl
                  )}

                </p>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() =>
                  setEditingHolding(
                    holding
                  )
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/5
                  flex
                  items-center
                  justify-center
                  text-zinc-400
                "
              >

                <Pencil size={15} />

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
                  w-10
                  h-10
                  rounded-full
                  bg-red-500/10
                  flex
                  items-center
                  justify-center
                  text-red-400
                "
              >

                <Trash2 size={15} />

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
          z-50
        "
      >

        <Plus size={34} />

      </button>

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
          holding={
            editingHolding
          }
          onClose={() =>
            setEditingHolding(
              null
            )
          }
          refresh={fetchHoldings}
        />
      )}

      {/* SORT MODAL */}
{showSortModal && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      bg-black/60
      backdrop-blur-sm
      flex
      items-end
    "
    onClick={() =>
      setShowSortModal(false)
    }
  >

    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      className="
        w-full
        bg-[#111117]
        rounded-t-[34px]
        px-6
        pt-4
        pb-10
        animate-in
        slide-in-from-bottom
      "
    >

      {/* HANDLE */}
      <div
        className="
          w-14
          h-1.5
          rounded-full
          bg-white/10
          mx-auto
          mb-7
        "
      />

      {/* TITLE */}
      <h3
        className="
          text-3xl
          font-bold
          text-center
          mb-8
        "
      >

        Sort

      </h3>

      {[
        {
          label:
            "Value High → Low",
          value:
            "value-high",
        },
        {
          label:
            "Value Low → High",
          value:
            "value-low",
        },
        {
          label:
            "Highest Profit",
          value:
            "profit-high",
        },
        {
          label:
            "Lowest Profit",
          value:
            "profit-low",
        },
        {
          label: "A → Z",
          value: "az",
        },
        {
          label: "Z → A",
          value: "za",
        },
      ].map((item) => (
        <button
          key={item.value}
          onClick={() => {
            setSortBy(
              item.value
            );

            setShowSortModal(
              false
            );
          }}
          className="
            w-full
            flex
            items-center
            justify-between
            py-5
            border-b
            border-white/5
          "
        >

          <span
            className="
              text-lg
              font-medium
            "
          >

            {item.label}

          </span>

          <div
            className={`
              w-6
              h-6
              rounded-full
              border-2
              flex
              items-center
              justify-center
              ${
                sortBy ===
                item.value
                  ? "border-[#C6FF00]"
                  : "border-white/20"
              }
            `}
          >

            {sortBy ===
              item.value && (
              <div
                className="
                  w-3
                  h-3
                  rounded-full
                  bg-[#C6FF00]
                "
              />
            )}

          </div>

        </button>
      ))}

    </div>

  </div>
)}

      <BottomNavbar />

    </main>
  );
}