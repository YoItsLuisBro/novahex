import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { Create } from "./pages/Create";
import { Saved } from "./pages/Saved";
import { Starfield } from "./components/Starfield";

export default function App() {
  return (
    <div className="relative min-h-dvh nx-sky">
      {/* animated starfield */}
      <Starfield />
      {/* content */}
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
