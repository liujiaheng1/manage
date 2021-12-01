<template>
  <div class="cate_box">
    <p class="top">
      <span>首页</span><span>></span> <span>商品管理</span><span>></span>
      <span>商品列表</span>
    </p>
    <el-button type="primary" style="margin: 20px" @click="add"
      >添加分类</el-button
    >
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
      :default-expand-all="isshow"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="#" type="" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.ind }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称" width="180">
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template>
          <i class="el-icon-success" style="color: #90ee90"></i>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序" width="180">
        <template slot-scope="scope">
          <el-tag :type="colorArr[scope.row.cat_level]">{{
            typeArr[scope.row.cat_level]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 15, 20, 25]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="res">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="res.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-cascader
            :options="catlist"
            v-model="categories"
            :props="{
              value: 'cat_id',
              label: 'cat_name',
            }"
            :plain="true"
            @change="chan"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      index: 1,
      tableData: [],
      currentPage: 1,
      pagesize: 5,
      typeArr: ["一级", "二级", "三级"],
      colorArr: ["", "success", "warning"],
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      catlist: [],
      categories: "",
      isshow: false,
      res: {
        cat_pid: "",
        cat_name: "",
        cat_level: "",
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      http({
        url: `categories?pagenum=${val}&pagesize=${this.pagesize}`,
      }).then((res) => {
        console.log(res);
        this.tableData = res.data.result;
        let num = 1;
        for (let index in this.tableData) {
          this.tableData[index].ind = num++;
        }
      });
    },
    //添加分类
    add() {
      this.dialogFormVisible = true;
    },
    chan(v) {
      console.log(v[0], v.length);
      if (v.length === 0) {
        // 证明没有选中任何父级分类
        this.res.cat_pid = 0;
        this.res.cat_level = 0;
      } else {
        // 选中父级分类
        this.res.cat_pid = v[v.length - 1];
        // 设置分类等级
        this.res.cat_level = v.length;
      }
    },
    //提交
    submit() {
      http({
        url: "categories",
        method: "post",
        data: this.res,
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
        this.$message({
          message: res.meta.msg,
          type: "success",
        });
      });
    },
  },
  components: {},
  mounted() {
    http({
      url: `categories?pagenum=${this.currentPage}&pagesize=${this.pagesize}`,
    }).then((res) => {
      console.log(res);
      this.total = res.data.total;
      this.tableData = res.data.result;
      console.log(this.tableData);
      let num = 1;
      for (let index in this.tableData) {
        this.tableData[index].ind = num++;
      }
    });
    http({
      url: "categories",
    }).then((res) => {
      console.log(res.data);
      this.catlist = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.cate_box {
  .top {
    span {
      margin-right: 10px;
      color: #77797d;
    }
    span:nth-child(1) {
      font-weight: bold;
    }
  }
}
</style>
