import { Link, Route, Routes } from "react-router-dom";
import HealthPage from "./pages/HealthPage";
import SegmentList from "./pages/SegmentList";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <h1>K-ADS Frontend</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Health</Link>
          <Link to="/segments">Segments</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HealthPage />} />
          <Route path="/segments" element={<SegmentList />} />
        </Routes>
      </main>
    </div>
  );
}
