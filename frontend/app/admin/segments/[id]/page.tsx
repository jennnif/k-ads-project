"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchChildrenByParentId, fetchSegmentById, updateSegment, deleteSegment, createSegment, type Segment } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import SegmentDialog from "../SegmentDialog";

export default function SegmentDetailPage() {
  const params = useParams();
  const segmentId = Number(params.id);
  const [parentSegment, setParentSegment] = useState<Segment | null>(null);
  const [childSegments, setChildSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [segmentData, childrenData] = await Promise.all([
        fetchSegmentById(segmentId),
        fetchChildrenByParentId(segmentId)
      ]);
      setParentSegment(segmentData);
      setChildSegments(childrenData);
    } catch (error) {
      // 에러 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (segmentId) {
      loadData();
    }
  }, [segmentId]);

  const handleEdit = (segment: Segment) => {
    setEditingSegment(segment);
    setDialogOpen(true);
  };

  const handleDelete = async (segment: Segment) => {
    if (confirm(`"${segment.name}" 세그먼트를 삭제하시겠습니까?`)) {
      try {
        await deleteSegment(segment.id);
        alert("세그먼트가 삭제되었습니다.");
        await loadData(); // 목록 새로고침
      } catch (error) {
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
        alert("중분류가 수정되었습니다.");
      } else {
        // 생성 - 중분류는 항상 현재 페이지의 대분류를 부모로 가짐
        const payload = {
          name: segmentData.name,
          parentId: segmentId // 현재 페이지의 대분류 ID
        };
        
        await createSegment(payload);
        alert("중분류가 생성되었습니다.");
      }
      
      await loadData(); // 데이터 새로고침
    } catch (error) {
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <PageHeader 
        title={`${parentSegment?.name || '대분류'} - 중분류 관리`}
        tabs={
          <div className="flex items-center justify-between rounded-full bg-white border shadow-sm px-3 py-2">
            <div className="flex gap-6 text-sm">
              <Link href="/admin/segments" className="text-black hover:text-gray-700">
                <ArrowLeft size={16} className="inline mr-2" />
                세그먼트 관리로 돌아가기
              </Link>
            </div>
            <button 
              onClick={() => {
                setEditingSegment(null);
                setDialogOpen(true);
              }}
              className="px-3 py-2 rounded-lg bg-[rgb(var(--brand-500))] text-white text-sm flex items-center gap-2"
            >
              <Plus size={16}/> 중분류 생성
            </button>
          </div>
        }
      />

      {/* 중분류 목록 */}
      <div className="grid md:grid-cols-3 gap-6">
        {childSegments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-black">{segment.name}</h3>
                
                {/* 수정/삭제 버튼 */}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(segment)}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                    title="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(segment)}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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

      {!loading && childSegments.length === 0 && (
        <div className="text-center py-8">
          <div className="text-black">중분류가 없습니다.</div>
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
        parentSegments={[parentSegment!].filter(Boolean)}
      />
    </div>
  );
}
