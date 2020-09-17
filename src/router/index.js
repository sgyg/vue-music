import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: () => import("../components/recommend/recommend")
  },
  {
    path: "/singer",
    name: "Singer",
    component: () => import("../components/singer/singer"),
    children: [
      {
        path: ":id",
        component: () => import("../components/singer-detail/singer-detail.vue")
      }
    ]
  },
  {
    path: "/rank",
    name: "Rank",
    component: () => import("../components/rank/rank")
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../components/search/search")
  }
];

const router = new VueRouter({
  routes
});

export default router;
