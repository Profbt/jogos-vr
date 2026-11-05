import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { GamePage } from "./pages/GamePage";
import { CreatePage } from "./pages/CreatePage";
import { AboutPage } from "./pages/AboutPage";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jogo/:slug" element={<GamePage />} />
        <Route path="/criar" element={<CreatePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
