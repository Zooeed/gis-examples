import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("../views/index.vue"),
		redirect:'fbo',
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
			{
				path: "sampler3d",
				name: "sampler3d",
				component: () => import("@/views/examples/cesium/sampler3d.vue")
			},
			{
				path: "windy",
				name: "windy",
				component: () => import("@/views/examples/cesium/windy.vue")
			},
		]
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;