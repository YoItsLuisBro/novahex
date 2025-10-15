import { Lock, Unlock, Copy, Check } from "lucide-react";
import { useState } from "react";
import { contrastRatio, idealTextOn } from "../utils/color";

type Props = {
  hex: string;
  locked?: boolean;
  onToggleLock?: () => void;
  onCopy?: () => void;
};

export function Swatch({ hex, locked, onToggleLock, onCopy }: Props) {
  const text = idealTextOn(hex);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 900);
    } catch {/* empty block */}
  }

  const crWhite = contrastRatio(hex, "#FFFFFF");
  const crBlack = contrastRatio(hex, "#000000");
  const aaPass = Math.max(crWhite, crBlack) >= 4.5;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden ring-1 ring-white/10"
      style={{ backgroundColor: hex }}
    >
      <div className="p-4 flex items-end justify-between h-28">
        <div className="flex flex-col">
          <span
            className="text-lg font-semibold tracking-wide"
            style={{ color: text }}
          >
            {hex}
          </span>
          <span
            className={`mt-0.5 inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
              aaPass ? "bg-white/25" : "bg-black/25"
            }`}
            style={{ color: text }}
            title={`Contrast vs white: ${crWhite.toFixed(
              2
            )}; vs black: ${crBlack.toFixed(2)}`}
          >
            {aaPass ? "AA+" : "Low contrast"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleLock}
            className="inline-flex items-center justify-center size-8 rounded-xl bg-black/25 hover:bg-black/35 transition"
            style={{ color: text }}
            title={locked ? "Unlock" : "Lock"}
          >
            {locked ? (
              <Lock className="size-4" />
            ) : (
              <Unlock className="size-4" />
            )}
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center size-8 rounded-xl bg-black/25 hover:bg-black/35 transition"
            style={{ color: text }}
            title="Copy hex"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
