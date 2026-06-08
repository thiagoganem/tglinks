import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RedesPage, CookiePolicyPage } from "./pages";
import { DashboardPage } from "./pages/DashboardPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/redes" element={<RedesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="*" element={<Navigate to="/redes" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
