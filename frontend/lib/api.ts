export type Segment = {
  id: number;
  name: string;
  parentId: number | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export async function fetchParents(): Promise<Segment[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/segments/parents`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch parents: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchSegmentById(id: number): Promise<Segment | null> {
  const res = await fetch(`${API_BASE_URL}/api/admin/segments/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchChildrenByParentId(id: number): Promise<Segment[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/segments/${id}/children`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createSegment(payload: { name: string; parentId: number | null }) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
  const res = await fetch(`${base}/api/admin/segments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Next 15 App Router: 서버 액션/SSR 혼용 대비 캐시 방지
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST /segments -> ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<Segment>;
}

export async function updateSegment(id: number, payload: { name: string; parentId: number | null }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
  const res = await fetch(`${base}/api/admin/segments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT /segments/${id} -> ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<Segment>;
}

export async function deleteSegment(id: number) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
  const res = await fetch(`${base}/api/admin/segments/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DELETE /segments/${id} -> ${res.status} ${res.statusText}: ${text}`);
  }
}

export async function searchSegments(q: string): Promise<Segment[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
  const url = `${base}/api/admin/segments/search?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchRootSegments(): Promise<Segment[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
  const res = await fetch(`${base}/api/admin/segments/parents`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export type Campaign = {
  id: number;
  name: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED";
  budget: string; // decimal string
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  segmentId: number;
  createdAt: string;
  updatedAt: string;
};

export async function listCampaigns(params?: {
  q?: string; status?: string; from?: string; to?: string; segmentId?: number;
}): Promise<Campaign[]> {
  const usp = new URLSearchParams();
  if (params?.q) usp.set("q", params.q);
  if (params?.status) usp.set("status", params.status);
  if (params?.from && params?.to) { usp.set("from", params.from); usp.set("to", params.to); }
  if (params?.segmentId) usp.set("segmentId", String(params.segmentId));
  const url = `${API_BASE_URL}/api/admin/campaigns${usp.toString() ? `?${usp.toString()}` : ""}`;
  
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getCampaign(id: number): Promise<Campaign | null> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getAdvertiserCampaign(id: number): Promise<Campaign | null> {
  const res = await fetch(`${API_BASE_URL}/api/advertiser/campaigns/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function createCampaign(payload: Omit<Campaign, "id"|"createdAt"|"updatedAt">): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCampaign(id: number, payload: Omit<Campaign, "id"|"createdAt"|"updatedAt">): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCampaign(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, { method: "DELETE", cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
}

export type Message = {
  id: number;
  campaignId: number;
  type: "SMS" | "MMS" | "RCS";
  title: string;
  content: string;
  status: "DRAFT" | "READY" | "SENT" | "PAUSED";
  createdAt: string;
  updatedAt: string;
};

export async function listMessages(params?: { q?: string; type?: string; status?: string; campaignId?: number; }): Promise<Message[]> {
  const usp = new URLSearchParams();
  if (params?.q) usp.set("q", params.q);
  if (params?.type) usp.set("type", params.type);
  if (params?.status) usp.set("status", params.status);
  if (params?.campaignId) usp.set("campaignId", String(params.campaignId));
  const url = `${API_BASE_URL}/api/admin/messages${usp.toString() ? `?${usp.toString()}` : ""}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

export async function getMessage(id: number): Promise<Message | null> {
  const r = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

export async function createMessage(payload: Omit<Message, "id"|"createdAt"|"updatedAt">): Promise<Message> {
  const r = await fetch(`${API_BASE_URL}/api/admin/messages`, {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateMessage(id: number, payload: Omit<Message, "id"|"createdAt"|"updatedAt">): Promise<Message> {
  const r = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, cache: "no-store", body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteMessage(id: number): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, { method: "DELETE", cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
}

export type KpiDashboard = {
  totalSent: number;
  totalClicks: number;
  totalConversions: number;
  totalCost: string;
};

export type CampaignPerformance = {
  campaignId: number;
  campaignName: string;
  sent: number;
  clicks: number;
  conversions: number;
  cost: string;
};

export async function getKpiDashboard(campaignId?: number): Promise<KpiDashboard> {
  const url = campaignId 
    ? `${API_BASE_URL}/api/admin/kpi/dashboard?campaignId=${campaignId}`
    : `${API_BASE_URL}/api/admin/kpi/dashboard`;
  
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch KPI dashboard");
  return res.json();
}

export async function getCampaignsPerformance(): Promise<CampaignPerformance[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/kpi/campaigns-performance`, { 
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Failed to fetch campaigns performance");
  return res.json();
}
