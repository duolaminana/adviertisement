/**
* 左边菜单
*/ 
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import { menu } from '../api/userMG'
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: [
        {
          menuid: 1,
          icon: 'li-icon-xitongguanli',
          menuname: '酒店管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-cus-manage',
              menuname: '酒店管理',
              hasThird: 'N',
              url: 'system/user',
              menus: null
            },
          ]
        },
        {
          menuid: 3,
          icon: 'li-icon-xiangmuguanli',
          menuname: '广告管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 4,
              icon: 'icon-cat-skuQuery',
              menuname: '广告管理',
              hasThird: 'N',
              url: 'Advertisement/management',
              menus: null
            },
            {
              menuid: 5,
              icon: 'icon-cs-manage',
              menuname: '广告分组',
              hasThird: 'N',
              url: 'Advertisement/group',
              menus: null
            },
          ]
        },
        {
          menuid: 6,
          icon: 'li-icon-dingdanguanli',
          menuname: '设备管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 7,
              icon: 'icon-order-manage',
              menuname: '设备分组',
              hasThird: 'N',
              url: 'equipment/equGroup',
              menus: null
            },
          ]
        },
        {
          menuid: 8,
          icon: 'li-icon-dingdanguanli',
          menuname: '广告计划',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 9,
              icon: 'icon-order-manage',
              menuname: '播放计划',
              hasThird: 'N',
              url: 'plan/play',
              menus: null
            },
          ]
        },
      ]
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>