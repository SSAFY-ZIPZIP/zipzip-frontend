import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./global.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useKakao } from "vue3-kakao-maps/@utils";

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

useKakao(kakaoKey);
createApp(App).use(router).mount("#app");
