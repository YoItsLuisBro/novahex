import { create } from "zustand";

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
};

export const usePalettes = create<State>((set) => ({
  palettes: [],
  add: (p) => set((s) => ({ palettes: [p, ...s.palettes] })),
  like: (id, liked = true) =>
    set((s) => ({
      palettes: s.palettes.map((p) => (p.id === id ? { ...p, liked } : p)),
    })),
}));
