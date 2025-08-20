"use client";

import { useEffect, useState } from "react";
import { createSegment, type Segment } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewSegmentPage() {
  const router = useRouter();
  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
    fetch(`${base}/api/admin/segments`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setAllSegments)
      .catch((e) => setErr(e?.message || "목록 불러오기 실패"));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) {
      setErr("이름을 입력해 주세요.");
      return;
    }
    try {
      setLoading(true);
      const saved = await createSegment({ name: name.trim(), parentId });
      router.push(`/segments/${saved.id}`);
    } catch (e: any) {
      setErr(e?.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">새 세그먼트 생성</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">세그먼트 이름</label>
          <input
            className="w-full border rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 온라인 쇼핑"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">부모 세그먼트 (선택)</label>
          <select
            className="w-full border rounded-md p-2"
            value={parentId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setParentId(v === "" ? null : Number(v));
            }}
          >
            <option value="">(없음, 루트)</option>
            {allSegments.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.id}] {s.name}
              </option>
            ))}
          </select>
        </div>

        {err && <div className="text-red-500 text-sm">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          {loading ? "생성 중..." : "생성"}
        </button>
      </form>
    </div>
  );
}
