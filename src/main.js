import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

let app = createApp(App)


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus);

app.use(router);
app.mount('#app');