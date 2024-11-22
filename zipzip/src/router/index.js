// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import OAuth from "@/views/OAuth.vue";
import LoginPage from "@/views/LoginPage.vue";
import SubscriptionPage from "@/views/SubscriptionPage.vue";
import WorkspacePage from "@/views/WorkspacePage.vue";

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/oauth",
    name: "OAuth",
    component: OAuth,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/cheongyak",
    name: "CheongyakZip",
    component: SubscriptionPage,
  },
  {
    path: "/workspace",
    name: "WorkspaceZip",
    component: WorkspacePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => console.log(to, from));

export default router;
