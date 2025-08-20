"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  fetchChildrenByParentId,
  fetchRootSegments,
  searchSegments,
  type Segment,
} from "@/lib/api";

type NodeState = {
  expanded: boolean;
  loading: boolean;
  children: Segment[] | null;
};

export default function SegmentsTree() {
  const [roots, setRoots] = useState<Segment[]>([]);
  const [states, setStates] = useState<Record<number, NodeState>>({});
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<Segment[]>([]);

  const isSearchMode = q.trim().length > 0;

  // 초기 루트 로드
  useEffect(() => {
    fetchRootSegments().then(setRoots).catch(() => setRoots([]));
  }, []);

  // 검색 (디바운스)
  useEffect(() => {
    if (!isSearchMode) {
      setResults([]);
      setSearching(false);
      setSearchError(null);
      return;
    }
    const h = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await searchSegments(q.trim());
        setResults(res || []);
      } catch (e: any) {
        setSearchError(e?.message || "검색 실패");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(h);
  }, [q, isSearchMode]);

  // 노드 토글
  const toggleNode = async (seg: Segment) => {
    setStates((prev) => {
      const cur = prev[seg.id] || { expanded: false, loading: false, children: null };
      return { ...prev, [seg.id]: { ...cur, expanded: !cur.expanded } };
    });
    const willExpand = !(states[seg.id]?.expanded);
    if (willExpand) {
      setStates((prev) => ({
        ...prev,
        [seg.id]: { ...(prev[seg.id] || {} as NodeState), expanded: true, loading: true },
      }));
      const kids = await fetchChildrenByParentId(seg.id);
      setStates((prev) => ({
        ...prev,
        [seg.id]: { expanded: true, loading: false, children: kids },
      }));
    }
  };

  // 전체 펼치기: 루트 → 직계만 1뎁스 로드 (필요 시 2뎁스까지 반복 가능)
  const expandAll = async () => {
    // 루트 펼치기
    for (const r of roots) {
      const cur = states[r.id];
      if (!cur?.expanded) {
        setStates((p) => ({ ...p, [r.id]: { expanded: true, loading: true, children: cur?.children ?? null } }));
        const kids = await fetchChildrenByParentId(r.id);
        setStates((p) => ({ ...p, [r.id]: { expanded: true, loading: false, children: kids } }));
      }
    }
  };

  // 전체 접기
  const collapseAll = () => {
    setStates((prev) => {
      const next: Record<number, NodeState> = {};
      Object.keys(prev).forEach((k) => {
        const id = Number(k);
        next[id] = { expanded: false, loading: false, children: prev[id]?.children ?? null };
      });
      return next;
    });
  };

  const body = useMemo(() => {
    if (isSearchMode) {
      return (
        <div className="space-y-2">
          {searching && <div className="text-sm text-gray-500">검색 중…</div>}
          {searchError && <div className="text-sm text-red-500">{searchError}</div>}
          {!searching && !searchError && (
            <>
              <div className="text-xs text-gray-500">결과: {results.length}건</div>
              {results.length === 0 ? (
                <div className="text-sm text-gray-500">검색 결과가 없습니다.</div>
              ) : (
                <ul className="space-y-1">
                  {results.map((s) => (
                    <li key={s.id} className="flex items-center justify-between border rounded-md p-2">
                      <Link href={`/segments/${s.id}`} className="font-medium hover:underline">
                        {s.name}
                      </Link>
                      <span className="text-xs text-gray-500">
                        ID: {s.id}
                        {s.parentId ? ` · 부모:${s.parentId}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      );
    }

    // 트리 모드
    return (
      <ul className="space-y-1">
        {roots.map((r) => (
          <TreeNode
            key={r.id}
            seg={r}
            state={states[r.id]}
            onToggle={() => toggleNode(r)}
            getState={(id) => states[id]}
            setState={(id, st) => setStates((prev) => ({ ...prev, [id]: st }))}
          />
        ))}
      </ul>
    );
  }, [isSearchMode, searching, searchError, results, roots, states]);

  return (
    <div className="space-y-4">
      {/* 상단 바: 검색 + 전체 토글 */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="flex-1 min-w-[240px] border rounded-md p-2"
          placeholder="세그먼트 이름 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {isSearchMode ? (
          <button className="border rounded-md px-3 py-2" onClick={() => setQ("")}>
            검색 초기화
          </button>
        ) : (
          <>
            <button className="border rounded-md px-3 py-2" onClick={expandAll}>
              전체 펼치기
            </button>
            <button className="border rounded-md px-3 py-2" onClick={collapseAll}>
              전체 접기
            </button>
          </>
        )}
      </div>

      {body}
    </div>
  );
}

function TreeNode({
  seg,
  state,
  onToggle,
  getState,
  setState,
}: {
  seg: Segment;
  state?: NodeState;
  onToggle: () => void;
  getState: (id: number) => NodeState | undefined;
  setState: (id: number, st: NodeState) => void;
}) {
  const expanded = state?.expanded ?? false;
  const loading = state?.loading ?? false;
  const children = state?.children;

  return (
    <li className="border rounded-md">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <button onClick={onToggle} className="w-6 text-center border rounded" aria-label="toggle">
            {expanded ? "−" : "+"}
          </button>
          <Link href={`/segments/${seg.id}`} className="font-medium hover:underline">
            {seg.name}
          </Link>
        </div>
        <span className="text-xs text-gray-500 pr-2">ID: {seg.id}</span>
      </div>

      {expanded && (
        <div className="pl-6 pb-2">
          {loading && <div className="text-sm text-gray-500">불러오는 중…</div>}
          {!loading && children && children.length === 0 && (
            <div className="text-sm text-gray-500">하위가 없습니다.</div>
          )}
          {!loading && children && children.length > 0 && (
            <ul className="space-y-1">
              {children.map((c) => (
                <TreeNode
                  key={c.id}
                  seg={c}
                  state={getState(c.id)}
                  onToggle={async () => {
                    const cur = getState(c.id);
                    const nextExpanded = !(cur?.expanded ?? false);
                    setState(c.id, {
                      expanded: nextExpanded,
                      loading: false,
                      children: cur?.children ?? null,
                    });
                    if (nextExpanded && !cur?.children) {
                      // 처음 펼칠 때만 로드
                      setState(c.id, { expanded: true, loading: true, children: null });
                      const kids = await fetchChildrenByParentId(c.id);
                      setState(c.id, { expanded: true, loading: false, children: kids });
                    }
                  }}
                  getState={getState}
                  setState={setState}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
