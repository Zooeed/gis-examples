import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("../views/index.vue"),
		children: [
			{
				path: "fbo",
				name: "Fbo",
				component: () => import("@/views/examples/cesium/fbo.vue")
			},
			{
				path: "primitive",
				name: "Primitive",
				component: () => import("@/views/examples/cesium/primitive.vue")
			},
			{
				path: "entity",
				name: "entity",
				component: () => import("@/views/examples/cesium/entity.vue")
			},
		]
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;