"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCampaign, type Campaign } from "@/lib/api";
import { ArrowLeft, Pencil, Trash2, Calendar, DollarSign, Users, Target } from "lucide-react";
import Link from "next/link";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        if (params.id) {
          const campaignData = await getCampaign(Number(params.id));
          setCampaign(campaignData);
        }
      } catch (error) {
        console.error("캠페인을 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-white">로딩 중...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center text-white">캠페인을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/campaigns/${campaign.id}`}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Pencil size={16} />
            수정
          </Link>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2">
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      </div>

      {/* Campaign Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white bg-opacity-90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">기본 정보</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-black">시작일: {campaign.startDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <span className="text-black">종료일: {campaign.endDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-black">예산: {Number(campaign.budget).toLocaleString()}원</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-black">세그먼트 ID: {campaign.segmentId}</span>
            </div>
          </div>
        </div>

        {/* Status & Performance */}
        <div className="bg-white bg-opacity-90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">상태 및 성과</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-yellow-600" />
              <span className="text-black">상태: {campaign.status}</span>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <div className="text-sm font-medium text-black">전환 목표</div>
              <div className="text-sm text-black">설정한 목표를 여기에 노출</div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Description */}
      <div className="bg-white bg-opacity-90 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-black mb-4">캠페인 설명</h2>
        <p className="text-black">
          {campaign.name} 캠페인의 상세 정보입니다. 세그먼트 {campaign.segmentId}를 대상으로 
          {campaign.startDate}부터 {campaign.endDate}까지 진행되며, 
          총 예산 {Number(campaign.budget).toLocaleString()}원으로 운영됩니다.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Link
          href="/advertiser/campaigns"
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
