"use client";

import Link from "next/link";

import {
  Calculator,
  Target,
  Flame,
  Landmark,
  PieChart,
  Wallet,
  House,
  HeartHandshake,
} from "lucide-react";

import BottomNavbar from "@/components/dashboard/BottomNavbar";

const calculators = [
  {
    title: "Compound",
    icon: Calculator,
    href: "/calculator/compound",
    badge: "POPULAR",
  },

  {
    title: "Goal",
    icon: Target,
    href: "/calculator/goal",
    
  },

  {
    title: "FIRE",
    icon: Flame,
    href: "/calculator/fire",
  },

  {
    title: "Dividend",
    icon: Landmark,
    href: "/calculator/dividend",
  },

  {
    title: "Allocation",
    icon: PieChart,
    href: "/calculator/allocation",
    badge: "SOON",
  },

  {
    title: "Retirement",
    icon: Wallet,
    href: "/calculator/retirement",
  },

  {
    title: "Mortgage",
    icon: House,
    href: "/calculator/mortgage",
  },

  {
    title: "Marriage",
    icon: HeartHandshake,
    href: "/calculator/marriage",
  },
];

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-32">

      {/* HEADER */}

      <section className="px-6 pt-7">

        <p className="text-zinc-500 text-[11px] tracking-[0.25em] uppercase">
          Financial Tools
        </p>

        <h1 className="text-[52px] font-bold leading-none mt-3">
          Calculators
        </h1>

        <p className="text-zinc-500 mt-3 text-[15px] leading-relaxed max-w-[320px]">
          Smart calculators to plan your investments,
          retirement, and financial freedom.
        </p>

      </section>

      {/* MENU GRID */}

      <section className="px-6 mt-9">

        <div className="grid grid-cols-3 gap-y-8 gap-x-4">

          {calculators.map((item) => {

            const Icon = item.icon;

            return (

              <Link
                key={item.title}
                href={item.href}
                className="
                  flex
                  flex-col
                  items-center
                  text-center
                  relative
                  group
                "
              >

                {/* ICON CARD */}

                <div
                  className="
                    relative
                    w-[78px]
                    h-[78px]
                    rounded-[28px]
                    bg-[#111118]
                    border
                    border-white/5
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    transition-all
                    duration-300
                    group-hover:border-[#D9FF00]/30
                    group-active:scale-95
                  "
                >

                  {/* GLOW */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[#D9FF00]/0
                      group-hover:bg-[#D9FF00]/5
                      transition-all
                    "
                  />

                  {/* ICON */}

                  <Icon
                    size={31}
                    className="
                      text-[#D9FF00]
                      relative
                      z-10
                    "
                  />

                  {/* BADGE */}

                  {item.badge && (

                    <div
                      className="
                        absolute
                        -top-1
                        -right-1
                        bg-[#D9FF00]
                        text-black
                        text-[9px]
                        font-bold
                        px-2
                        h-5
                        rounded-full
                        flex
                        items-center
                        justify-center
                        tracking-wide
                        shadow-lg
                      "
                    >
                      {item.badge}
                    </div>

                  )}

                </div>

                {/* TITLE */}

                <p
                  className="
                    text-white
                    text-[15px]
                    font-semibold
                    mt-3
                    leading-tight
                  "
                >
                  {item.title}
                </p>

              </Link>

            );
          })}

        </div>

      </section>

    {/* INVESTOR WISDOM */}

<section className="px-6 mt-14">

  <div
    className="
      bg-[#111118]
      border
      border-white/5
      rounded-[34px]
      p-6
      overflow-hidden
    "
  >

    {/* HEADER */}

    <p className="text-zinc-500 text-[11px] tracking-[0.25em] uppercase">
      Investor Wisdom
    </p>

    <h2 className="text-[38px] font-bold leading-none mt-3">
      Learn From
      <br />
      Legends
    </h2>

    {/* CAROUSEL */}

    <div className="mt-8 overflow-x-auto scrollbar-hide">

      <div className="flex gap-4 w-max pb-1">

        {[
          {
            name: "Warren Buffett",

            company: "Berkshire Hathaway",

            quote:
              "The stock market is a device for transferring money from the impatient to the patient.",

            image:
              "https://upload.wikimedia.org/wikipedia/commons/5/51/Warren_Buffett_KU_Visit.jpg",
          },

          {
            name: "Peter Lynch",

            company: "Fidelity",

            quote:
              "Know what you own, and know why you own it.",

            image:
              "data:image/jpeg;base64,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",
          },

          {
            name: "Benjamin Graham",

            company: "Value Investing",

            quote:
              "The investor’s chief problem — and even his worst enemy — is likely to be himself.",

            image:
              "https://upload.wikimedia.org/wikipedia/commons/2/2a/Benjamin_Graham_%281894-1976%29_portrait_on_23_March_1950.jpg",
          },

          {
            name: "Ray Dalio",

            company: "Bridgewater Associates",

            quote:
              "He who lives by the crystal ball will eat shattered glass.",

            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9bQp42wSoFvdMHH_OBg9iJXthIHTLpIfiQ&s",
          },
        ].map((item) => (

          <div
            key={item.name}
            className="
              w-[305px]
              min-h-[250px]
              bg-[#0D0D16]
              rounded-[28px]
              border
              border-white/5
              p-5
              flex
              flex-col
              justify-between
              shrink-0
            "
          >

            {/* TOP */}

            <div className="flex items-center gap-4">

              {/* PHOTO */}

              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  overflow-hidden
                  border
                  border-white/10
                  shrink-0
                  bg-white/5
                "
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

              {/* INFO */}

              <div>

                <h3 className="text-[24px] font-bold leading-none">
                  {item.name}
                </h3>

                <p className="text-zinc-500 text-sm mt-2">
                  {item.company}
                </p>

              </div>

            </div>

            {/* QUOTE */}

            <p
              className="
                text-[23px]
                font-bold
                leading-tight
                mt-7
              "
            >
              “{item.quote}”
            </p>

            {/* FOOTER */}

            <div className="flex items-center gap-2 mt-8">

              <div className="w-2 h-2 rounded-full bg-[#D9FF00]" />

              <p className="text-[#D9FF00] text-sm font-medium">
                Legendary Investor
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>

      <BottomNavbar />

    </main>
  );
}