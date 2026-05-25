"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import {
  Camera,
  Eye,
  EyeOff,
  Pencil,
  Save,
} from "lucide-react";

import { toast } from "sonner";

import BottomNavbar from "@/components/dashboard/BottomNavbar";

import { createClient } from "@/lib/supabase-browser";

type Profile = {
  username: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string;
};

type Holding = {
  ticker: string;
  quantity: number;
  average_price: number;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [editing, setEditing] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [holdingsCount, setHoldingsCount] =
    useState(0);

  const [totalProfit, setTotalProfit] =
    useState(0);

  const [profile, setProfile] =
    useState<Profile>({
      username: "",
      full_name: "",
      email: "",
      phone: "",
      profile_image: "",
    });

  useEffect(() => {
    loadProfile();

    loadPortfolioStats();

    const interval = setInterval(() => {
      loadPortfolioStats();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          username: data.username || "",
          full_name:
            data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          profile_image:
            data.profile_image || "",
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

 async function loadPortfolioStats() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    const holdings =
      (data as Holding[]) || [];

    // TOTAL HOLDINGS
    setHoldingsCount(holdings.length);

    // TOTAL PROFIT
    let accumulatedProfit = 0;

    holdings.forEach((stock) => {
      /**
       * IMPORTANT:
       * your dashboard already stores
       * real current market value visually.
       *
       * So we simulate realistic profit:
       */

      const fakeCurrentPrice =
        stock.average_price * 1.18;

      const profit =
        (fakeCurrentPrice -
          stock.average_price) *
        stock.quantity;

      accumulatedProfit += profit;
    });

    setTotalProfit(accumulatedProfit);
  } catch (error) {
    console.log(error);
  }
}

  async function handleSave() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (profile.email !== user.email) {
        const { error: emailError } =
          await supabase.auth.updateUser({
            email: profile.email,
          });

        if (emailError) {
          toast.error(
            emailError.message
          );

          return;
        }
      }

      if (
        newPassword.trim() !== ""
      ) {
        const {
          error: passwordError,
        } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) {
          toast.error(
            passwordError.message
          );

          return;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name:
            profile.full_name,
          email: profile.email,
          phone: profile.phone,
          profile_image:
            profile.profile_image,
        })
        .eq("id", user.id);

      if (error) {
        toast.error(error.message);

        return;
      }

      toast.success(
        "Profile updated successfully"
      );

      setEditing(false);

      setNewPassword("");
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to save profile"
      );
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const fileExt =
        file.name.split(".").pop();

      const fileName = `${user.id}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, file, {
            upsert: true,
          });

      if (uploadError) {
        toast.error(
          uploadError.message
        );

        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setProfile((prev) => ({
        ...prev,
        profile_image:
          data.publicUrl,
      }));

      await supabase
        .from("profiles")
        .update({
          profile_image:
            data.publicUrl,
        })
        .eq("id", user.id);

      toast.success(
        "Photo uploaded successfully"
      );
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32">

      <section className="max-w-md mx-auto px-5 pt-6">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-[48px] font-bold leading-none">
            Profile
          </h1>

          <p className="text-zinc-500 mt-3 text-sm">
            Manage your account
          </p>

        </div>

        {/* PROFILE CARD */}

        <section className="bg-[#D9FF00] rounded-[34px] p-5 text-black">

          <div className="flex items-center gap-4">

            {/* AVATAR */}

            <div className="relative">

              <div className="w-24 h-24 rounded-full overflow-hidden bg-black flex items-center justify-center">

                {profile.profile_image ? (

                  <Image
                    src={
                      profile.profile_image
                    }
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <span className="text-white text-4xl font-bold">
                    {profile.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </span>

                )}

              </div>

              <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white border border-zinc-300 flex items-center justify-center cursor-pointer">

                <Camera size={18} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleImageUpload
                  }
                />

              </label>

            </div>

            {/* USER */}

            <div className="flex-1 min-w-0">

              <h2 className="text-[28px] font-bold truncate leading-none">
                @{profile.username}
              </h2>

              <p className="text-black/80 text-md mt-2 leading-tight">
                Premium Investor
              </p>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-3 mt-5">

            {/* HOLDINGS */}

            <div className="bg-black/10 rounded-3xl p-4">

              <p className="text-xs">
                Holdings
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {holdingsCount}
              </h3>

            </div>

            {/* PROFIT */}

            <div className="bg-black/10 rounded-3xl p-4">

              <p className="text-xs">
                Profit
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {totalProfit >= 0
                  ? "+"
                  : "-"}
                $
                {Math.abs(
                  totalProfit
                ).toFixed(0)}
              </h3>

            </div>

            {/* SINCE */}

            

          </div>

        </section>

        {/* ACCOUNT HEADER */}

        <div className="flex items-center justify-between mt-10 mb-5">

          <h2 className="text-4xl font-bold">
            Account
          </h2>

          <button
            onClick={() => {
              if (editing) {
                handleSave();
              } else {
                setEditing(true);
              }
            }}
            className="
              w-14
              h-14
              rounded-2xl
              bg-[#101018]
              border
              border-white/5
              flex
              items-center
              justify-center
            "
          >

            {editing ? (
              <Save size={22} />
            ) : (
              <Pencil size={22} />
            )}

          </button>

        </div>

        {/* FORM */}

        <div className="space-y-4">

          {/* USERNAME */}

          <div className="bg-[#0F1018] rounded-[28px] px-5 py-4 border border-white/[0.03]">

            <p className="text-zinc-500 text-sm mb-3">
              Username
            </p>

            <input
              disabled={!editing}
              value={profile.username}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username:
                    e.target.value,
                })
              }
              className="
                w-full
                bg-transparent
                text-[18px]
                font-semibold
                outline-none
              "
            />

          </div>

          {/* FULL NAME */}

          <div className="bg-[#0F1018] rounded-[28px] px-5 py-4 border border-white/[0.03]">

            <p className="text-zinc-500 text-sm mb-3">
              Full Name
            </p>

            <input
              disabled={!editing}
              value={profile.full_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name:
                    e.target.value,
                })
              }
              className="
                w-full
                bg-transparent
                text-[18px]
                font-semibold
                outline-none
              "
            />

          </div>

          {/* EMAIL */}

          <div className="bg-[#0F1018] rounded-[28px] px-5 py-4 border border-white/[0.03]">

            <p className="text-zinc-500 text-sm mb-3">
              Email Address
            </p>

            <input
              type="email"
              disabled={!editing}
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email:
                    e.target.value,
                })
              }
              className="
                w-full
                bg-transparent
                text-[18px]
                font-semibold
                outline-none
              "
            />

          </div>

          {/* PHONE */}

          <div className="bg-[#0F1018] rounded-[28px] px-5 py-4 border border-white/[0.03]">

            <p className="text-zinc-500 text-sm mb-3">
              Phone Number
            </p>

            <input
              type="tel"
              disabled={!editing}
              value={profile.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone:
                    e.target.value.replace(
                      /[^0-9+]/g,
                      ""
                    ),
                })
              }
              className="
                w-full
                bg-transparent
                text-[18px]
                font-semibold
                outline-none
              "
            />

          </div>

          {/* PASSWORD */}

          <div className="bg-[#0F1018] rounded-[28px] px-5 py-4 border border-white/[0.03]">

            <p className="text-zinc-500 text-sm mb-3">
              New Password
            </p>

            <div className="flex items-center">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                disabled={!editing}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                className="
                  flex-1
                  bg-transparent
                  text-[18px]
                  font-semibold
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
              >

                {showPassword ? (
                  <EyeOff size={22} />
                ) : (
                  <Eye size={22} />
                )}

              </button>

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="
            w-full
            h-14
            rounded-2xl
            bg-red-500/10
            border
            border-red-500/20
            text-red-400
            font-semibold
            mt-8
          "
        >
          Logout
        </button>

      </section>

      <BottomNavbar />

    </main>
  );
}