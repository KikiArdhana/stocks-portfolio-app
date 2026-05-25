"use client";

import { useState } from "react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase-browser";

type Props = {
  holding: any;
  onClose: () => void;
  refresh: () => void;
};

export default function EditHoldingModal({
  holding,
  onClose,
  refresh,
}: Props) {
  const [quantity, setQuantity] =
    useState(holding.quantity);

    const supabase = createClient();

  const [
    averagePrice,
    setAveragePrice,
  ] = useState(
    holding.average_price
  );

  async function handleSave() {
    const { error } =
      await supabase
        .from("holdings")
        .update({
          quantity,
          average_price:
            averagePrice,
        })
        .eq("id", holding.id);

    if (error) {
      toast.error(
        "Failed to update"
      );

      return;
    }

    toast.success(
      "Holding updated"
    );

    refresh();

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-[#15151C] w-full max-w-md rounded-[32px] p-6">

        <h2 className="text-3xl font-bold">
          Edit Holding
        </h2>

        <div className="mt-6 space-y-4">

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full bg-[#1F1F29] rounded-2xl px-5 py-4 outline-none"
          />

          <input
            type="number"
            value={averagePrice}
            onChange={(e) =>
              setAveragePrice(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full bg-[#1F1F29] rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 bg-white/5 rounded-2xl py-4"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-[#C6FF00] text-black rounded-2xl py-4 font-semibold"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}