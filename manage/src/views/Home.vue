<template>
  <el-container>
    <el-header>
        <h1>电商后台管理系统</h1>
        <button @click="back">退出</button>
    </el-header>
    <el-container>
      <el-aside width="200px" height="100%">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="unique"
        >
          <el-submenu :index="'' + item.id" v-for="item in list" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group
              
              v-for="ite in item.children"
              :key="ite.authName"
            >
              <router-link :to="'/home/' + ite.path">
                <el-menu-item :index="ite.id + ''">{{ ite.authName }}</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import http from "../Http/http";
export default {
  props: {},
  data() {
    return {
      list: [],
      unique: true,
      path: [
        { path: "/users", id: "0" },
        { path: "/rights", id: "1" },
        { path: "/roles", id: "2" },
        { path: "/goods", id: "3" },
        { path: "/params", id: "4" },
        { path: "/categories", id: "5" },
        { path: "/orders", id: "6" },
        { path: "/reports", id: "7" },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    back(){
      this.$router.push('/login')
      sessionStorage.removeItem('token')
    }
  },
  components: {},
  mounted() {
    http({
      url: "menus",
    }).then((res) => {
      console.log(res.data);
      this.list = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    width: 100%;
    height: 60px !important;
    color: white;
    font-size: 20px;
    letter-spacing: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1{
      font-size: 20px;
    }
    button{
      width: 50px;
      height: 26px;
      background-color: #909399;
      color: white;
      border-radius: 10%;
      border: none;
    }
  }
  .el-aside {
    background-color: #555c64;
  }
}
</style>
