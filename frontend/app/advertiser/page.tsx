"use client";
import Link from "next/link";

export default function AdvertiserHomePage() {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">환영합니다 광고주님 !</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          K-Ads 광고 플랫폼에서 효과적인 광고 캠페인을 관리하고 성과를 분석하세요
        </p>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        <div className="advertiser-card">
          <p>📊</p>
          <div className="heading">캠페인 관리</div>
          <p>광고 캠페인을 생성하고 관리하세요</p>
          <a href="/advertiser/campaigns" className="advertiser-button">
            바로가기 →
            <div className="hoverEffect">
              <div></div>
            </div>
          </a>
        </div>

        <div className="advertiser-card">
          <p>💬</p>
          <div className="heading">메시지 관리</div>
          <p>광고 메시지를 작성하고 관리하세요</p>
          <a href="/advertiser/messages" className="advertiser-button">
            바로가기 →
            <div className="hoverEffect">
              <div></div>
            </div>
          </a>
        </div>

        <div className="advertiser-card">
          <p>📈</p>
          <div className="heading">KPI 데이터 표출</div>
          <p>캠페인 성과 분석 데이터를 확인하세요</p>
          <a href="/advertiser/kpi" className="advertiser-button">
            바로가기 →
            <div className="hoverEffect">
              <div></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
