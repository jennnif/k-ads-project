import { useEffect, useState } from "react";
import { getHealth } from "../api/healthApi";

export default function HealthPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHealth()
      .then(setData)
      .catch((e) => setError(e?.message || "에러"));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>서버 Health 체크</h2>
      {error && <p style={{ color: "crimson" }}>오류: {error}</p>}
      <pre>{data ? JSON.stringify(data, null, 2) : "로딩 중..."}</pre>
    </div>
  );
}
