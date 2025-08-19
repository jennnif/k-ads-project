import { useEffect, useState } from "react";
import { getParentSegments } from "../api/segmentApi";

export default function SegmentList() {
  const [segments, setSegments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getParentSegments()
      .then(setSegments)
      .catch((e) => setError(e?.message || "에러"));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>부모 세그먼트 목록</h2>
      {error && <p style={{ color: "crimson" }}>오류: {error}</p>}
      <ul>
        {segments.map((seg) => (
          <li key={seg.id}>
            #{seg.id} — {seg.name}
          </li>
        ))}
      </ul>
      {segments.length === 0 && !error && <p>데이터가 없습니다.</p>}
    </div>
  );
}
