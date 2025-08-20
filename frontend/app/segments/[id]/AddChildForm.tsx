"use client";

import { useState } from "react";
import { createSegment } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddChildForm({ parentId }: { parentId: number }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      // 새 자식 상세로 전환
      router.push(`/segments/${saved.id}`);
    } catch (e: any) {
      setErr(e?.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2 mt-4">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md p-2"
          placeholder="새 자식 세그먼트 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {err && <div className="text-red-500 text-sm">{err}</div>}
    </form>
  );
}
