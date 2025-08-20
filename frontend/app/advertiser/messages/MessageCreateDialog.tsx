"use client";
import { useEffect, useState } from "react";
import { createMessage, listCampaigns, type Campaign } from "@/lib/api";

export default function MessageCreateDialog({open,onOpenChange,onCreated}:{
  open:boolean;
  onOpenChange:(v:boolean)=>void;
  onCreated:()=>void;
}){
  const [campaigns,setCampaigns]=useState<Campaign[]>([]);
  const [form,setForm]=useState({ 
    campaignId:"", 
    type:"SMS", 
    title:"", 
    content:"" 
  });
  const [err,setErr]=useState<string|null>(null); 
  const [loading,setLoading]=useState(false);

  const maxLength = form.type === 'SMS' ? 90 : 2000;
  const currentLength = form.content.length;

  useEffect(()=>{ 
    listCampaigns().then(setCampaigns).catch(()=>setCampaigns([])); 
  },[]);

  const handleSubmit = async () => {
    if(!form.campaignId || !form.title.trim() || !form.content.trim()) { 
      setErr("필수 항목을 입력해 주세요."); 
      return; 
    }
    
    if(form.content.length < 5) {
      setErr("메시지 내용은 최소 5자 이상 입력해주세요.");
      return;
    }

    if(form.content.length > maxLength) {
      setErr(`메시지 내용이 ${maxLength}자를 초과했습니다.`);
      return;
    }
    
    try{
      setErr(null); 
      setLoading(true);
      await createMessage({
        campaignId: Number(form.campaignId),
        type: form.type as any,
        title: form.title.trim(), 
        content: form.content.trim(),
        status: "DRAFT" as any,
      } as any);
      onCreated();
      // 폼 초기화
      setForm({ campaignId:"", type:"SMS", title:"", content:"" });
    }catch(e:any){ 
      setErr(e?.message || "생성 실패"); 
    } finally{ 
      setLoading(false); 
    }
  };

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={()=>onOpenChange(false)}>
      <div className="w-[600px] bg-white rounded-2xl shadow-2xl p-6" onClick={(e)=>e.stopPropagation()}>
        <div className="text-lg font-semibold mb-1 text-blue-600">새 메시지 등록</div>
        <div className="text-sm text-gray-500 mb-4">
          <div>새로운 광고 메시지를 등록합니다.</div>
          <div>캠페인과 메시지 유형을 선택하고 내용을 작성하세요.</div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-black">캠페인 (필수)</label>
              <select 
                className="w-full border rounded-lg p-2 bg-white text-black" 
                value={form.campaignId} 
                onChange={(e)=>setForm({...form, campaignId:e.target.value})}
              >
                <option value="">캠페인을 선택하세요</option>
                {campaigns.map((c:Campaign)=>(
                  <option key={c.id} value={c.id}>[{c.id}] {c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1 text-black">메시지 유형 (필수)</label>
              <select 
                className="w-full border rounded-lg p-2 bg-white text-black" 
                value={form.type} 
                onChange={(e)=>setForm({...form, type:e.target.value, content: ""})} // 타입 변경시 내용 초기화
              >
                <option value="SMS">SMS (단문)</option>
                <option value="MMS">MMS (멀티미디어)</option>
                <option value="RCS">RCS (대화형)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">메시지 제목 (필수)</label>
            <input 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              placeholder="메시지 제목을 입력하세요" 
              value={form.title} 
              onChange={(e)=>setForm({...form, title:e.target.value})}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">
              메시지 내용 (필수) 
              <span className="text-xs text-gray-500 ml-2">
                최소 5자, {form.type} 최대 {maxLength}자
              </span>
            </label>
            <textarea 
              className="w-full border rounded-lg p-2 min-h-[120px] resize-none bg-white text-black" 
              placeholder={`메시지 내용을 입력하세요 (${form.type} ${maxLength}자 제한)`}
              value={form.content} 
              onChange={(e)=>setForm({...form, content:e.target.value})}
              maxLength={maxLength}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={currentLength < 5 ? "text-red-500" : "text-gray-500"}>
                {currentLength < 5 ? "최소 5자 필요" : ""}
              </span>
              <span className={currentLength > maxLength ? "text-red-500" : "text-gray-500"}>
                {currentLength}/{maxLength}자
              </span>
            </div>
          </div>

          <div className="rounded-lg border bg-blue-50 p-4">
            <div className="text-base font-medium text-blue-900 mb-2">💡 메시지 작성 팁</div>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• SMS: 간결하고 명확한 메시지로 작성하세요</li>
              <li>• MMS: 이미지와 함께 활용할 수 있는 내용으로 작성하세요</li>
              <li>• RCS: 대화형 요소를 고려한 친근한 톤으로 작성하세요</li>
            </ul>
          </div>
        </div>

        {err && <div className="text-red-500 text-sm mt-3">{err}</div>}

        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="px-4 py-2 rounded-lg border hover:bg-gray-50 text-black text-sm" 
            onClick={()=>onOpenChange(false)}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[rgb(var(--success))] text-white text-sm flex items-center gap-2"
            disabled={loading || currentLength < 5 || currentLength > maxLength}
            onClick={handleSubmit}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
