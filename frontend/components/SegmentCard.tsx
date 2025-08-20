"use client";

import { useRouter } from "next/navigation";
import { type Segment } from "@/lib/api";

interface SegmentCardProps {
  segment: Segment;
}

export default function SegmentCard({ segment }: SegmentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/segments/${segment.id}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") handleClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-xl2 border border-ink-200 bg-white p-4 shadow-card hover:shadow-hover transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      data-segment-id={segment.id}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
          Parent
        </span>
        <span className="text-xs text-ink-500">#{segment.id}</span>
      </div>
      <div className="mt-2 text-base font-semibold leading-snug">{segment.name}</div>
      <div className="mt-1 text-xs text-ink-600">parentId: {String(segment.parentId)}</div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs font-medium text-brand-600">
          상세 보기 →
        </span>
      </div>
    </div>
  );
}
