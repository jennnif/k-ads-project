"use client";

import { useEffect, useState } from "react";
import { createMessage, type Message } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export default function NewMessagePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [form, setForm] = useState({
    campaignId: "", type: "SMS", title: "", content: "", status: "DRAFT",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/campaigns`, { cache: "no-store" })
      .then(r => r.json()).then(setCampaigns).catch(()=>setCampaigns([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.campaignId) return setErr("캠페인을 선택해 주세요.");
    if (!form.title.trim()) return setErr("제목을 입력해 주세요.");
    if (!form.content.trim()) return setErr("내용을 입력해 주세요.");
    try {
      setLoading(true);
      const saved = await createMessage({
        campaignId: Number(form.campaignId),
        type: form.type as Message["type"],
        title: form.title.trim(),
        content: form.content.trim(),
        status: form.status as Message["status"],
      } as any);
      router.push(`/messages/${saved.id}`);
    } catch (e: any) {
      setErr(e?.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">새 메시지</h1>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">캠페인</label>
          <select className="w-full border rounded-md p-2"
                  value={form.campaignId}
                  onChange={(e)=>setForm({...form, campaignId: e.target.value})}>
            <option value="">선택…</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>[{c.id}] {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">타입</label>
          <select className="w-full border rounded-md p-2"
                  value={form.type}
                  onChange={(e)=>setForm({...form, type: e.target.value})}>
            <option>SMS</option><option>MMS</option><option>RCS</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">제목</label>
          <input className="w-full border rounded-md p-2"
                 value={form.title}
                 onChange={(e)=>setForm({...form, title: e.target.value})} maxLength={100}/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">내용</label>
          <textarea className="w-full border rounded-md p-2 min-h-[160px]"
                    value={form.content}
                    onChange={(e)=>setForm({...form, content: e.target.value})} maxLength={2000}/>
        </div>
        <div>
          <label className="block text-sm mb-1">상태</label>
          <select className="w-full border rounded-md p-2"
                  value={form.status}
                  onChange={(e)=>setForm({...form, status: e.target.value})}>
            <option>DRAFT</option><option>READY</option><option>SENT</option><option>PAUSED</option>
          </select>
        </div>

        {err && <div className="md:col-span-2 text-red-500 text-sm">{err}</div>}
        <div className="md:col-span-2">
          <button type="submit" disabled={loading}
                  className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50">
            {loading ? "생성 중..." : "생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
