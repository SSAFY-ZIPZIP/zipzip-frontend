import { api } from "./index";

const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export const authApi = {
  getKakaoLoginUrl: () => {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  },
  loginWithKakao: (code) => {
    return api.post("/v1/oauth/login", { code });
  },
  logout: (refreshToken) => {
    return api.post("/v1/oauth/logout", null, {
      headers: {
        "X-Refresh": refreshToken,
      },
    });
  },
};
