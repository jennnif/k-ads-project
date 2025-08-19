import client from "./client";

export async function getParentSegments() {
  const res = await client.get("/admin/segments/parents");
  return res.data;
}
