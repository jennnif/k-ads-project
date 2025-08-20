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
      {/* 서비스 핵심 가치 섹션 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-xl">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-3xl">🏅</div>
              <div>
                <div className="font-semibold">정확성과 신뢰성</div>
                <div className="text-sm text-gray-500">모든 광고 데이터와 성과를 정확히 제공</div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="shadow-xl">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <div className="font-semibold">투명성과 신속성</div>
                <div className="text-sm text-gray-500">투명한 성과 공유와 실시간 리포트/알림 제공</div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="shadow-xl">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-3xl">👥</div>
              <div>
                <div className="font-semibold">효율성과 확장성</div>
                <div className="text-sm text-gray-500">쉽게 활용할 수 있는 UI/UX와 자동화 기능 제공</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 헤더 */}
      <PageHeader 
        title="KPI 데이터 표출" 
        tabs={
          <div className="flex items-center justify-between rounded-full bg-white border shadow-sm px-3 py-2">
            <div className="flex gap-6 text-sm">
              <Link href="/admin/segments" className="text-gray-500 hover:text-gray-900">세그먼트 관리</Link>
              <Link href="/admin/kpi" className="font-semibold">KPI 데이터 표출</Link>
            </div>
            <button className="px-3 py-2 rounded-lg bg-[rgb(var(--brand-500))] text-white text-sm flex items-center gap-2">
              <Download size={16}/> CSV 다운로드
            </button>
          </div>
        }
      />

      {/* KPI 데이터 정의 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">📊</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">KPI 데이터 정의</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">노출 수</div>
                  <div className="text-xs text-blue-700">문자 발송 성공 수</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">클릭 수</div>
                  <div className="text-xs text-blue-700">메시지 내 링크 클릭 수</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">전환 수</div>
                  <div className="text-xs text-blue-700">광고주가 정의한 목표 행동 달성</div>
                </div>
              </div>

              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-800 mb-1">⚠️ 중요: 전환 목표 설정 의무</div>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>• 전환 목표는 광고 성과 평가의 기준이므로 캠페인 집행 전 반드시 설정</div>
                  <div>• 회원가입, 구매, 예약 등 구체적 목표 행동 정의</div>
                  <div>• 메인 페이지 방문만 있는 경우: "페이지 방문 = 전환" 최소 설정</div>
                  <div>• 전환 목표 미설정 시 캠페인 진행 불가, 클릭 수만 집계</div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* KPI 데이터 정의 카드들 */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-blue-600 mb-2">
            <TrendingUp size={32} className="mx-auto"/>
          </div>
          <div className="text-2xl font-bold text-black">
            {kpiData?.totalSent.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-gray-600">총 발송 성공 수</div>
          <div className="text-xs text-blue-600 mt-1">CTR 25.4%</div>
        </Card>

        <Card className="text-center p-4">
          <div className="text-green-600 mb-2">
            <BarChart3 size={32} className="mx-auto"/>
          </div>
          <div className="text-2xl font-bold text-black">
            {kpiData?.totalClicks.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-gray-600">총 링크 클릭 수</div>
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
          <div className="text-sm text-gray-600">총 목표 전환 수</div>
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
          <div className="text-sm text-gray-600">총 비용</div>
          <div className="text-xs text-orange-600 mt-1">CPM ₩221.7</div>
        </Card>
      </div>

      {/* 캠페인별 성과 데이터 */}
      <Card>
        <div className="px-5 py-3 border-b flex items-center gap-2">
          <BarChart3 size={20} className="text-gray-600"/>
          <h3 className="font-semibold">캠페인별 성과 데이터</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">캠페인명</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">세그먼트</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">채널</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">예산</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">기간</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">발송 성공</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">클릭 수</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">전환 수</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">비용</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">CTR</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">CVR</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">CPM</th>
              </tr>
            </thead>
            <tbody>
              {campaignPerformance.map((campaign, index) => {
                const ctr = campaign.sent > 0 ? ((campaign.clicks / campaign.sent) * 100).toFixed(1) + "%" : "0%";
                const cvr = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) + "%" : "0%";
                const cpm = campaign.sent > 0 ? `₩${(Number(campaign.cost) / campaign.sent * 1000).toFixed(1)}` : "₩0";
                
                return (
                  <tr key={campaign.campaignId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium">{campaign.campaignName}</td>
                    <td className="px-4 py-3">세그먼트</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        혼합
                      </span>
                    </td>
                    <td className="px-4 py-3">₩{Number(campaign.cost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">2024.01.01~12.31</td>
                    <td className="px-4 py-3 text-right font-medium">{campaign.sent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">{campaign.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">{campaign.conversions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">₩{Number(campaign.cost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">{ctr}</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">{cvr}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{cpm}</td>
                  </tr>
                );
              })}
              {campaignPerformance.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
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
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}
    </div>
  );
}
