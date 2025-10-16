// src/components/PaletteCard.tsx
import { useState } from "react";
import { Heart, Share2, Trash2 } from "lucide-react";
import type { Palette } from "../store/palettes";
import { usePalettes } from "../store/palettes";

type Props = {
  p: Palette;
  /** If provided, the card uses this to "save/like" instead of toggling store by id */
  onLike?: (p: Palette) => Promise<void> | void;
  /** If provided, shows a remove button that calls this handler (used on Saved) */
  onRemove?: (p: Palette) => Promise<void> | void;
};

export function PaletteCard({ p, onLike, onRemove }: Props) {
  const toggleLike = usePalettes((s) => s.toggleLike);
  const [localLiked, setLocalLiked] = useState(!!p.liked);

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
    // optional confirm, remove if no longer want a dialog
    const ok = confirm("Remove this pallet from saved?");
    if (!ok) return;
    await onRemove(p);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="grid grid-cols-5">
        {p.colors.map((c) => (
          <div
            key={c.hex}
            className="h-20"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="text-sm text-white/80">
          {p.name ?? "Untitled"} • {new Date(p.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${
              liked
                ? "bg-pink-500/20 text-pink-200"
                : "bg-white/10 text-white/80"
            }`}
            title={liked ? "Saved" : "Save to library"}
          >
            <Heart className={`size-4 ${liked ? "fill-pink-500" : ""}`} />
            {liked ? "Saved" : "Save"}
          </button>

          {onRemove && (
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-white/10 text-white/80 hover:bg-white/15"
              title="Remove from saved"
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          )}

          <button
            onClick={async () => {
              const url = `${location.origin}/explore`;
              try {
                await navigator.clipboard.writeText(url);
              } catch {/* Empty block */}
            }}
            className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-white/10 text-white/80"
            title="Copy link"
          >
            <Share2 className="size-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
