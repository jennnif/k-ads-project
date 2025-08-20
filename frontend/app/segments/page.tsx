"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchParents, type Segment } from "@/lib/api";
import SegmentCard from "@/components/SegmentCard";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";

export default function SegmentsPage() {
  const [data, setData] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchParents()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "unknown error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = q ? data.filter((d) => d.name?.toLowerCase().includes(q.toLowerCase())) : data;
    const seen = new Set<string>();
    return list.filter((item) => {
      const key = item.name || String(item.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data, q]);

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight">부모 세그먼트</h2>
          <p className="text-sm text-ink-600 mt-1">
            캠페인 생성 시 선택할 상위 세그먼트 목록입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="세그먼트 검색"
          />
          <button
            className="hidden sm:inline-flex h-10 items-center rounded-2xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-700 hover:border-ink-300"
            onClick={() => setQ("")}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 상태 영역 */}
      {loading && (
        <div className="text-ink-600">
          <span className="mr-2 animate-pulse">●</span>불러오는 중…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          에러: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="표시할 세그먼트가 없어요"
          subtitle="검색어를 바꾸거나, 백엔드 데이터를 확인해 주세요."
        />
      )}

      {/* 카드 그리드 */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((seg) => (
            <SegmentCard key={`${seg.id}-${seg.name}`} segment={seg} />
          ))}
        </div>
      )}
    </div>
  );
}

