import { Card, CardBody } from "./Card";

export default function AppHero() {
  const items=[
    {emoji:"🏅", title:"정확성과 신뢰성", desc:"모든 광고 데이터와 성과를 정확히 제공"},
    {emoji:"📊", title:"투명성과 신속성", desc:"투명한 성과 공유와 실시간 리포트/알림 제공"},
    {emoji:"👥", title:"효율성과 확장성", desc:"쉽게 활용할 수 있는 UI/UX와 자동화 기능 제공"},
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((it,i)=>(
        <Card key={i} className="shadow-xl">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="text-3xl">{it.emoji}</div>
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-500">{it.desc}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
