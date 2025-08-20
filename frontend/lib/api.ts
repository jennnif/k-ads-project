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
    next: { revalidate: 0 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch parents: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchSegmentById(id: number): Promise<Segment | null> {
  const res = await fetch(`${API_BASE_URL}/api/admin/segments/${id}`, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchChildrenByParentId(id: number): Promise<Segment[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/segments/${id}/children`, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  return res.json();
}
