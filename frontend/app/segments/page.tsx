import SegmentsTree from "./SegmentsTree";

export default function SegmentsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">세그먼트</h1>
      <p className="text-sm text-gray-500">검색하거나 + 버튼으로 트리를 펼쳐보세요.</p>
      <SegmentsTree />
    </div>
  );
}

