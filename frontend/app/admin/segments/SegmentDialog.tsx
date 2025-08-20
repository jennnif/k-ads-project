"use client";
import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Plus, X } from "lucide-react";

interface SegmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (segment: { name: string; parentId?: number; type: 'parent' | 'child' }) => void;
  editSegment?: { id: number; name: string; parentId?: number };
  parentSegments?: Array<{ id: number; name: string }>;
  isChildPage?: boolean; // 중분류 페이지에서 열렸는지 여부
}

export default function SegmentDialog({ 
  open, 
  onClose, 
  onSave, 
  editSegment, 
  parentSegments = [],
  isChildPage = false
}: SegmentDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<'parent' | 'child'>('parent');
  const [parentId, setParentId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (editSegment) {
      setName(editSegment.name);
      setType(editSegment.parentId ? 'child' : 'parent');
      setParentId(editSegment.parentId || undefined);
    } else {
      setName("");
      // 중분류 페이지에서는 기본값을 중분류로 설정
      if (isChildPage) {
        setType('child');
        setParentId(parentSegments[0]?.id);
      } else {
        setType('parent');
        setParentId(undefined);
      }
    }
  }, [editSegment, open, isChildPage, parentSegments]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    // 중분류 페이지에서는 항상 중분류로 생성
    if (isChildPage) {
      onSave({
        name: name.trim(),
        parentId: parentSegments[0]?.id,
        type: 'child'
      });
    } else {
      onSave({
        name: name.trim(),
        parentId: type === 'child' ? parentId : undefined,
        type
      });
    }
    
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">
              {editSegment ? '세그먼트 수정' : '세그먼트 생성'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* 세그먼트 유형 선택 (대분류 페이지에서만 표시) */}
            {!isChildPage && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  세그먼트 유형
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="parent"
                      checked={type === 'parent'}
                      onChange={(e) => setType(e.target.value as 'parent')}
                      className="mr-2"
                    />
                    <span className="text-black">대분류</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="child"
                      checked={type === 'child'}
                      onChange={(e) => setType(e.target.value as 'child')}
                      className="mr-2"
                    />
                    <span className="text-black">중분류</span>
                  </label>
                </div>
              </div>
            )}

            {/* 상위 세그먼트 선택 (중분류일 때만 표시) */}
            {type === 'child' && !isChildPage && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  상위 세그먼트 (대분류)
                </label>
                <select
                  value={parentId || ""}
                  onChange={(e) => setParentId(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-black"
                >
                  <option value="">대분류 선택</option>
                  {parentSegments.map(segment => (
                    <option key={segment.id} value={segment.id}>
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 세그먼트명 입력 */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                세그먼트명
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isChildPage 
                    ? '중분류명 입력' 
                    : type === 'parent' 
                      ? '대분류명 입력' 
                      : '중분류명 입력'
                }
                className="w-full border rounded-lg p-2 text-black placeholder-black"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg text-black hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !name.trim() || 
                  (type === 'child' && !isChildPage && !parentId)
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editSegment ? '수정' : '생성'}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
