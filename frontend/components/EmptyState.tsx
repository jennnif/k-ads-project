export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="w-full py-20 text-center">
      <div className="inline-flex flex-col items-center rounded-2xl border border-ink-200 bg-white px-8 py-10 shadow-card">
        <div className="text-lg font-semibold">{title}</div>
        {subtitle && <div className="text-sm mt-2 text-ink-600">{subtitle}</div>}
      </div>
    </div>
  );
}
