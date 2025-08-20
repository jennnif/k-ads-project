"use client";
import { useEffect, useState } from "react";
import { createCampaign, type Campaign } from "@/lib/api";

export default function CampaignCreateDialog({open,onOpenChange,onCreated}:{
  open:boolean;
  onOpenChange:(v:boolean)=>void;
  onCreated:()=>void;
}){
  const [segments,setSegments]=useState<any[]>([]);
  const [form,setForm]=useState({ 
    segmentId:"", 
    name:"", 
    goal:"", 
    budget:"", 
    startDate:"", 
    endDate:"", 
    channel:"SMS" 
  });
  const [err,setErr]=useState<string|null>(null); 
  const [loading,setLoading]=useState(false);
  const [budgetError, setBudgetError] = useState<string|null>(null);

  useEffect(()=>{ 
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/,"") || "http://localhost:8080";
    fetch(`${base}/api/admin/segments`,{cache:"no-store"})
      .then(r=>r.json())
      .then(setSegments)
      .catch(()=>setSegments([])); 
  },[]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({...form, budget: value});
    
    // 예산 입력값 검증
    if (value === "") {
      setBudgetError(null);
    } else if (!/^\d+$/.test(value)) {
      setBudgetError("숫자만 입력해 주세요.");
    } else {
      setBudgetError(null);
    }
  };

  const handleSubmit = async () => {
    if(!form.segmentId || !form.name || !form.startDate || !form.endDate) { 
      setErr("필수 항목을 입력해 주세요."); 
      return; 
    }
    if(form.endDate < form.startDate){ 
      setErr("기간이 올바르지 않습니다."); 
      return; 
    }
    if(budgetError) {
      setErr("예산을 올바르게 입력해 주세요.");
      return;
    }
    
    try{
      setErr(null); 
      setLoading(true);
      await createCampaign({
        name: form.name.trim(), 
        status: "ACTIVE" as any, 
        budget: String(form.budget || "0"),
        startDate: form.startDate, 
        endDate: form.endDate, 
        segmentId: Number(form.segmentId),
      } as any);
      onCreated();
    }catch(e:any){ 
      setErr(e?.message || "생성 실패"); 
    } finally{ 
      setLoading(false); 
    }
  };

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={()=>onOpenChange(false)}>
      <div className="w-[720px] bg-white rounded-2xl shadow-2xl p-6" onClick={(e)=>e.stopPropagation()}>
        <div className="text-lg font-semibold mb-1 text-black">새 캠페인 생성</div>
        <p className="text-sm text-black mb-4">
          새로운 광고 캠페인을 생성합니다. 전환 목표를 반드시 설정해야 캠페인 진행이 가능합니다.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-black">세그먼트 (필수)</label>
            <select 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              value={form.segmentId} 
              onChange={(e)=>setForm({...form, segmentId:e.target.value})}
            >
              <option value="">세그먼트를 선택하세요</option>
              {segments.map((s:any)=>(
                <option key={s.id} value={s.id}>[{s.id}] {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-black">광고명 (필수)</label>
            <input 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              placeholder="광고명을 입력하세요" 
              value={form.name} 
              onChange={(e)=>setForm({...form, name:e.target.value})}
            />
          </div>

          <div className="md:col-span-2 rounded-xl border bg-yellow-50 p-4">
            <div className="text-sm font-semibold text-black">⚠ 전환 목표</div>
            <div className="mt-2">
              <select 
                className="w-full border rounded-lg p-2 bg-white text-black" 
                value={form.goal} 
                onChange={(e)=>setForm({...form, goal:e.target.value})}
              >
                <option value="">전환 목표를 선택하세요</option>
                <option value="PURCHASE">상품 구매 완료</option>
                <option value="LEAD">문의 접수</option>
                <option value="VISIT">매장 방문</option>
              </select>
              <p className="text-xs text-black mt-2">
                전환 목표 미설정 시 캠페인 진행이 불가하며, 설정한 추적 방식에 따라 성과 데이터가 집계됩니다.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">예산 (원)</label>
            <input 
              type="text"
              className="w-full border rounded-lg p-2 bg-white text-black" 
              placeholder="예산을 입력하세요 (숫자만)" 
              value={form.budget} 
              onChange={handleBudgetChange}
            />
            {budgetError && (
              <div className="text-red-500 text-xs mt-1">{budgetError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1 text-black">채널</label>
            <select 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              value={form.channel} 
              onChange={(e)=>setForm({...form, channel:e.target.value})}
            >
              <option>SMS</option>
              <option>MMS</option>
              <option>RCS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">시작일</label>
            <input 
              type="date" 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              value={form.startDate} 
              onChange={(e)=>setForm({...form, startDate:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-black">종료일</label>
            <input 
              type="date" 
              className="w-full border rounded-lg p-2 bg-white text-black" 
              value={form.endDate} 
              onChange={(e)=>setForm({...form, endDate:e.target.value})}
            />
          </div>
        </div>

        {err && <div className="text-red-500 text-sm mt-3">{err}</div>}

        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-black" 
            onClick={()=>onOpenChange(false)}
          >
            취소
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-[rgb(var(--brand-500))] text-white disabled:opacity-50"
            disabled={loading || !!budgetError}
            onClick={handleSubmit}
          >
            {loading ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
