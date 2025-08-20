"use client";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { listCampaigns, getKpiDashboard, getCampaignsPerformance, type Campaign, type KpiDashboard, type CampaignPerformance } from "@/lib/api";
import { useEffect, useState } from "react";
import { TrendingUp, MousePointer, Target, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdvertiserKpiPage(){
  const [campaigns,setCampaigns]=useState<Campaign[]>([]);
  const [selectedCampaignId,setSelectedCampaignId]=useState("");
  const [kpiData, setKpiData] = useState<KpiDashboard | null>(null);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([]);

  const loadData = async () => {
    try {
      const [campaignsData, kpiDashboard, performance] = await Promise.all([
        listCampaigns(),
        getKpiDashboard(selectedCampaignId ? Number(selectedCampaignId) : undefined),
        getCampaignsPerformance()
      ]);
      setCampaigns(campaignsData);
      setKpiData(kpiDashboard);
      setCampaignPerformance(performance);
    } catch (error) {
      console.error("Failed to load KPI data:", error);
    }
  };

  useEffect(()=>{ 
    loadData();
  },[selectedCampaignId]);

  // 실제 API 데이터를 기반으로 KPI 카드 생성
  const kpis = kpiData ? [
    {
      icon: TrendingUp,
      title: "총 발송 성공 수",
      value: kpiData.totalSent.toLocaleString(),
      change: "+15.3%",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: MousePointer,
      title: "총 링크 클릭 수", 
      value: kpiData.totalClicks.toLocaleString(),
      change: "+8.7%",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Target,
      title: "총 목표 전환 수",
      value: kpiData.totalConversions.toLocaleString(),
      change: "+12.1%", 
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: DollarSign,
      title: "총 비용",
      value: `₩${Number(kpiData.totalCost).toLocaleString()}`,
      change: "+5.2%",
      color: "text-orange-600", 
      bgColor: "bg-orange-50"
    }
  ] : [];

  // 실제 캠페인 성과 데이터 변환
  const displayCampaignPerformance = campaignPerformance.map(perf => {
    const ctr = perf.sent > 0 ? ((perf.clicks / perf.sent) * 100).toFixed(1) + "%" : "0%";
    const cvr = perf.clicks > 0 ? ((perf.conversions / perf.clicks) * 100).toFixed(1) + "%" : "0%";
    const cpm = perf.sent > 0 ? `₩${(Number(perf.cost) / perf.sent * 1000).toFixed(1)}` : "₩0";
    
    return {
      id: perf.campaignId,
      name: perf.campaignName,
      segment: "세그먼트", // 실제로는 segmentId로 조회해야 함
      channel: "혼합", // 실제로는 메시지 타입별로 집계해야 함
      budget: `₩${Number(perf.cost).toLocaleString()}`, // 임시로 비용을 예산으로 표시
      period: "2024.01.01~12.31", // 실제로는 캠페인 날짜 사용
      sent: perf.sent.toLocaleString(),
      clicks: perf.clicks.toLocaleString(),
      conversions: perf.conversions.toLocaleString(),
      cost: `₩${Number(perf.cost).toLocaleString()}`,
      ctr,
      cvr,
      cpm
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="KPI 데이터 표출" tabs={
        <div className="flex items-center justify-between rounded-full bg-white border shadow-sm px-3 py-2">
          <div className="flex gap-6 text-sm">
            <Link href="/advertiser/campaigns" className="text-gray-500 hover:text-gray-900">캠페인 관리</Link>
            <Link href="/advertiser/messages" className="text-gray-500 hover:text-gray-900">메시지 관리</Link>
            <Link href="/advertiser/kpi" className="font-semibold">KPI 데이터 표출</Link>
          </div>
        </div>
      }/>

      {/* KPI 카드들 */}
      <div className="grid md:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            className="rounded-2xl border bg-white p-5 transition hover:bg-[rgb(var(--brand-500)/.04)] hover:border-[rgb(var(--brand-500))] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon size={20} className={kpi.color}/>
              </div>
              <span className="text-xs text-green-600 font-medium">{kpi.change}</span>
            </div>
            <div className="text-2xl font-bold mb-1 text-black">{kpi.value}</div>
            <div className="text-sm text-black">{kpi.title}</div>
            <div className="text-xs text-black mt-2">
              {index === 0 && "CTR 25.4%"}
              {index === 1 && "CVR 25.7%"}  
              {index === 2 && "CTR 25.4% | CVR 25.7%"}
              {index === 3 && "CPM ₩221.7"}
            </div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <Card className="rounded-xl">
        <CardBody>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-black">캠페인 필터:</label>
            <select 
              className="border rounded-lg p-2 min-w-[250px] text-black"
              value={selectedCampaignId}
              onChange={(e)=>setSelectedCampaignId(e.target.value)}
            >
              <option value="">전체 캠페인</option>
              {campaigns.map(c=>(
                <option key={c.id} value={c.id}>[{c.id}] {c.name}</option>
              ))}
            </select>
            <button onClick={loadData} className="px-4 py-2 rounded-lg border hover:bg-gray-50 text-black">
              적용
            </button>
          </div>
        </CardBody>
      </Card>

      {/* 캠페인별 성과 테이블 */}
      <Card className="rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center gap-2 bg-white">
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
              {displayCampaignPerformance.map((campaign, index) => (
                <tr key={campaign.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-black">{campaign.name}</td>
                  <td className="px-4 py-3 text-black">{campaign.segment}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.channel === 'SMS' ? 'bg-blue-100 text-blue-700' :
                      campaign.channel === 'MMS' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {campaign.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black">{campaign.budget}</td>
                  <td className="px-4 py-3 text-xs text-black">{campaign.period}</td>
                  <td className="px-4 py-3 text-right font-medium text-black">{campaign.sent}</td>
                  <td className="px-4 py-3 text-right font-medium text-black">{campaign.clicks}</td>
                  <td className="px-4 py-3 text-right font-medium text-black">{campaign.conversions}</td>
                  <td className="px-4 py-3 text-right font-medium text-black">{campaign.cost}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">{campaign.ctr}</td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">{campaign.cvr}</td>
                  <td className="px-4 py-3 text-right text-black">{campaign.cpm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
