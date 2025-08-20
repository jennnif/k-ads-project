"use client";

import { deleteCampaign } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm("정말 삭제할까요?")) return;
    setErr(null);
    try {
      setLoading(true);
      await deleteCampaign(id);
      router.push("/campaigns");
    } catch (e: any) {
      setErr(e?.message || "삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button onClick={onDelete} disabled={loading}
              className="px-3 py-2 rounded-md bg-red-600 text-white disabled:opacity-50">
        {loading ? "삭제 중..." : "삭제"}
      </button>
      {err && <div className="text-red-500 text-sm">{err}</div>}
    </div>
  );
}
