"use client";

import { Trash2 } from "lucide-react";

type Props = {
  holding: any;

  onDelete: (id: string) => void;
};

export default function HoldingsCard({
  holding,
  onDelete,
}: Props) {
  const currentPrice =
    holding.average_price * 1.12;

  const totalPL =
    (currentPrice -
      holding.average_price) *
    holding.quantity;

  return (
    <div className="bg-[#15151C] border border-white/5 rounded-[32px] p-6">

      {/* TOP */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          {/* LOGO */}
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-black font-bold text-lg">

            {holding.ticker
              .slice(0, 2)
              .toUpperCase()}

          </div>

          {/* INFO */}
          <div>

            <h3 className="text-4xl font-bold">
              {holding.ticker}
            </h3>

            <p className="text-zinc-500 text-lg mt-1">
              Stock Holding
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="text-right">

          <p className="text-4xl font-bold">
            $
            {currentPrice.toFixed(0)}
          </p>

          <p className="text-green-400 text-xl font-semibold mt-1">
            +12%
          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mt-8">

        <div className="bg-white/[0.03] rounded-3xl p-5">

          <p className="text-zinc-500">
            Shares
          </p>

          <p className="text-3xl font-bold mt-2">
            {holding.quantity}
          </p>

        </div>

        <div className="bg-white/[0.03] rounded-3xl p-5">

          <p className="text-zinc-500">
            Avg Price
          </p>

          <p className="text-3xl font-bold mt-2">

            $
            {holding.average_price}

          </p>

        </div>

        <div className="bg-white/[0.03] rounded-3xl p-5">

          <p className="text-zinc-500">
            Total P/L
          </p>

          <p className="text-3xl font-bold text-green-400 mt-2">

            +$
            {totalPL.toFixed(0)}

          </p>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end mt-6">

        <button
          onClick={() =>
            onDelete(holding.id)
          }
          className="
            w-14
            h-14
            rounded-2xl
            bg-red-500/10
            text-red-400
            flex
            items-center
            justify-center
            hover:bg-red-500/20
            active:scale-95
            transition
            cursor-pointer
          "
        >

          <Trash2 size={20} />

        </button>

      </div>

    </div>
  );
}