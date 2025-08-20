"use client";

import { useState } from "react";
import { deleteSegment } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DeleteSegmentButton({ id }: { id: number }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm("정말 삭제할까요? (자식이 있으면 삭제되지 않습니다)")) return;
    setErr(null);
    try {
      setLoading(true);
      await deleteSegment(id);
      router.push("/segments"); // 삭제 후 목록으로
    } catch (e: any) {
      // 409(자식 존재) 등 메시지 표시
      setErr(e?.message || "삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onDelete}
        disabled={loading}
        className="px-3 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
      >
        {loading ? "삭제 중..." : "삭제"}
      </button>
      {err && <div className="text-red-500 text-sm">{err}</div>}
    </div>
  );
}
