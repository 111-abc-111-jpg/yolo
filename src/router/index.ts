import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import UserInfoVue from '../views/user/UserInfo.vue';
import UserResetPasswordVue from '../views/user/UserResetPassword.vue';
import Echar from '../views/echartsIndex/ech.vue';
import Board from '../views/board/board.vue';
import Warn from '@/views/warn/warn.vue';

// 定义路由数组的类型
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'about',
    component: () => import('../views/login.vue'), // 懒加载组件
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'), // 懒加载组件
    // 重定向
    redirect: '/echar/ech',
    // 子路由
    children: [
      { path: '/user/info', component: UserInfoVue },
      { path: '/user/password', component: UserResetPasswordVue },
      { path: '/echar/ech', component: Echar },
      { path: '/board/board', component: Board },
      { path: '/warn/warn', component: Warn },
    ],
  },
  {
    path: '/',
    redirect: '/login',
  },
];

// 创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
