import client from "./client";

export async function getHealth() {
  const res = await client.get("/health"); // 백엔드의 HealthController가 {"status":"ok"} 리턴
  return res.data;
}
