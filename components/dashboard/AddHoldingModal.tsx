"use client";

import { useState } from "react";

import { createHolding } from "@/services/holding";
import { supabase } from "@/lib/supabase";

import StockSearch from "@/components/StockSearch";

type Props = {
  onClose: () => void;
  refresh: () => void;
};

export default function AddHoldingModal({
  onClose,
  refresh,
}: Props) {
  const [ticker, setTicker] = useState("");

  const [quantity, setQuantity] =
    useState("");

  const [averagePrice, setAveragePrice] =
    useState("");

  const [selectedStock, setSelectedStock] =
    useState<any>(null);

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await createHolding(
      user.id,
      ticker,
      Number(quantity),
      Number(averagePrice)
    );

    if (error) {
      alert(error.message);
      return;
    }

    refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50">

      <div className="w-full md:max-w-md bg-[#15151C] rounded-t-[32px] md:rounded-[32px] p-6 border border-white/5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Add Holding
            </h2>

            <p className="text-zinc-500 mt-1">
              Track your investment
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 transition"
          >
            ✕
          </button>

        </div>

        {/* STOCK SEARCH */}
        <div className="mb-4">

          <label className="text-sm text-zinc-500 mb-2 block">
            Stock
          </label>

          <StockSearch
            onSelect={(stock) => {
              setSelectedStock(stock);
              setTicker(stock.symbol);
            }}
          />

        </div>

        {/* SELECTED STOCK */}
        {selectedStock && (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-5">

            <p className="text-lg font-semibold">
              {selectedStock.symbol}
            </p>

            <p className="text-zinc-500 text-sm mt-1">
              {selectedStock.description}
            </p>

          </div>
        )}

        {/* QUANTITY */}
        <div className="mb-4">

          <label className="text-sm text-zinc-500 mb-2 block">
            Quantity
          </label>

          <input
            type="number"
            placeholder="5"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full bg-[#1A1A22] border border-white/5 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-zinc-600"
          />

        </div>

        {/* AVG PRICE */}
        <div className="mb-6">

          <label className="text-sm text-zinc-500 mb-2 block">
            Average Buy Price
          </label>

          <input
            type="number"
            placeholder="162"
            value={averagePrice}
            onChange={(e) =>
              setAveragePrice(
                e.target.value
              )
            }
            className="w-full bg-[#1A1A22] border border-white/5 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-zinc-600"
          />

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 transition rounded-2xl py-4 font-medium text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#C6FF00] hover:opacity-90 transition rounded-2xl py-4 font-semibold text-black"
          >
            Save Holding
          </button>

        </div>

      </div>

    </div>
  );
}