import { Holding } from "@/types/holding";

type Props = {
  holdings: Holding[];
  onDelete: (id: string) => void;
};

export default function HoldingsTable({
  holdings,
  onDelete,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

      <h3 className="text-xl font-semibold mb-6">
        Holdings
      </h3>

      <table className="w-full">

        <thead>
          <tr className="text-zinc-400 border-b border-zinc-800 text-left">

            <th className="pb-4">
              Ticker
            </th>

            <th className="pb-4">
              Quantity
            </th>

            <th className="pb-4">
              Avg Price
            </th>

            <th className="pb-4">
              Current
            </th>

            <th className="pb-4">
              Profit
            </th>

            <th className="pb-4">
            </th>

          </tr>
        </thead>

        <tbody>
          {holdings.map((holding) => {

            const currentPrice = 9500;

            const profit =
              (currentPrice -
                holding.average_price) *
              holding.quantity;

            return (
              <tr
                key={holding.id}
                className="border-b border-zinc-800"
              >

                <td className="py-4 font-medium">
                  {holding.ticker}
                </td>

                <td>
                  {holding.quantity}
                </td>

                <td>
                  Rp {holding.average_price}
                </td>

                <td>
                  Rp {currentPrice}
                </td>

                <td className="text-green-500">
                  +Rp {profit}
                </td>

                <td>
                  <button
                    onClick={() =>
                      onDelete(holding.id)
                    }
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
}