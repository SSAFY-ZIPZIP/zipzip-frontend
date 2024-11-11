<script>
import { onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

    const loginWithKakao = () => {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
      window.location.href = kakaoAuthUrl; // 카카오 로그인 페이지로 리디렉션
    };

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          // 인가 코드를 백엔드 서버로 전송
          const response = await axios.post(`${baseUrl}/v1/oauth/login`, {
            code,
          });
          // 로그인 성공 시 토큰 등을 로컬 저장소에 저장
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          router.push("/"); // 메인 페이지로 이동
        } catch (error) {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          router.push("/"); // 메인 페이지로 이동
        }
      }
    });

    return {
      loginWithKakao,
    };
  },
};
</script>

<style scoped>
p {
  font-size: 1.2em;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background-color: #fee500;
  border: none;
  color: black;
  font-weight: bold;
  cursor: pointer;
}
</style>
