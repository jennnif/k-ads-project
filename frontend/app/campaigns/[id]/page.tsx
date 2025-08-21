import { getCampaign } from "@/lib/api";
import EditForm from "./EditForm";
import DeleteButton from "./DeleteButton";
import MessagesOfCampaign from "./MessagesOfCampaign";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaignId = Number(id);
  const c = await getCampaign(campaignId);
  if (!c) return <div className="p-6">캠페인을 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{c.name}</h1>
        <div className="text-sm text-gray-500">
          ID: {c.id} · 상태: {c.status} · 예산: {Number(c.budget).toLocaleString()} 원
        </div>
        <div className="text-sm text-gray-500">
          기간: {c.startDate} ~ {c.endDate} · Segment: {c.segmentId}
        </div>
      </div>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">수정</h2>
        <EditForm campaign={c} />
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">메시지</h2>
        <MessagesOfCampaign campaignId={c.id} />
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">삭제</h2>
        <DeleteButton id={c.id} />
      </section>
    </div>
  );
}
