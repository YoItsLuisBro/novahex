import { NavLink, Link } from "react-router-dom";
import { Rocket, Palette, Sparkles } from "lucide-react";

export function Header() {
  const link = "px-3 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition";
  const active = "bg-white/10 text-white nx-glow";
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 nx-glow">
            <Rocket className="size-4" />
          </span>
          <span className="font-semibold tracking-wide" style={{ fontFamily: "Space Grotesk, ui-sans-serif" }}>
            NovaHex
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/explore" className={({isActive}) => `${link} ${isActive?active:""}`}>
            <Palette className="inline size-4 mr-1.5" /> Explore
          </NavLink>
          <NavLink to="/create" className={({isActive}) => `${link} ${isActive?active:""}`}>
            <Sparkles className="inline size-4 mr-1.5" /> Create
          </NavLink>
          <NavLink to="/saved" className={({isActive}) => `${link} ${isActive?active:""}`}>Saved</NavLink>
        </nav>
      </div>
    </header>
  );
}
