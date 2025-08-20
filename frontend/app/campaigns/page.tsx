"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCampaigns, type Campaign } from "@/lib/api";

export default function CampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [segmentId, setSegmentId] = useState("");

  const fetchList = async () => {
    const params: any = {};
    if (q.trim()) params.q = q.trim();
    if (status) params.status = status;
    if (from && to) { params.from = from; params.to = to; }
    if (segmentId) params.segmentId = Number(segmentId);
    setItems(await listCampaigns(params));
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">캠페인</h1>
        <Link href="/campaigns/new" className="px-3 py-2 rounded-md bg-black text-white">새 캠페인</Link>
      </div>

      {/* 필터 */}
      <div className="grid md:grid-cols-5 gap-2">
        <input className="border rounded-md p-2" placeholder="검색(이름)"
               value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded-md p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">상태(전체)</option>
          <option value="DRAFT">DRAFT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PAUSED">PAUSED</option>
          <option value="ENDED">ENDED</option>
        </select>
        <input type="date" className="border rounded-md p-2" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" className="border rounded-md p-2" value={to} onChange={(e)=>setTo(e.target.value)} />
        <input className="border rounded-md p-2" placeholder="segmentId"
               value={segmentId} onChange={(e)=>setSegmentId(e.target.value)} />
      </div>
      <div>
        <button onClick={fetchList} className="border rounded-md px-3 py-2">적용</button>
        <button onClick={() => { setQ(""); setStatus(""); setFrom(""); setTo(""); setSegmentId(""); setTimeout(fetchList, 0); }}
                className="ml-2 border rounded-md px-3 py-2">초기화</button>
      </div>

      {/* 리스트 */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">이름</th>
              <th className="p-2 text-left">상태</th>
              <th className="p-2 text-left">예산</th>
              <th className="p-2 text-left">기간</th>
              <th className="p-2 text-left">Segment</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2 font-medium"><Link className="hover:underline" href={`/campaigns/${c.id}`}>{c.name}</Link></td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{Number(c.budget).toLocaleString()} 원</td>
                <td className="p-2">{c.startDate} ~ {c.endDate}</td>
                <td className="p-2">{c.segmentId}</td>
                <td className="p-2"><Link className="text-blue-600 hover:underline" href={`/campaigns/${c.id}`}>보기</Link></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
