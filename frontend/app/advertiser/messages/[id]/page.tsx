import { getMessage } from "@/lib/api";
import EditForm from "./EditForm";
import DeleteButton from "./DeleteButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdvertiserMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const messageId = Number(id);
  const m = await getMessage(messageId);
  if (!m) return <div className="p-6">메시지를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/advertiser/messages" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{m.title}</h1>
            <div className="text-sm text-gray-500">ID: {m.id} · 타입: {m.type} · 상태: {m.status} · 캠페인: {m.campaignId}</div>
          </div>
        </div>
        <button 
          type="submit" 
          form="edit-form"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          수정완료
        </button>
      </div>

      <section className="border rounded-md p-4 bg-white">
        <div className="text-xs text-gray-500 mb-1">미리보기</div>
        <div className="whitespace-pre-wrap text-black">{m.content}</div>
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">수정</h2>
        <EditForm message={m} />
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">삭제</h2>
        <DeleteButton id={m.id} />
      </section>
    </div>
  );
}
