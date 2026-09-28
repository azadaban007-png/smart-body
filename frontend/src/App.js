import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import GymDetailPage from "@/pages/GymDetailPage";
import RegisterGymPage from "@/pages/RegisterGymPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider>
      <CatalogProvider>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/gym/:slug" element={<GymDetailPage />} />
                <Route path="/register" element={<RegisterGymPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </MotionConfig>
      </CatalogProvider>
    </ThemeProvider>
  );
}

export default App;
