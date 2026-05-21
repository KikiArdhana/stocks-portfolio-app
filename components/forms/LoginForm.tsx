"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Welcome back"
    );

    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center px-5 overflow-hidden">

      <div className="w-full max-w-md">

        {/* STATIC HEADER */}
        <div className="mb-10">

          <h1 className="flex text-6xl font-bold justify-center tracking-tight mt-2">
            Login
          </h1>

        </div>

        {/* ONLY CARD FLIPS */}
        <motion.div
          initial={{
            rotateY: -90,
            opacity: 0.4,
          }}
          animate={{
            rotateY: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.45,
          }}
          style={{
            transformStyle:
              "preserve-3d",
          }}
        >

          <form
            onSubmit={handleLogin}
            className="
              bg-[#13131A]
              rounded-[36px]
              p-7
              border
              border-white/[0.03]
              backdrop-blur-xl
            "
          >

            {/* EMAIL */}
            <div className="mb-5">

              <label className="text-zinc-500 text-sm block mb-3">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#1B1B23]
                  border
                  border-white/[0.04]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                  placeholder:text-zinc-600
                  focus:border-[#C6FF00]
                  transition
                "
                required
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-zinc-500 text-sm block mb-3">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#1B1B23]
                  border
                  border-white/[0.04]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  text-white
                  placeholder:text-zinc-600
                  focus:border-[#C6FF00]
                  transition
                "
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                mt-7
                bg-[#C6FF00]
                text-black
                rounded-2xl
                py-4
                font-bold
                text-lg
                hover:opacity-90
                active:scale-[0.98]
                transition
                cursor-pointer
              "
            >

              {loading
                ? "Loading..."
                : "Login"}

            </button>

            <p className="text-center text-zinc-500 mt-6">

              Don&apos;t have an account?{" "}

              <Link
                href="/signup"
                className="
                  text-[#C6FF00]
                  font-semibold
                  hover:opacity-80
                  transition
                "
              >

                Sign up

              </Link>

            </p>

          </form>

        </motion.div>

      </div>

    </main>
  );
}