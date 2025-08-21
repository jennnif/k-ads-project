import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">관리자 모드</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          K-Ads 플랫폼의 세그먼트와 KPI 데이터를 관리하세요.
        </p>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        <div className="admin-card">
          <p>🎯</p>
          <div className="heading">세그먼트 관리</div>
          <p>고객 세그먼트를 생성하고 관리합니다</p>
          <a href="/admin/segments" className="advertiser-button">
            바로가기 →
            <div className="hoverEffect">
              <div></div>
            </div>
          </a>
        </div>

        <div className="admin-card">
          <p>📊</p>
          <div className="heading">KPI 데이터 집계</div>
          <p>캠페인 성과 데이터를 집계하고 분석합니다</p>
          <a href="/admin/kpi" className="advertiser-button">
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
