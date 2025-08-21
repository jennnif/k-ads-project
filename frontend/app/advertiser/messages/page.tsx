"use client";
import PageHeader from "@/components/ui/PageHeader";
import StatusPill from "@/components/ui/StatusPill";
import { Card, CardBody } from "@/components/ui/Card";
import { listMessages, listCampaigns, type Message, type Campaign } from "@/lib/api";
import { useEffect, useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import Link from "next/link";
import MessageCreateDialog from "./MessageCreateDialog";
import { useRouter } from "next/navigation";

export default function AdvertiserMessagesPage(){
  const [items,setItems]=useState<Message[]>([]);
  const [campaigns,setCampaigns]=useState<Campaign[]>([]);
  const [selectedCampaignId,setSelectedCampaignId]=useState("");
  const [open,setOpen]=useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const router = useRouter();

  const load=async()=>{
    const p:any={}; 
    if(selectedCampaignId) p.campaignId=Number(selectedCampaignId);
    setItems(await listMessages(p));
  };
  
  useEffect(()=>{ 
    load(); 
    listCampaigns().then(setCampaigns);
  },[selectedCampaignId]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "campaigns") {
      router.push("/advertiser/campaigns");
    } else if (tab === "kpi") {
      router.push("/advertiser/kpi");
    }
  };

  const getChannelColor = (type: string) => {
    switch(type) {
      case 'SMS': return 'bg-blue-100 text-blue-700';
      case 'MMS': return 'bg-purple-100 text-purple-700';
      case 'RCS': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">메시지 관리</h1>
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            className="border rounded-lg p-2 min-w-[200px] text-white bg-gray-800"
            value={selectedCampaignId}
            onChange={(e)=>setSelectedCampaignId(e.target.value)}
          >
            <option value="">전체 캠페인</option>
            {campaigns.map(c=>(
              <option key={c.id} value={c.id} className="text-black bg-white">[{c.id}] {c.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={()=>setOpen(true)} 
          className="px-4 py-2 rounded-lg bg-[rgb(var(--success))] text-white text-sm flex items-center gap-2"
        >
          <Plus size={16}/> 메시지 등록
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map(m=>(
          <Card key={m.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(m.type)}`}>
                  {m.type}
                </span>
                <StatusPill v={m.status}/>
              </div>

              <h3 className="font-semibold mb-2 text-black">{m.title}</h3>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3 relative">
                <div className="absolute -left-2 top-3 w-3 h-3 bg-gray-50 rotate-45 border-l border-b"></div>
                <div className="text-sm text-gray-700 line-clamp-3">
                  {m.content}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>캠페인 ID: {m.campaignId}</span>
                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-3 text-right">
                <Link 
                  className="text-[rgb(var(--brand-600))] hover:underline text-sm" 
                  href={`/advertiser/messages/${m.id}`}
                >
                  세부 정보 보기
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
        
        {items.length===0 && (
          <div className="col-span-2">
            <Card>
              <CardBody>
                <div className="text-center text-black py-12">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300"/>
                  메시지가 없습니다. '메시지 등록'을 눌러 새 메시지를 작성하세요.
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <MessageCreateDialog open={open} onOpenChange={setOpen} onCreated={()=>{ setOpen(false); load(); }}/>
    </div>
  );
}
