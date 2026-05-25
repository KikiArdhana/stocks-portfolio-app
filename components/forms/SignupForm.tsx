"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { createClient } from "@/lib/supabase-browser";

import { toast } from "sonner";

export default function SignupPage() {
  const [loading, setLoading] =
    useState(false);
    const supabase = createClient();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

      if (error) {
        toast.error(error.message);

        return;
      }

      const user = data.user;

      if (!user) {
        toast.error(
          "Failed to create account"
        );

        return;
      }

      const { error: profileError } =
        await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: form.username,
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
          });

      if (profileError) {
        toast.error(
          profileError.message
        );

        return;
      }

      toast.success(
        "Account created successfully"
      );

      window.location.href = "/login";
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center  justify-center px-5 py-10">
      <div className="w-full max-w-[390px] px-5">
        {/* TITLE */}

        <h1 className="text-white text-[64px] font-bold text-center leading-none mb-10">
          Sign Up
        </h1>

        {/* CARD */}

        <form
          onSubmit={handleSignup}
          className="
            bg-[#0D0D16]
            rounded-[38px]
            px-6
            py-7
            border
            border-white/[0.03]
          "
        >
          <div className="space-y-5">
            {/* USERNAME */}

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Username
              </label>

              <input
                type="text"
                required
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username:
                      e.target.value,
                  })
                }
                placeholder="@username"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  px-5
                  text-white
                  placeholder:text-white/20
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#D9FF00]
                  focus:shadow-[0_0_0_2px_rgba(217,255,0,0.15)]
                "
              />
            </div>

            {/* FULL NAME */}

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Full Name
              </label>

              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName:
                      e.target.value,
                  })
                }
                placeholder="Fullname"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  px-5
                  text-white
                  placeholder:text-white/20
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#D9FF00]
                  focus:shadow-[0_0_0_2px_rgba(217,255,0,0.15)]
                "
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Phone Number
              </label>

              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={form.phone}
                onChange={(e) => {
                  const onlyNumbers =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setForm({
                    ...form,
                    phone:
                      onlyNumbers,
                  });
                }}
                placeholder="0812..."
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  px-5
                  text-white
                  placeholder:text-white/20
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#D9FF00]
                  focus:shadow-[0_0_0_2px_rgba(217,255,0,0.15)]
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
                placeholder="you@email.com"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  px-5
                  text-white
                  placeholder:text-white/20
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#D9FF00]
                  focus:shadow-[0_0_0_2px_rgba(217,255,0,0.15)]
                "
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>

              <div
                className="
                  flex
                  items-center
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  px-5
                  transition-all
                  duration-200
                  focus-within:border-[#D9FF00]
                  focus-within:shadow-[0_0_0_2px_rgba(217,255,0,0.15)]
                "
              >
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="
                    flex-1
                    bg-transparent
                    text-white
                    placeholder:text-white/20
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    text-white/45
                    hover:text-white
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff size={21} />
                  ) : (
                    <Eye size={21} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-[#D9FF00]
              text-black
              font-bold
              text-xl
              mt-8
              hover:scale-[1.01]
              active:scale-[0.99]
              transition-all
            "
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          {/* LOGIN */}

          <p className="text-center text-white/40 mt-7">
            Already have an account?{" "}
            <Link
              href="/login"
              className="
                text-[#D9FF00]
                font-semibold
              "
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}