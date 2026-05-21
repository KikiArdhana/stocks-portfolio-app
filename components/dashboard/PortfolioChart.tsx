"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const data = [
  { value: 100 },
  { value: 250 },
  { value: 180 },
  { value: 320 },
  { value: 400 },
];

export default function PortfolioChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-[350px]">
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Portfolio Growth
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}