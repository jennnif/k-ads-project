"use client";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { BarChart3, MessageSquare, TrendingUp } from "lucide-react";

export default function AdvertiserHomePage() {
  const features = [
    {
      title: "캠페인 관리",
      desc: "광고 캠페인을 생성하고 관리하세요",
      icon: "📊",
      link: "/advertiser/campaigns",
      color: "bg-[rgb(var(--brand-500)/.08)] border-[rgb(var(--brand-500)/.2)] text-[rgb(var(--brand-500))]"
    },
    {
      title: "메시지 관리", 
      desc: "광고 메시지를 작성하고 관리하세요",
      icon: "💬",
      link: "/advertiser/messages",
      color: "bg-[rgb(var(--success)/.08)] border-[rgb(var(--success)/.2)] text-[rgb(var(--success))]"
    },
    {
      title: "KPI 데이터 표출",
      desc: "캠페인 성과와 분석 데이터를 확인하세요", 
      icon: "📊",
      link: "/advertiser/kpi",
      color: "bg-orange-50 border-orange-200 text-orange-600"
    }
  ];

  const values = [
    { title: "실시간 분석", desc: "모든 광고 데이터와 성과를 정확히 제공", icon: "🏅" },
    { title: "정확한 타겟팅", desc: "투명한 성과 공유와 실시간 리포트/알림 제공", icon: "📊" },
    { title: "스마트 운영", desc: "쉽게 활용할 수 있는 UI/UX와 자동화 기능 제공", icon: "⚙️" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">환영합니다 광고주님</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          K-Ads 광고 플랫폼에서 효과적인 광고 캠페인을 관리하고 성과를 분석하세요
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Link key={index} href={feature.link} className="block">
            <Card className={`h-full p-6 flex flex-col items-center text-center transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${feature.color}`}>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-sm text-ink-600 flex-grow">{feature.desc}</p>
              <div className="mt-4 text-sm font-medium flex items-center gap-1">
                시작하기 <span className="text-base">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="border-t pt-8 mt-8 space-y-4">
        <h2 className="text-2xl font-bold text-center text-white">K-Ads의 핵심 가치</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {values.map((value, index) => (
            <Card key={index} className="p-8 text-center min-w-0 w-full">
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-semibold mb-1 text-black">{value.title}</h3>
              <p className="text-xs text-black leading-tight whitespace-nowrap">{value.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
