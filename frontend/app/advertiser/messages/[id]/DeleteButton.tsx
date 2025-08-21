"use client";

import { useState } from "react";
import { deleteMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말로 이 메시지를 삭제하시겠습니까?")) return;
    
    try {
      setLoading(true);
      await deleteMessage(id);
      alert("메시지가 삭제되었습니다.");
      router.push("/advertiser/messages");
    } catch (e: any) {
      alert(e?.message || "삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "삭제 중..." : "메시지 삭제"}
    </button>
  );
}
