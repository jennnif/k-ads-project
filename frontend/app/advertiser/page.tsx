"use client";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";

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
      color: "bg-[rgb(var(--orange-500)/.08)] border-[rgb(var(--orange-500)/.2)] text-[rgb(var(--orange-500))]"
    }
  ];

  const values = [
    { title: "실시간 분석", desc: "캠페인 성과를 실시간으로 모니터링하고 최적화하세요", icon: "🏅" },
    { title: "정확한 타겟팅", desc: "세그먼트 기반으로 정확한 타겟 고객에게 메시지를 전달하세요", icon: "📊" },
    { title: "스마트 운영", desc: "AI 기반 추천과 자동화로 효율적인 광고 운영을 경험하세요", icon: "⚙️" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">환영합니다 광고주님 !</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          K-Ads 광고 플랫폼에서 효과적인 광고 캠페인을 관리하고 성과를 분석하세요
        </p>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        <div className="card">
          <div className="card-content">
            <div className="text-5xl mb-4">📊</div>
            <div className="card-title">캠페인 관리</div>
            <div className="card-para">
              광고 캠페인을 생성하고 관리하세요
            </div>
            <a 
              href="/advertiser/campaigns" 
              className="mt-4 px-6 py-2 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 border border-white border-opacity-30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              바로가기 →
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-5xl mb-4">💬</div>
            <div className="card-title">메시지 관리</div>
            <div className="card-para">
              광고 메시지를 작성하고 관리하세요
            </div>
            <a 
              href="/advertiser/messages" 
              className="mt-4 px-6 py-2 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 border border-white border-opacity-30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              바로가기 →
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-5xl mb-4">📈</div>
            <div className="card-title">KPI 데이터 표출</div>
            <div className="card-para">
              캠페인 성과와 분석 데이터를 확인하세요
            </div>
            <a 
              href="/advertiser/kpi" 
              className="mt-4 px-6 py-2 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 border border-white border-opacity-30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              바로가기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
