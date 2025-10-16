import { useState } from "react";
import { Heart, Share2, Trash2, Copy, Check } from "lucide-react";
import { usePalettes, type Palette } from "../store/palettes";

type Props = {
  p: Palette;
  onLike?: (p: Palette) => Promise<void> | void; // Explore save
  onRemove?: (p: Palette) => Promise<void> | void; // Saved remove
  dense?: boolean; // NEW: compact mode
};

export function PaletteCard({ p, onLike, onRemove, dense = false }: Props) {
  const toggleLike = usePalettes((s) => s.toggleLike);
  const [localLiked, setLocalLiked] = useState(!!p.liked);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const liked = onLike ? localLiked : !!p.liked;

  async function handleLike() {
    if (onLike) {
      await onLike(p);
      setLocalLiked(true);
    } else {
      toggleLike(p.id);
    }
  }

  async function handleRemove() {
    if (!onRemove) return;
    const ok = confirm("Remove this palette from Saved?");
    if (ok) await onRemove(p);
  }

  async function copyHex(hex: string, idx: number) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 900);
    } catch {
      /* noop */
    }
  }

  const swatchH = dense ? "h-12 sm:h-14 md:h-16" : "h-16 sm:h-20 md:h-24";
  const chipPad = dense ? "px-1.5 py-0.5" : "px-1.5 py-1";
  const chipIconCls = dense ? "w-3 h-3" : "w-3.5 h-3.5";
  const chipText = dense ? "text-[9.5px]" : "text-[10px]";
  const metaPad = dense ? "px-2 py-1.5" : "px-3 py-2";
  const metaText = dense ? "text-xs" : "text-sm";
  const btnText = dense ? "text-xs" : "text-sm";
  const btnPad = dense ? "px-2 py-1" : "px-2 py-1";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Vertical stack of 5 swatches; chip is INSIDE each swatch (bottom-left) */}
      <div className="divide-y divide-white/10">
        {p.colors.map((c, i) => (
          <div
            key={`${c.hex}-${i}`}
            className={`relative ${swatchH}`}
            style={{ backgroundColor: c.hex }}
            title={c.hex}
          >
            <button
              onClick={() => copyHex(c.hex, i)}
              className={`absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md
                         ${chipPad} bg-black/60 hover:bg-black/70 text-white border border-white/20 shadow-sm
                         focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40`}
              title={`Copy ${c.hex}`}
              aria-label={`Copy ${c.hex}`}
            >
              {copiedIndex === i ? (
                <Check className={chipIconCls} strokeWidth={2.25} />
              ) : (
                <Copy className={chipIconCls} strokeWidth={2.25} />
              )}
              <span
                className={`font-mono ${chipText} leading-none tracking-tight`}
              >
                {c.hex}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Meta + actions */}
      <div
        className={`${metaPad} flex items-center justify-between border-t border-white/10`}
      >
        <div className={`${metaText} text-white/80`}>
          {p.name ?? "Untitled"} • {new Date(p.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1 ${btnText} ${btnPad} rounded-lg ${
              liked
                ? "bg-pink-500/20 text-pink-200"
                : "bg-white/10 text-white/80"
            }`}
            title={liked ? "Unlike" : "Save to library"}
            aria-label={liked ? "Unlike" : "Save to library"}
          >
            <Heart className={`size-4 ${liked ? "fill-pink-500" : ""}`} />
            <span className="hidden sm:inline">{liked ? "Liked" : "Save"}</span>
          </button>

          {onRemove && (
            <button
              onClick={handleRemove}
              className={`inline-flex items-center gap-1 ${btnText} ${btnPad} rounded-lg bg-white/10 text-white/80 hover:bg-white/15`}
              title="Remove from Saved"
              aria-label="Remove from Saved"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          )}

          <button
            onClick={async () => {
              const url = `${location.origin}/explore`;
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                /* noop */
              }
            }}
            className={`inline-flex items-center gap-1 ${btnText} ${btnPad} rounded-lg bg-white/10 text-white/80`}
            title="Copy link"
            aria-label="Copy link"
          >
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
