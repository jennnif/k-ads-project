export default function StatusPill({ v }:{ v:string }) {
  const map:Record<string,string>={
    ACTIVE:"bg-[rgb(var(--success)/.12)] text-[rgb(var(--success))]",
    DRAFT:"bg-gray-100 text-gray-700",
    PAUSED:"bg-[rgb(var(--warning)/.12)] text-[rgb(var(--warning))]",
    ENDED:"bg-gray-200 text-gray-700",
    READY:"bg-[rgb(var(--brand-500)/.12)] text-[rgb(var(--brand-600))]",
    SENT:"bg-gray-100 text-gray-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[v]||"bg-gray-100"}`}>{v}</span>;
}
