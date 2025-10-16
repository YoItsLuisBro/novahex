import { useState } from "react";
import { Dice1 } from "lucide-react";
import { usePalettes, type Palette } from "../store/palettes";
import { randomHex, harmonyFrom, type HarmonyMode } from "../utils/color";
import { PaletteCard } from "../components/PaletteCard";

const MODES: HarmonyMode[] = [
  "Analogous",
  "Complementary",
  "Triad",
  "Tetrad",
  "Monochrome",
];
const NAMES = [
  "Nebula",
  "Quasar",
  "Aurora",
  "Pulsar",
  "Andromeda",
  "Orion",
  "Lyra",
  "Vortex",
  "Eclipse",
  "Nova",
];

function generateSet(count = 12): Palette[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    const base = randomHex();
    const colors = harmonyFrom(base, mode).map((hex) => ({ hex }));
    return {
      id: `explore_${now}_${i}_${Math.random().toString(36).slice(2, 6)}`,
      name: `${NAMES[i % NAMES.length]} • ${mode}`,
      colors,
      createdAt: now - i * 1000 * 60,
      liked: false,
    };
  });
}

export function Explore() {
  // local-only random feed; does NOT read from the library
  const [items, setItems] = useState<Palette[]>(() => generateSet(12));
  const saveFromColors = usePalettes((s) => s.saveFromColors);
  const toggleLike = usePalettes((s) => s.toggleLike);

  function regenerate() {
    setItems(generateSet(12));
  }

  // When user clicks "Save" on a random card, add it to library and like it.
  function handleSave(p: Palette) {
    const saved = saveFromColors(
      p.name,
      p.colors.map((c) => c.hex)
    );
    toggleLike(saved.id);
  }

  return (
    <section className="py-10">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Explore</h2>
        <div className="flex items-center gap-2">
          <span className="text-white/70">{items.length} palettes</span>
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            title="Regenerate"
          >
            <Dice1 className="size-4" />
            Regenerate
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <PaletteCard key={p.id} p={p} onLike={handleSave} dense />
        ))}
      </div>
    </section>
  );
}
