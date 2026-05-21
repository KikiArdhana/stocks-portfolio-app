import { supabase } from "@/lib/supabase";

export async function getHoldings() {
  const { data, error } =
    await supabase
      .from("holdings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);

    return [];
  }

  return data;
}

export async function createHolding(
  userId: string,
  ticker: string,
  quantity: number,
  averagePrice: number
) {
  return await supabase
    .from("holdings")
    .insert([
      {
        user_id: userId,
        ticker,
        quantity,
        average_price: averagePrice,
      },
    ]);
}

export async function deleteHolding(
  id: string
) {
  const { error } = await supabase
    .from("holdings")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}