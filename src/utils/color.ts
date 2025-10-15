// src/utils/color.ts

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

export function randomHex(): string {
  const v = randInt(0xffffff + 1);
  return `#${v.toString(16).padStart(6, "0")}`.toUpperCase();
}

export function hexToRgb(hex: string): RGB {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex: ${hex}`);
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((n) => clamp(n, 0, 255).toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1:
        h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
        break;
      case g1:
        h = (b1 - r1) / d + 2;
        break;
      case b1:
        h = (r1 - g1) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = ((h % 360) + 360) % 360;
  const ss = clamp(s / 100);
  const ll = clamp(l / 100);
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return { r: v, g: v, b: v };
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const r = Math.round(hue2rgb(p, q, hh / 360 + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hh / 360) * 255);
  const b = Math.round(hue2rgb(p, q, hh / 360 - 1 / 3) * 255);
  return { r, g, b };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function rotateHue(hex: string, deg: number): string {
  const hsl = hexToHsl(hex);
  hsl.h = (hsl.h + deg) % 360;
  if (hsl.h < 0) hsl.h += 360;
  return hslToHex(hsl);
}

export function setLightness(hex: string, l: number): string {
  const hsl = hexToHsl(hex);
  hsl.l = clamp(l / 100) * 100;
  return hslToHex(hsl);
}

export function setSaturation(hex: string, s: number): string {
  const hsl = hexToHsl(hex);
  hsl.s = clamp(s / 100) * 100;
  return hslToHex(hsl);
}

/** WCAG relative luminance */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** WCAG contrast ratio between two colors */
export function contrastRatio(a: string, b: string): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** smart text color (#000 or #fff) based on contrast */
export function idealTextOn(hex: string): "#000000" | "#FFFFFF" {
  const white = contrastRatio(hex, "#FFFFFF");
  const black = contrastRatio(hex, "#000000");
  return white >= black ? "#FFFFFF" : "#000000";
}

export type HarmonyMode =
  | "Analogous"
  | "Complementary"
  | "Triad"
  | "Tetrad"
  | "Monochrome";

/** Generate a 5-color palette for a mode based on a base hex */
export function harmonyFrom(base: string, mode: HarmonyMode): string[] {
  const b = base || randomHex();
  switch (mode) {
    case "Analogous": {
      const hsl = hexToHsl(b);
      const steps = [-30, -10, 0, 20, 40];
      return steps.map((d) => hslToHex({ h: hsl.h + d, s: hsl.s, l: hsl.l }));
    }
    case "Complementary": {
      const hsl = hexToHsl(b);
      const h = hsl.h;
      const comp = (h + 180) % 360;
      return [
        hslToHex({ h: h - 20, s: hsl.s, l: hsl.l }),
        hslToHex({ h, s: hsl.s, l: hsl.l }),
        hslToHex({ h: h + 20, s: hsl.s, l: hsl.l }),
        hslToHex({ h: comp - 15, s: hsl.s, l: hsl.l }),
        hslToHex({ h: comp + 15, s: hsl.s, l: hsl.l }),
      ];
    }
    case "Triad": {
      const hsl = hexToHsl(b);
      const set = [0, 120, 240].map((d) => (hsl.h + d) % 360);
      return [
        hslToHex({ h: set[0] - 10, s: hsl.s, l: hsl.l }),
        hslToHex({ h: set[0] + 10, s: hsl.s, l: hsl.l }),
        hslToHex({ h: set[1], s: hsl.s, l: hsl.l }),
        hslToHex({ h: set[2] - 10, s: hsl.s, l: hsl.l }),
        hslToHex({ h: set[2] + 10, s: hsl.s, l: hsl.l }),
      ];
    }
    case "Tetrad": {
      const hsl = hexToHsl(b);
      const set = [0, 90, 180, 270].map((d) => (hsl.h + d) % 360);
      return set
        .concat([hsl.h + 45])
        .slice(0, 5)
        .map((h) => hslToHex({ h, s: hsl.s, l: hsl.l }));
    }
    case "Monochrome": {
      const hsl = hexToHsl(b);
      const ls = [20, 35, 50, 65, 80];
      return ls.map((l) => hslToHex({ h: hsl.h, s: hsl.s * 0.2 + 15, l }));
    }
  }
}
