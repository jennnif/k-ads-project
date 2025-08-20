"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMessages, type Message } from "@/lib/api";

export default function MessagesOfCampaign({ campaignId }: { campaignId: number }) {
  const [items, setItems] = useState<Message[]>([]);
  useEffect(() => {
    listMessages({ campaignId }).then(setItems).catch(()=>setItems([]));
  }, [campaignId]);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Link href="/messages/new" className="border rounded-md px-3 py-2">새 메시지</Link>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">제목</th><th className="p-2 text-left">타입</th><th className="p-2 text-left">상태</th><th className="p-2"></th></tr>
          </thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.id}</td>
                <td className="p-2">{m.title}</td>
                <td className="p-2">{m.type}</td>
                <td className="p-2">{m.status}</td>
                <td className="p-2"><Link className="text-blue-600 hover:underline" href={`/messages/${m.id}`}>보기</Link></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">메시지가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
