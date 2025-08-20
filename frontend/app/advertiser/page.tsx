"use client";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { BarChart3, MessageSquare, TrendingUp } from "lucide-react";

export default function AdvertiserHomePage() {
  const menuItems = [
    {
      title: "캠페인 관리",
      description: "광고 캠페인을 생성하고 관리하세요",
      icon: TrendingUp,
      href: "/advertiser/campaigns",
      color: "bg-blue-50 text-blue-600",
      borderColor: "hover:border-blue-300"
    },
    {
      title: "메시지 관리", 
      description: "광고 메시지를 작성하고 관리하세요",
      icon: MessageSquare,
      href: "/advertiser/messages",
      color: "bg-green-50 text-green-600",
      borderColor: "hover:border-green-300"
    },
    {
      title: "KPI 데이터 표출",
      description: "캠페인 성과와 분석 데이터를 확인하세요", 
      icon: BarChart3,
      href: "/advertiser/kpi",
      color: "bg-purple-50 text-purple-600",
      borderColor: "hover:border-purple-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 환영 메시지 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            환영합니다 광고주님
          </h1>
          <p className="text-lg text-gray-600">
            K-Ads 광고 플랫폼에서 효과적인 광고 캠페인을 관리하고 성과를 분석하세요
          </p>
        </div>

        {/* 메뉴 박스 3개 */}
        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className={`h-full cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${item.borderColor}`}>
                <CardBody className="text-center p-8">
                  {/* 아이콘 */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <item.icon size={32} />
                  </div>
                  
                  {/* 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  
                  {/* 설명 */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* 화살표 */}
                  <div className="mt-6">
                    <span className="text-[rgb(var(--brand-600))] font-medium text-sm">
                      시작하기 →
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* 하단 추가 정보 */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-500">
            <div>
              <div className="font-semibold text-gray-700 mb-2">📊 실시간 분석</div>
              <div>캠페인 성과를 실시간으로 모니터링하고 최적화하세요</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">🎯 정확한 타겟팅</div>
              <div>세그먼트 기반으로 정확한 타겟 고객에게 메시지를 전달하세요</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">💡 스마트 운영</div>
              <div>AI 기반 추천과 자동화로 효율적인 광고 운영을 경험하세요</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
