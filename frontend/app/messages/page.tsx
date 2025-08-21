"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listMessages, type Message } from "@/lib/api";

export default function MessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [campaignId, setCampaignId] = useState("");

  const load = async () => {
    const p: any = {};
    if (q.trim()) p.q = q.trim();
    if (type) p.type = type;
    if (status) p.status = status;
    if (campaignId) p.campaignId = Number(campaignId);
    setItems(await listMessages(p));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">광고 메시지</h1>
        <Link href="/advertiser/messages/new" className="px-3 py-2 rounded-md bg-black text-white">새 메시지</Link>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded-md p-2" placeholder="제목 검색" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="border rounded-md p-2" value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="">타입(전체)</option>
          <option>SMS</option><option>MMS</option><option>RCS</option>
        </select>
        <select className="border rounded-md p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">상태(전체)</option>
          <option>DRAFT</option><option>READY</option><option>SENT</option><option>PAUSED</option>
        </select>
        <input className="border rounded-md p-2" placeholder="campaignId" value={campaignId} onChange={(e)=>setCampaignId(e.target.value)} />
      </div>
      <div>
        <button className="border rounded-md px-3 py-2" onClick={load}>적용</button>
        <button className="ml-2 border rounded-md px-3 py-2" onClick={()=>{ setQ(""); setType(""); setStatus(""); setCampaignId(""); setTimeout(load,0); }}>초기화</button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">제목</th>
              <th className="p-2 text-left">타입</th>
              <th className="p-2 text-left">상태</th>
              <th className="p-2 text-left">캠페인</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.id}</td>
                <td className="p-2 font-medium"><Link className="hover:underline" href={`/advertiser/messages/${m.id}`}>{m.title}</Link></td>
                <td className="p-2">{m.type}</td>
                <td className="p-2">{m.status}</td>
                <td className="p-2">{m.campaignId}</td>
                <td className="p-2"><Link className="text-blue-600 hover:underline" href={`/advertiser/messages/${m.id}`}>보기</Link></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
