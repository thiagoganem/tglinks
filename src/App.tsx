import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RedesPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/redes" element={<RedesPage />} />
        <Route path="*" element={<Navigate to="/redes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
