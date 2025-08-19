import axios from "axios";

console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL); // ← 임시 로그

// 디버깅: 환경변수 확인
console.log("DEBUG VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  // 필요시 공통 헤더 예시:
  // headers: { "Content-Type": "application/json" },
  // withCredentials: true, // 쿠키 사용 시
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API Error]", err?.response || err?.message);
    return Promise.reject(err);
  }
);

export default client;
