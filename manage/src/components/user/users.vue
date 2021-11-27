<template>
  <div class="all">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/users'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    
      <i class="fa fa-search-minus" style="width:50px; height:50px" ></i>
    
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.all{
  width: 100%;
  height: 100%;
  background-color: #EAEDF1;
  padding: 20px;
}
</style>
