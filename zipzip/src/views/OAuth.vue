<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "@/apis/auth";

export default {
  setup() {
    const router = useRouter();

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          console.log("code", code);
          // 인가 코드를 auth.loginWithKakao 메서드에 전달하여 로그인 처리
          const response = await authApi.loginWithKakao(code);
          // 로그인 성공 시 액세스 토큰과 리프레시 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("memberId", response.data.memberId);
          router.push("/"); // 메인 페이지로 이동
        } catch (error) {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          router.push("/"); // 메인 페이지로 이동
        }
      }
    });

    return {};
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
