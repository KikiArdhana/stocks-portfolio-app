"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  House,
  Calculator,
  ChartNoAxesCombined,
  User,
} from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      icon: House,
    },
    {
      href: "/calculator",
      icon: Calculator,
    },
    {
      href: "/market",
      icon: ChartNoAxesCombined,
    },
    {
      href: "/profile",
      icon: User,
    },
  ];

  return (
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
      {navItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              transition
              hover:scale-110
              ${
                isActive
                  ? "text-[#C6FF00]"
                  : "text-zinc-500 hover:text-white"
              }
            `}
          >
            <Icon size={24} />
          </Link>
        );
      })}
    </nav>
  );
}