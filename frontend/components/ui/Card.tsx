export function Card({ children, className="" }:{children:React.ReactNode; className?:string}) {
  return <div className={`bg-white rounded-2xl border shadow-sm ${className}`}>{children}</div>;
}

export const CardHeader = ({title, extra}:{title:string; extra?:React.ReactNode}) => (
  <div className="px-5 py-3 border-b flex items-center justify-between">
    <h3 className="font-semibold">{title}</h3>{extra}
  </div>
);

export const CardBody = ({children,className=""}:{children:React.ReactNode;className?:string}) =>
  <div className={`p-5 ${className}`}>{children}</div>;
