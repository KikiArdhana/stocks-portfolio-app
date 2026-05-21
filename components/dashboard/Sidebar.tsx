export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col">
      
      <h1 className="text-3xl font-bold text-white">
        Vestio
      </h1>

      <nav className="mt-10 space-y-3">

        <button className="w-full text-left bg-white text-black px-4 py-3 rounded-xl font-medium">
          Dashboard
        </button>

        <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded-xl transition">
          Portfolio
        </button>

        <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded-xl transition">
          Analytics
        </button>

        <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded-xl transition">
          Settings
        </button>

      </nav>
    </aside>
  );
}