import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Craft{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">
            cosmic palettes
          </span>
        </h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          NovaHex helps you discover, generate, and share color palettes that
          look stellar everywhere.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition nx-glow"
          >
            Generate Palette
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 transition"
          >
            Explore Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
