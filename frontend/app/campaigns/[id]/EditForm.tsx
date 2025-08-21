"use client";

import { useEffect, useState } from "react";
import { updateCampaign, type Campaign, type Segment } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export default function EditForm({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [form, setForm] = useState({
    name: campaign.name,
    status: campaign.status,
    budget: campaign.budget,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    segmentId: String(campaign.segmentId),
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/segments`, { cache: "no-store" })
      .then(r => r.json()).then(setSegments).catch(()=>setSegments([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim()) return setErr("이름을 입력해 주세요.");
    if (!form.segmentId) return setErr("세그먼트를 선택해 주세요.");
    if (form.endDate < form.startDate) return setErr("기간이 올바르지 않습니다.");
    try {
      setLoading(true);
      await updateCampaign(campaign.id, {
        name: form.name.trim(),
        status: form.status as Campaign["status"],
        budget: String(form.budget),
        startDate: form.startDate,
        endDate: form.endDate,
        segmentId: Number(form.segmentId),
      } as any);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm mb-1 text-white">이름</label>
        <input className="w-full border rounded-md p-2 text-white"
               value={form.name}
               onChange={(e)=>setForm({...form, name: e.target.value})}/>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white">상태</label>
        <select className="w-full border rounded-md p-2 text-white"
                value={form.status}
                onChange={(e)=>setForm({...form, status: e.target.value})}>
          <option className="text-black">DRAFT</option><option className="text-black">ACTIVE</option><option className="text-black">PAUSED</option><option className="text-black">ENDED</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white">예산(원)</label>
        <input type="number" className="w-full border rounded-md p-2 text-white"
               value={form.budget}
               onChange={(e)=>setForm({...form, budget: e.target.value})}/>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white">시작일</label>
        <input type="date" className="w-full border rounded-md p-2 text-white"
               value={form.startDate}
               onChange={(e)=>setForm({...form, startDate: e.target.value})}/>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white">종료일</label>
        <input type="date" className="w-full border rounded-md p-2 text-white"
               value={form.endDate}
               onChange={(e)=>setForm({...form, endDate: e.target.value})}/>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white">세그먼트</label>
        <select className="w-full border rounded-md p-2 text-white"
                value={form.segmentId}
                onChange={(e)=>setForm({...form, segmentId: e.target.value})}>
          {segments.map(s => <option key={s.id} value={s.id} className="text-black">[{s.id}] {s.name}</option>)}
        </select>
      </div>
      {err && <div className="md:col-span-2 text-red-300 text-sm">{err}</div>}
      <div className="md:col-span-2 flex justify-center">
        <button type="submit" disabled={loading}
                className="px-4 py-2 rounded-md bg-black text-white border-2 border-white disabled:opacity-50">
          {loading ? "저장 중..." : "수정 저장"}
        </button>
      </div>
    </form>
  );
}
