import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";

export default function AdminHomePage() {
  const features = [
    { 
      title: "세그먼트 관리", 
      desc: "고객 세그먼트를 생성하고 관리합니다.", 
      icon: "🎯", 
      link: "/admin/segments", 
      color: "bg-[rgb(var(--brand-500)/.08)] border-[rgb(var(--brand-500)/.2)] text-[rgb(var(--brand-500))]" 
    },
    { 
      title: "KPI 데이터 집계", 
      desc: "캠페인 성과 데이터를 집계하고 분석합니다.", 
      icon: "📊", 
      link: "/admin/kpi", 
      color: "bg-[rgb(var(--success)/.08)] border-[rgb(var(--success)/.2)] text-[rgb(var(--success))]" 
    },
  ];

  const values = [
    { title: "정확성과 신뢰성", desc: "모든 광고 데이터와 성과를 정확히 제공", icon: "🏅" },
    { title: "투명성과 신속성", desc: "투명한 성과 공유와 실시간 리포트/알림 제공", icon: "📊" },
    { title: "효율성과 확장성", desc: "쉽게 활용할 수 있는 UI/UX와 자동화 기능 제공", icon: "💡" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-ink-900">관리자 모드</h1>
        <p className="text-lg text-ink-600 max-w-2xl mx-auto">
          K-Ads 플랫폼의 세그먼트와 KPI 데이터를 관리하세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
        <h2 className="text-2xl font-bold text-center">K-Ads의 핵심 가치</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-semibold mb-1">{value.title}</h3>
              <p className="text-sm text-ink-600">{value.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
