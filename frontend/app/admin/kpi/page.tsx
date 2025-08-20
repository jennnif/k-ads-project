"use client";
import { useEffect, useState } from "react";
import { getKpiDashboard, getCampaignsPerformance, type KpiDashboard, type CampaignPerformance } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { BarChart3, TrendingUp, Download } from "lucide-react";
import Link from "next/link";

export default function AdminKpiPage() {
  const [kpiData, setKpiData] = useState<KpiDashboard | null>(null);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [kpiDashboard, performance] = await Promise.all([
        getKpiDashboard(),
        getCampaignsPerformance()
      ]);
      setKpiData(kpiDashboard);
      setCampaignPerformance(performance);
    } catch (error) {
      console.error("Failed to load KPI data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <PageHeader 
        title="KPI 데이터 표출" 
        tabs={
          <div className="flex items-center justify-between rounded-full bg-white border shadow-sm px-3 py-2">
            <div className="flex gap-6 text-sm">
              <Link href="/admin/segments" className="text-black hover:text-gray-700">세그먼트 관리</Link>
              <Link href="/admin/kpi" className="font-semibold text-black">KPI 데이터 표출</Link>
            </div>
            {/* CSV 다운로드 버튼 제거 */}
          </div>
        }
      />

      {/* KPI 데이터 정의 카드들 */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-blue-600 mb-2">
            <TrendingUp size={32} className="mx-auto"/>
          </div>
          <div className="text-2xl font-bold text-black">
            {kpiData?.totalSent.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-black">총 발송 성공 수</div>
          <div className="text-xs text-blue-600 mt-1">CTR 25.4%</div>
        </Card>

        <Card className="text-center p-4">
          <div className="text-green-600 mb-2">
            <BarChart3 size={32} className="mx-auto"/>
          </div>
          <div className="text-2xl font-bold text-black">
            {kpiData?.totalClicks.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-black">총 링크 클릭 수</div>
          <div className="text-xs text-green-600 mt-1">CVR 25.7%</div>
        </Card>

        <Card className="text-center p-4">
          <div className="text-purple-600 mb-2">
            <div className="w-8 h-8 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              🎯
            </div>
          </div>
          <div className="text-2xl font-bold text-black">
            {kpiData?.totalConversions.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-black">총 목표 전환 수</div>
          <div className="text-xs text-purple-600 mt-1">CTR 25.4% | CVR 25.7%</div>
        </Card>

        <Card className="text-center p-4">
          <div className="text-orange-600 mb-2">
            <div className="w-8 h-8 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              ₩
            </div>
          </div>
          <div className="text-2xl font-bold text-black">
            ₩{Number(kpiData?.totalCost || 0).toLocaleString()}
          </div>
          <div className="text-sm text-black">총 비용</div>
          <div className="text-xs text-orange-600 mt-1">CPM ₩221.7</div>
        </Card>
      </div>

      {/* 캠페인별 성과 데이터 */}
      <Card>
        <div className="px-5 py-3 border-b flex items-center gap-2">
          <BarChart3 size={20} className="text-black"/>
          <h3 className="font-semibold text-black">캠페인별 성과 데이터</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black">캠페인명</th>
                <th className="px-4 py-3 text-left font-medium text-black">세그먼트</th>
                <th className="px-4 py-3 text-left font-medium text-black">채널</th>
                <th className="px-4 py-3 text-left font-medium text-black">예산</th>
                <th className="px-4 py-3 text-left font-medium text-black">기간</th>
                <th className="px-4 py-3 text-right font-medium text-black">발송 성공</th>
                <th className="px-4 py-3 text-right font-medium text-black">클릭 수</th>
                <th className="px-4 py-3 text-right font-medium text-black">전환 수</th>
                <th className="px-4 py-3 text-right font-medium text-black">비용</th>
                <th className="px-4 py-3 text-right font-medium text-black">CTR</th>
                <th className="px-4 py-3 text-right font-medium text-black">CVR</th>
                <th className="px-4 py-3 text-right font-medium text-black">CPM</th>
              </tr>
            </thead>
            <tbody>
              {campaignPerformance.map((campaign, index) => {
                const ctr = campaign.sent > 0 ? ((campaign.clicks / campaign.sent) * 100).toFixed(1) + "%" : "0%";
                const cvr = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) + "%" : "0%";
                const cpm = campaign.sent > 0 ? `₩${(Number(campaign.cost) / campaign.sent * 1000).toFixed(1)}` : "₩0";
                
                return (
                  <tr key={campaign.campaignId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-black">{campaign.campaignName}</td>
                    <td className="px-4 py-3 text-black">세그먼트</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        혼합
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black">₩{Number(campaign.cost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-black">2024.01.01~12.31</td>
                    <td className="px-4 py-3 text-right font-medium text-black">{campaign.sent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-black">{campaign.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-black">{campaign.conversions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-black">₩{Number(campaign.cost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">{ctr}</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">{cvr}</td>
                    <td className="px-4 py-3 text-right text-black">{cpm}</td>
                  </tr>
                );
              })}
              {campaignPerformance.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-black">
                    캠페인 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <div className="text-black">로딩 중...</div>
        </div>
      )}
    </div>
  );
}
