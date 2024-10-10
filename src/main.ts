import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate'; // 导入默认插件
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 创建 pinia 实例并使用持久化插件
const pinia = createPinia();
pinia.use(piniaPersist); // 使用插件

// 创建 Vue 应用实例
const app = createApp(App);

// 使用 Element Plus 并指定中文 locale
app.use(ElementPlus, { locale: zhCn });

// 使用路由
app.use(router);

// 使用 Pinia
app.use(pinia);

// 挂载应用到 DOM 元素
app.mount('#app');