<template>
  <div class="all">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="top">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/roles' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item
        >权限列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      :border="true"
    >
      <el-table-column label="#">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名称">
        <template slot-scope="scope">
          <span size="small">{{ scope.row.authName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径">
        <template slot-scope="scope">
          <span size="small">{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.level == 0
                ? 'warning'
                : scope.row.level == 1
                ? 'success'
                : scope.row.level == 2
                ? ''
                : ''
            "
          >
            <span size="small">{{
              scope.row.level == 0
                ? "三级"
                : scope.row.level == 1
                ? "二级"
                : scope.row.level == 2
                ? "一级"
                : ""
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      tableData: [],
    };
  },
  methods: {},
  components: {},
  mounted() {
    Http({
      url: "rights/list",
    }).then((res) => {
      console.log(res);
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.all {
  padding: 20px;
  .top{
      margin-bottom: 20px;
  }
}
</style>
