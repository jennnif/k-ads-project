import { getMessage } from "@/lib/api";
import EditForm from "./EditForm";
import DeleteButton from "./DeleteButton";

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const m = await getMessage(id);
  if (!m) return <div className="p-6">메시지를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{m.title}</h1>
        <div className="text-sm text-gray-500">ID: {m.id} · 타입: {m.type} · 상태: {m.status} · 캠페인: {m.campaignId}</div>
      </div>

      <section className="border rounded-md p-4 bg-gray-50">
        <div className="text-xs text-gray-500 mb-1">미리보기</div>
        <div className="whitespace-pre-wrap">{m.content}</div>
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
