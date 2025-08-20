export default function PageHeader({
  title, subtitle, tabs, actions,
}: {title:string; subtitle?:string; tabs?:React.ReactNode; actions?:React.ReactNode}) {
  return (
    <div className="mb-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {tabs && <div className="mt-3">{tabs}</div>}
    </div>
  );
}
