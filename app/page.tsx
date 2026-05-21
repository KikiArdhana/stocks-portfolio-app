// app/page.tsx

import Link from "next/link";
import { getStockLogo } from "@/lib/logos";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-[#C6FF00]/20 blur-[120px]" />

        <div className="absolute bottom-[-150px] right-[-100px] w-[300px] h-[300px] bg-[#C6FF00]/10 blur-[120px]" />

      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-[#C6FF00] flex items-center justify-center text-black font-bold text-lg">
            V
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Vestio
          </h1>

        </div>

        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-[#C6FF00] text-black font-semibold hover:opacity-90 transition text-sm"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 md:px-12 pt-12 pb-24">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-300 mb-6">

              <TrendingUp
                size={16}
                className="text-[#C6FF00]"
              />

              Track stocks beautifully

            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">

              Modern investing
              <br />

              made
              <span className="text-[#C6FF00]">
                {" "}
                simple.
              </span>

            </h1>

            <p className="mt-7 text-zinc-400 text-lg leading-8 max-w-xl">

              Track your US stocks in beautiful portfolio dashboard.
              Minimal, fast, and built for modern
              investors.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link
                href="/signup"
                className="
                  h-14
                  px-8
                  rounded-2xl
                  bg-[#C6FF00]
                  text-black
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:opacity-90
                  transition
                "
              >

                Start Tracking

                <ArrowRight size={18} />

              </Link>

              <Link
                href="/login"
                className="
                  h-14
                  px-8
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  flex
                  items-center
                  justify-center
                  hover:bg-white/10
                  transition
                "
              >
                Login
              </Link>

            </div>

          </div>

          {/* RIGHT MOCKUP */}
          <div className="relative">

            <div className="bg-[#111116] border border-white/10 rounded-[40px] p-6 shadow-2xl">

              {/* TOP */}
              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-zinc-500">
                    Total Portfolio
                  </p>

                  <h2 className="text-5xl font-bold mt-2">
                    $24,520
                  </h2>

                </div>

                <div className="bg-[#C6FF00] text-black px-4 py-2 rounded-full font-semibold">
                  +4.22%
                </div>

              </div>

              {/* CHART */}
              <div className="bg-[#C6FF00] rounded-[32px] p-6 h-[280px] relative overflow-hidden">

                <div className="absolute inset-0 flex items-end gap-4 px-6 pb-6">

                  {[40, 90, 65, 120, 70, 150, 110].map(
                    (height, index) => (
                      <div
                        key={index}
                        style={{
                          height,
                        }}
                        className="flex-1 bg-black/10 rounded-full"
                      />
                    )
                  )}

                </div>

              </div>

              {/* HOLDINGS */}
             <div className="mt-6 space-y-4">

  {[
    {
      ticker: "NVDA",
      company: "NVIDIA",
      price: "$221",
      profit: "+36%",
    },
    {
      ticker: "AAPL",
      company: "Apple",
      price: "$298",
      profit: "+12%",
    },
  ].map((stock) => (
    <div
      key={stock.ticker}
      className="
        bg-white/[0.03]
        border
        border-white/5
        rounded-[30px]
        p-5
        flex
        items-center
        justify-between
      "
    >

      {/* LEFT */}
      <div className="flex items-center gap-4">

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
  src={getStockLogo(stock.ticker)}
  alt={stock.company}
  className="
    w-full
    h-full
    object-cover
  "
/>

        </div>

        {/* INFO */}
        <div>

          <h3
            className="
              font-bold
              text-xl
            "
          >

            {stock.ticker}

          </h3>

          <p
            className="
              text-zinc-500
              text-sm
              mt-1
            "
          >

            {stock.company}

          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="text-right">

        <p
          className="
            font-bold
            text-2xl
          "
        >

          {stock.price}

        </p>

        <p
          className="
            text-[#00FF85]
            font-semibold
            mt-1
          "
        >

          {stock.profit}

        </p>

      </div>

    </div>
  ))}

</div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-6 md:px-12 pb-24">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-7">

            <div className="w-14 h-14 rounded-2xl bg-[#C6FF00]/10 flex items-center justify-center mb-5">

              <TrendingUp className="text-[#C6FF00]" />

            </div>

            <h3 className="text-2xl font-bold mb-3">
              Live Tracking
            </h3>

            <p className="text-zinc-400 leading-7">
              Monitor your portfolio performance
              in real time with smooth updates.
            </p>

          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-7">

            <div className="w-14 h-14 rounded-2xl bg-[#C6FF00]/10 flex items-center justify-center mb-5">

              <BarChart3 className="text-[#C6FF00]" />

            </div>

            <h3 className="text-2xl font-bold mb-3">
              Clean Analytics
            </h3>

            <p className="text-zinc-400 leading-7">
              Focus only on what matters with a
              minimalist and distraction-free UI.
            </p>

          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-7">

            <div className="w-14 h-14 rounded-2xl bg-[#C6FF00]/10 flex items-center justify-center mb-5">

              <ShieldCheck className="text-[#C6FF00]" />

            </div>

            <h3 className="text-2xl font-bold mb-3">
              Built for Investors
            </h3>

            <p className="text-zinc-400 leading-7">
              Track US stocks in one
              modern investing workspace.
            </p>

          </div>

        </div>

      </section>

      {/* CREDIT */}
<div className="relative z-10 pb-8 text-center">

  <p className="text-zinc-600 text-sm">
    crafted by{" "}

    <span className="text-[#C6FF00] font-medium">
      @kikiardhana
    </span>

  </p>

</div>

    </main>
  );
}