import { useMemo, useState } from "react";
import { usePalettes } from "../store/palettes";
import { PaletteCard } from "../components/PaletteCard";

export function Saved() {
  const palettes = usePalettes((s) => s.palettes); // stable slice
  const [likedOnly, setLikedOnly] = useState(false);

  const items = useMemo(
    () => (likedOnly ? palettes.filter((p) => p.liked) : palettes),
    [palettes, likedOnly]
  );

  const none = items.length === 0;

  return (
    <section className="py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Saved</h2>
          <p className="text-white/70">
            {likedOnly ? "Liked palettes" : "All saved palettes"} • {items.length}
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={likedOnly}
            onChange={(e) => setLikedOnly(e.target.checked)}
            className="accent-violet-400"
          />
          Liked only
        </label>
      </div>

      {none ? (
        <p className="text-white/70 mt-4">
          {likedOnly
            ? "You haven’t liked any palettes yet."
            : "No saved palettes yet — create one on the Create page."}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PaletteCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
