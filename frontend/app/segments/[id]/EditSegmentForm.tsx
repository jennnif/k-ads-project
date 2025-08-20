"use client";

import { useEffect, useState } from "react";
import { updateSegment, type Segment } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditSegmentForm({ segment }: { segment: Segment }) {
  const router = useRouter();
  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [name, setName] = useState(segment.name);
  const [parentId, setParentId] = useState<number | null>(segment.parentId);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
    fetch(`${base}/api/admin/segments`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Segment[]) => {
        // 자기 자신을 부모 후보에서 제외
        setAllSegments(data.filter((s) => s.id !== segment.id));
      })
      .catch((e) => setErr(e?.message || "목록 불러오기 실패"));
  }, [segment.id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) {
      setErr("이름을 입력해 주세요.");
      return;
    }
    try {
      setLoading(true);
      await updateSegment(segment.id, { name: name.trim(), parentId });
      // 성공 후 현재 상세 새로고침
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">세그먼트 이름</label>
        <input
          className="w-full border rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">부모 세그먼트</label>
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
        {loading ? "수정 중..." : "수정 저장"}
      </button>
    </form>
  );
}
