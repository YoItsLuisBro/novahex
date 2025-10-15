import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Swatch = { hex: string };
export type Palette = {
  id: string;
  name?: string;
  colors: Swatch[];
  liked?: boolean;
  createdAt: number;
};

type State = {
  palettes: Palette[];
  add: (p: Palette) => void;
  like: (id: string, liked?: boolean) => void;
  remove: (id: string) => void;
  saveFromColors: (name: string | undefined, hexes: string[]) => Palette;
  toggleLike: (id: string) => void;
};

export const usePalettes = create<State>()(
  persist(
    (set) => ({
      palettes: [],
      add: (p) => set((s) => ({ palettes: [p, ...s.palettes] })),
      like: (id, liked = true) =>
        set((s) => ({
          palettes: s.palettes.map((p) => (p.id === id ? { ...p, liked } : p))
        })),
      toggleLike: (id) =>
        set((s) => ({
          palettes: s.palettes.map((p) =>
            p.id === id ? { ...p, liked: !p.liked } : p
          )
        })),
      remove: (id) =>
        set((s) => ({ palettes: s.palettes.filter((p) => p.id !== id) })),
      saveFromColors: (name, hexes) => {
        const p: Palette = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name,
          colors: hexes.map((h) => ({ hex: h })),
          createdAt: Date.now(),
          liked: false
        };
        set((s) => ({ palettes: [p, ...s.palettes] }));
        return p;
      }
    }),
    {
      name: "novahex-palettes",
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
