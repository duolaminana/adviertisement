// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// // 登录
// import login from '@/views/login';
// // 首页
// import index from '@/views/index';
// // 酒店管理
// import user from '@/views/system/user';
// // 广告管理
// import management from "@/views/Advertisement/management";
// // 广告分组
// import group from "@/views/Advertisement/group";
// // 设备分组
// import equGroup from "@/views/equipment/equGroup";
// // 播放计划
// import play from "@/views/plan/play";
// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
  routes: [
    {
      path: "/",
      name: "",
      // component: login,
      component: () => import("@/views/login"),
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/login",
      name: "登录",
      // component: login,
      component: () => import("@/views/login"),
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/index",
      name: "首页",
      // component: index,
      component: () => import("@/views/index"),
      redirect: "/system/user",
      iconCls: "el-icon-tickets",
      children: [
        {
          path: "/system/user",
          name: "酒店管理",
          // component: user,
          component: () => import("@/views/system/user"),
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/Advertisement/management",
          name: "广告管理",
          // component: management,
          component: () => import("@/views/Advertisement/management"),
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/Advertisement/group",
          name: "广告分组",
          // component: group,
          component: () => import("@/views/Advertisement/group"),
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/equipment/equGroup",
          name: "设备分组",
          // component: equGroup,
          component: () => import("@/views/equipment/equGroup"),
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/plan/play",
          name: "播放计划",
          // component: play,
          component: () => import("@/views/plan/play"),
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
});