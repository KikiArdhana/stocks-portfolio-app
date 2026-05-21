"use client";

type Props = {
  openModal: () => void;
};

export default function Navbar({
  openModal,
}: Props) {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-zinc-400 mt-1">
          Track your investments
        </p>
      </div>

      <button
        onClick={openModal}
        className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
      >
        Add Holding
      </button>

    </div>
  );
}