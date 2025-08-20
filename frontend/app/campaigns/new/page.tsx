"use client";

import { useEffect, useState } from "react";
import { createCampaign, type Campaign, type Segment } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export default function NewCampaignPage() {
  const router = useRouter();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [form, setForm] = useState({
    name: "",
    status: "DRAFT",
    budget: "100000",
    startDate: new Date().toISOString().slice(0,10),
    endDate: new Date().toISOString().slice(0,10),
    segmentId: "",
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
      const saved = await createCampaign({
        name: form.name.trim(),
        status: form.status as Campaign["status"],
        budget: String(form.budget),
        startDate: form.startDate,
        endDate: form.endDate,
        segmentId: Number(form.segmentId),
      } as any);
      router.push(`/campaigns/${saved.id}`);
    } catch (e: any) {
      setErr(e?.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">새 캠페인</h1>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">이름</label>
          <input className="w-full border rounded-md p-2"
                 value={form.name}
                 onChange={(e)=>setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">상태</label>
          <select className="w-full border rounded-md p-2"
                  value={form.status}
                  onChange={(e)=>setForm({...form, status: e.target.value})}>
            <option>DRAFT</option><option>ACTIVE</option><option>PAUSED</option><option>ENDED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">예산(원)</label>
          <input className="w-full border rounded-md p-2" type="number" min="0"
                 value={form.budget}
                 onChange={(e)=>setForm({...form, budget: e.target.value})}/>
        </div>
        <div>
          <label className="block text-sm mb-1">시작일</label>
          <input className="w-full border rounded-md p-2" type="date"
                 value={form.startDate}
                 onChange={(e)=>setForm({...form, startDate: e.target.value})}/>
        </div>
        <div>
          <label className="block text-sm mb-1">종료일</label>
          <input className="w-full border rounded-md p-2" type="date"
                 value={form.endDate}
                 onChange={(e)=>setForm({...form, endDate: e.target.value})}/>
        </div>
        <div>
          <label className="block text-sm mb-1">세그먼트</label>
          <select className="w-full border rounded-md p-2"
                  value={form.segmentId}
                  onChange={(e)=>setForm({...form, segmentId: e.target.value})}>
            <option value="">선택…</option>
            {segments.map(s => <option key={s.id} value={s.id}>[{s.id}] {s.name}</option>)}
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
