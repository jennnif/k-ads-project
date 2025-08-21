"use client";
import PageHeader from "@/components/ui/PageHeader";
import StatusPill from "@/components/ui/StatusPill";
import { Card, CardBody } from "@/components/ui/Card";
import { listCampaigns, type Campaign } from "@/lib/api";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CampaignCreateDialog from "./CampaignCreateDialog";

export default function AdvertiserCampaignsPage(){
  const [items,setItems]=useState<Campaign[]>([]);
  const [q,setQ]=useState(""); 
  const [status,setStatus]=useState(""); 
  const [segmentId,setSegmentId]=useState("");
  const [open,setOpen]=useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  const router = useRouter();

  const load=async()=>{
    const p:any={}; 
    if(q.trim()) p.q=q.trim(); 
    if(status) p.status=status; 
    if(segmentId) p.segmentId=Number(segmentId);
    setItems(await listCampaigns(p));
  };
  
  useEffect(()=>{ load(); },[]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "messages") {
      router.push("/advertiser/messages");
    } else if (tab === "kpi") {
      router.push("/advertiser/kpi");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">캠페인 관리</h1>
        <button onClick={()=>setOpen(true)} className="px-6 py-3 rounded-lg bg-[rgb(var(--brand-500))] text-white text-sm flex items-center gap-2 hover:bg-[rgb(var(--brand-600))] transition-colors">
          <Plus size={16}/> 캠페인 생성
        </button>
      </div>

      {/* Tab Menu */}
      <div className="campaign-tab-container">
        <button 
          className={`campaign-tab ${activeTab === "campaigns" ? "active" : ""}`}
          onClick={() => handleTabClick("campaigns")}
        >
          캠페인 관리
        </button>
        <button 
          className={`campaign-tab ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => handleTabClick("messages")}
        >
          메시지 관리
        </button>
        <button 
          className={`campaign-tab ${activeTab === "kpi" ? "active" : ""}`}
          onClick={() => handleTabClick("kpi")}
        >
          KPI 데이터 표출
        </button>
      </div>
      
      <FilterBox q={q} setQ={setQ} status={status} setStatus={setStatus} segmentId={segmentId} setSegmentId={setSegmentId} onApply={load}/>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map(c=>(
          <Card key={c.id} className="campaign-card hover:shadow-xl transition-shadow cursor-pointer">
            <CardBody>
              <div className="text-center">
                <div className="text-lg font-semibold text-black">{c.name}</div>
              </div>

              <div className="mt-1 text-sm text-black font-medium text-center">세그먼트 ID: {c.segmentId}</div>

              <div className="mt-3 rounded-xl border bg-yellow-50 p-3">
                <div className="text-sm font-medium text-black">전환 목표</div>
                <div className="text-sm text-black">설정한 목표를 여기에 노출</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black">
                <div className="font-medium">예산: {Number(c.budget).toLocaleString()}원</div>
                <div className="text-right"><StatusPill v={c.status}/></div>
                <div className="col-span-2 font-medium">{c.startDate} ~ {c.endDate}</div>
              </div>

              <div className="mt-3 text-right">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/advertiser/campaigns/${c.id}`);
                  }}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  세부 정보 보기
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
        {items.length===0 && (
          <div className="col-span-3">
            <Card>
              <CardBody>
                <div className="text-center text-black py-12">
                  캠페인이 없습니다. 상단의 '캠페인 생성'을 눌러 등록하세요.
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <CampaignCreateDialog open={open} onOpenChange={setOpen} onCreated={()=>{ setOpen(false); load(); }}/>
    </div>
  );
}

function FilterBox({q,setQ,status,setStatus,segmentId,setSegmentId,onApply}:any){
  return (
    <Card>
      <CardBody>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative">
            <input 
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-black placeholder-black" 
              placeholder="광고명으로 검색" 
              value={q} 
              onChange={(e)=>setQ(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
          </div>
          <select className="border rounded-lg p-2 text-black" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="ACTIVE">진행중</option>
            <option value="DRAFT">초안</option>
            <option value="PAUSED">일시중지</option>
            <option value="ENDED">종료</option>
          </select>
          <input 
            className="border rounded-lg p-2 text-black placeholder-black" 
            placeholder="세그먼트 ID" 
            value={segmentId} 
            onChange={(e)=>setSegmentId(e.target.value)}
          />
          <button onClick={onApply} className="rounded-lg border px-3 py-2 hover:bg-gray-50 text-black">
            적용
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
