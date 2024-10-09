import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ()=>{
        return import("../views/home/index.vue")
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;