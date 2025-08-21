"use client";
import { useEffect, useState } from "react";
import { fetchParents, searchSegments, fetchChildrenByParentId, updateSegment, deleteSegment, createSegment, type Segment } from "@/lib/api";
import { Card, CardBody } from "@/components/ui/Card";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import SegmentDialog from "./SegmentDialog";
import { useRouter } from "next/navigation";

export default function AdminSegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [activeTab, setActiveTab] = useState("segments");
  const router = useRouter();

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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "kpi") {
      router.push("/admin/kpi");
    }
  };

  const handleEdit = (segment: Segment) => {
    setEditingSegment(segment);
    setDialogOpen(true);
  };

  const handleDelete = async (segment: Segment) => {
    if (confirm(`"${segment.name}" 세그먼트를 삭제하시겠습니까?`)) {
      try {
        await deleteSegment(segment.id);
        alert("세그먼트가 삭제되었습니다.");
        await loadSegments(); // 목록 새로고침
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleSave = async (segmentData: { name: string; parentId?: number; type: 'parent' | 'child' }) => {
    try {
      if (editingSegment) {
        // 수정
        const payload = {
          name: segmentData.name,
          parentId: segmentData.type === 'child' ? segmentData.parentId : null
        };
        
        await updateSegment(editingSegment.id, payload);
        alert("세그먼트가 수정되었습니다.");
      } else {
        // 생성
        const payload = {
          name: segmentData.name,
          parentId: segmentData.type === 'child' ? segmentData.parentId : null
        };
        
        await createSegment(payload);
        alert("세그먼트가 생성되었습니다.");
      }
      
      await loadSegments(); // 목록 새로고침
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  // 세그먼트별 통계 (실제 데이터 기반)
  const segmentStats = segments.reduce((acc, segment) => {
    const category = segment.name;
    if (!acc[category]) {
      acc[category] = { count: 0, color: "text-purple-600" };
    }
    acc[category].count++;
    return acc;
  }, {} as Record<string, { count: number; color: string }>);

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">세그먼트 관리</h1>
      </div>

      {/* Tab Menu */}
      <div className="campaign-tab-container">
        <button 
          className={`campaign-tab ${activeTab === "segments" ? "active" : ""}`}
          onClick={() => handleTabClick("segments")}
        >
          세그먼트 관리
        </button>
        <button 
          className={`campaign-tab ${activeTab === "kpi" ? "active" : ""}`}
          onClick={() => handleTabClick("kpi")}
        >
          KPI 데이터 집계
        </button>
      </div>

      {/* 검색 및 세그먼트 생성 */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <input 
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-black placeholder-black" 
                placeholder="세그먼트 검색" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
            </div>
            <button 
              onClick={() => {
                setEditingSegment(null);
                setDialogOpen(true);
              }}
              className="px-3 py-2 rounded-lg bg-[rgb(var(--brand-500))] text-white text-sm flex items-center gap-2"
            >
              <Plus size={16}/> 세그먼트 생성
            </button>
          </div>
        </CardBody>
      </Card>

      {/* 세그먼트 카테고리 그리드 (대분류 표시) */}
      <div className="grid md:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-black">{segment.name}</h3>
                <div className="text-sm text-purple-600 mb-4">
                  중분류 {segmentStats[segment.name]?.count || 0}개
                </div>
                
                {/* 수정/삭제 버튼 */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(segment);
                    }}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                    title="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(segment);
                    }}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* 중분류 페이지로 이동하는 링크 */}
                <Link 
                  href={`/admin/segments/${segment.id}`}
                  className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  중분류 보기
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-black">로딩 중...</div>
        </div>
      )}

      {/* 세그먼트 생성/수정 다이얼로그 */}
      <SegmentDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingSegment(null);
        }}
        onSave={handleSave}
        editSegment={editingSegment}
        parentSegments={segments}
      />
    </div>
  );
}
