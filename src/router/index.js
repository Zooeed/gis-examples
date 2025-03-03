import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => {
			return import("../views/home/index.vue")
		},
	},
	{
		path: "/fbo",
		name: "Fbo",
		component: () => {
			return import("@/views/examples/cesium/fbo.vue")
		},
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;