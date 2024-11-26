import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

// axios 인스턴스
export const api = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// auth 요청 경로 목록
const authPaths = ["/v1/oauth/login", "/v1/oauth/logout", "/v1/oauth/reissue"];

// 인터셉터에서 auth 요청 구분
api.interceptors.request.use(
  (config) => {
    // URL이 auth 관련 경로인지 확인
    const isAuthRequest = authPaths.some((path) => config.url?.includes(path));

    // auth 요청이 아닐 때만 토큰 추가
    if (!isAuthRequest) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
