import Link from "next/link";
import { fetchSegmentById, fetchChildrenByParentId, type Segment } from "@/lib/api";

type Props = { params: { id: string } };

export default async function SegmentDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id) || id <= 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">잘못된 세그먼트 ID</h1>
        <p className="text-gray-600 mt-2">URL을 확인해 주세요. (예: /segments/1)</p>
      </div>
    );
  }

  const segment = await fetchSegmentById(id);
  if (!segment) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">세그먼트를 찾을 수 없습니다.</h1>
        <p className="text-gray-600 mt-2">요청한 ID: {id}</p>
      </div>
    );
  }

  let parent: Segment | null = null;
  let siblings: Segment[] = [];
  const children = await fetchChildrenByParentId(id);

  if (segment.parentId != null) {
    const [p, sibs] = await Promise.all([
      fetchSegmentById(segment.parentId),
      fetchChildrenByParentId(segment.parentId),
    ]);
    parent = p;
    siblings = (sibs || []).filter((s) => s.id !== segment.id);
  }

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400">
        <ol className="flex items-center gap-2">
          <li><Link href="/segments" className="hover:underline">세그먼트</Link></li>
          {parent && (
            <>
              <li>/</li>
              <li>
                <Link href={`/segments/${parent.id}`} className="hover:underline">
                  {parent.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-gray-200">{segment.name}</li>
        </ol>
      </nav>

      {/* 상세 */}
      <section>
        <h1 className="text-2xl font-bold">{segment.name}</h1>
        <div className="text-sm text-gray-400 mt-1">ID: {segment.id}</div>
        <div className="text-sm text-gray-400">
          부모 ID: {segment.parentId ?? "없음"}
        </div>
      </section>

      {/* 자식 세그먼트(이전 단계에서 구현) 섹션은 기존 코드 유지 */}
      <section>
        <h2 className="text-lg font-semibold mb-2">하위 세그먼트</h2>
        {children.length === 0 ? (
          <div className="text-gray-500">하위 세그먼트가 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {children.map((c) => (
              <li key={c.id} className="border rounded-md p-3 hover:bg-gray-100">
                <Link href={`/segments/${c.id}`} className="font-medium">
                  {c.name}
                </Link>
                <div className="text-xs text-gray-500">ID: {c.id}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 형제 세그먼트 */}
      {parent && (
        <section>
          <h2 className="text-lg font-semibold mb-2">형제 세그먼트</h2>
          {siblings.length === 0 ? (
            <div className="text-gray-500">형제 세그먼트가 없습니다.</div>
          ) : (
            <ul className="space-y-2">
              {siblings.map((s) => (
                <li key={s.id} className="border rounded-md p-3 hover:bg-gray-100">
                  <Link href={`/segments/${s.id}`} className="font-medium">
                    {s.name}
                  </Link>
                  <div className="text-xs text-gray-500">ID: {s.id}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
