import { useMemo, useState } from "react";
import { Dice1, Save, Sparkles } from "lucide-react";
import { Swatch } from "../components/Swatch";
import { harmonyFrom, randomHex, type HarmonyMode } from "../utils/color";
import { usePalettes } from "../store/palettes";

const MODES: HarmonyMode[] = [
  "Analogous",
  "Complementary",
  "Triad",
  "Tetrad",
  "Monochrome",
];

export function Create() {
  const saveFromColors = usePalettes((s) => s.saveFromColors);

  const [mode, setMode] = useState<HarmonyMode>("Analogous");
  const [seed, setSeed] = useState<string>(randomHex());
  const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]);
  const [customName, setCustomName] = useState<string>("");

  const palette = useMemo(() => harmonyFrom(seed, mode), [seed, mode]);

  function shuffle() {
    const newSeed = randomHex();
    const nextP = harmonyFrom(newSeed, mode);
    const merged = nextP.map((hex, i) => (locks[i] ? palette[i] : hex));
    setSeed(merged[2]);
  }

  function toggleLock(i: number) {
    setLocks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function setColor(i: number, hex: string) {
    if (i === 2) setSeed(hex);
  }

  function save() {
    // save and ignore return to avoid unused var warning
    saveFromColors(customName || undefined, palette);
    setCustomName("");
  }

  return (
    <section className="py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Create</h2>
          <p className="text-white/70 mt-1">
            Lock swatches, shuffle, and pick harmony modes to craft a palette.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-white/5 p-1">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  mode === m ? "bg-white/15 text-white nx-glow" : "text-white/70 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={shuffle}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            title="Shuffle"
          >
            <Dice1 className="size-4" />
            Shuffle
          </button>
        </div>
      </div>

      {/* swatches */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {palette.map((hex, i) => (
          <Swatch
            key={`${hex}-${i}`}
            hex={hex}
            locked={locks[i]}
            onToggleLock={() => toggleLock(i)}
            onCopy={() => setColor(i, hex)}
          />
        ))}
      </div>

      {/* save bar */}
      <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/70">Name (optional):</span>
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g., Orion Dawn"
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-white/25"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSeed(randomHex())}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20"
          >
            <Sparkles className="size-4" />
            New Seed
          </button>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-black font-semibold nx-glow"
          >
            <Save className="size-4" />
            Save Palette
          </button>
        </div>
      </div>
    </section>
  );
}
