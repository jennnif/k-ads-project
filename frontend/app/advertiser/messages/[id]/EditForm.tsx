"use client";

import { useEffect, useState } from "react";
import { updateMessage, type Message } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export default function EditForm({ message }: { message: Message }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [form, setForm] = useState({
    campaignId: String(message.campaignId),
    type: message.type,
    title: message.title,
    content: message.content,
    status: message.status,
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
      await updateMessage(message.id, {
        campaignId: Number(form.campaignId),
        type: form.type as Message["type"],
        title: form.title.trim(),
        content: form.content.trim(),
        status: form.status as Message["status"],
      } as any);
      alert("수정이 완료되었습니다!");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="edit-form" onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm mb-1">캠페인</label>
        <select className="w-full border rounded-md p-2 bg-white text-black"
                value={form.campaignId}
                onChange={(e)=>setForm({...form, campaignId: e.target.value})}>
          {campaigns.map(c => <option key={c.id} value={c.id}>[{c.id}] {c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">타입</label>
        <select className="w-full border rounded-md p-2 bg-white text-black"
                value={form.type}
                onChange={(e)=>setForm({...form, type: e.target.value})}>
          <option>SMS</option><option>MMS</option><option>RCS</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">제목</label>
        <input className="w-full border rounded-md p-2" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} maxLength={100}/>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">내용</label>
        <textarea className="w-full border rounded-md p-2 min-h-[160px]" value={form.content} onChange={(e)=>setForm({...form, content: e.target.value})} maxLength={2000}/>
      </div>
      <div>
        <label className="block text-sm mb-1">상태</label>
        <select className="w-full border rounded-md p-2 bg-white text-black"
                value={form.status}
                onChange={(e)=>setForm({...form, status: e.target.value})}>
          <option>DRAFT</option><option>READY</option><option>SENT</option><option>PAUSED</option>
        </select>
      </div>
      {err && <div className="md:col-span-2 text-red-500 text-sm">{err}</div>}
    </form>
  );
}
