"use client";
import { useEffect, useState } from "react";
import { fetchParents, searchSegments, type Segment } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminSegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const data = searchQuery.trim() 
        ? await searchSegments(searchQuery)
        : await fetchParents();
      setSegments(data);
    } catch (error) {
      console.error("Failed to load segments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSegments();
  }, [searchQuery]);

  // 세그먼트별 통계 (Mock 데이터)
  const segmentStats = {
    "식품/음료": { count: "5개", color: "text-purple-600" },
    "패션/뷰티": { count: "5개", color: "text-purple-600" },
    "생활/건강": { count: "4개", color: "text-purple-600" },
    "교육/문화": { count: "4개", color: "text-purple-600" },
    "부동산/금융": { count: "3개", color: "text-purple-600" },
    "자동차/교통": { count: "2개", color: "text-purple-600" },
  };

  return (
    <div className="space-y-6">
      {/* 서비스 핵심 가치 섹션 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-xl">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
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
        title="세그먼트 관리" 
        tabs={
          <div className="flex items-center justify-between rounded-full bg-white border shadow-sm px-3 py-2">
            <div className="flex gap-6 text-sm">
              <Link href="/admin/segments" className="font-semibold">세그먼트 관리</Link>
              <Link href="/admin/kpi" className="text-gray-500 hover:text-gray-900">KPI 데이터 집계</Link>
            </div>
            <button className="px-3 py-2 rounded-lg bg-[rgb(var(--brand-500))] text-white text-sm flex items-center gap-2">
              <Plus size={16}/> 세그먼트 생성
            </button>
          </div>
        }
      />

      {/* 검색 */}
      <Card>
        <CardBody>
          <div className="relative max-w-md">
            <input 
              className="w-full border rounded-lg pl-9 pr-3 py-2" 
              placeholder="다른 세그먼트를 검색" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
          </div>
        </CardBody>
      </Card>

      {/* 세그먼트 카테고리 그리드 */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(segmentStats).map(([category, stats]) => (
          <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className={`text-sm ${stats.color} mb-4`}>
                  중분류 {stats.count}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* KPI 데이터 자동 집계 시스템 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">⚙️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">KPI 데이터 자동 집계 시스템</h3>
              <p className="text-sm text-blue-800 mb-3">
                캠페인의 성과 데이터를 1시간 단위로 집계하여 실시간 성과 분석을 제공합니다.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">데이터 소스</div>
                  <div className="text-xs text-blue-700">문자 발송 & 웹 로그 연동</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">집계 항목</div>
                  <div className="text-xs text-blue-700">발송성공, 링크클릭, 목표전환, 비용</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900">집계 주기</div>
                  <div className="text-xs text-blue-700">1시간 단위 자동 집계</div>
                </div>
              </div>

              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-800 mb-1">⚠️ 중요: 전환 목표 설정 의무</div>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>• 전환 목표는 광고 성과 평가의 기준이 되므로, 반드시 설정해야 캠페인이 집행 가능</div>
                  <div>• 메인 페이지 링크만 있는 경우: "메인 페이지 방문 = 전환"으로 최소 설정</div>
                  <div>• 전환 목표 설정 시 실명 가능한 목표 기준 틀립니다</div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}
    </div>
  );
}
