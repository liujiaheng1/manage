<template>
  <div class="box">
    <p class="top">
      <span>首页</span><span>></span> <span>商品管理</span><span>></span>
      <span>商品列表</span>
    </p>
    <div class="goodslist">
      <!-- 查询 -->
      <div class="search">
        <div>
          <input type="text" placeholder="请输入内容" v-model="find_id" />
          <button class="find" @click="sea"></button>
          <i class="fa fa-search"></i>
        </div>
        <button class="add_goods" @click="add">添加商品</button>
      </div>
    </div>
    <el-table :data="tableData.goods" style="width: 100%">
      <el-table-column label="#" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="650">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>商品名称: {{ scope.row.goods_name }}</p>
            <p>商品价格: {{ scope.row.goods_price }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.goods_name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品重量" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            new Date(scope.row.add_time)
              .toLocaleString("chinese", { hour12: false })
              .replaceAll("/", "-")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
    </div>
    <!-- 修改商品信息 -->
    <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称">
          <el-input v-model="addgoods.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="addgoods.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="addgoods.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="addgoods.goods_number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <!-- <el-button type="primary" @click="change">立即修改</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查询的内容 -->
    <el-dialog
      class="message"
      title="商品详情信息"
      :visible.sync="dialogFormVisibles"
    >
      <div>商品id：{{ find_good.goods_id }}</div>
      <div>商品名字：{{ find_good.goods_name }}</div>
      <div>商品价格：{{ find_good.goods_price }}</div>
      <div>商品重量：{{ find_good.goods_weight }}</div>
      <div>
        创建时间：{{
          new Date(find_good.add_time)
            .toLocaleString("chinese", { hour12: false })
            .replaceAll("/", "-")
        }}
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
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      pagenum: 1,
      dialogFormVisible: false,
      newId: "",
      addgoods: {
        goods_name: "",
        goods_number: "",
        goods_price: "",
        goods_weight: "",
        goods_id: "",
        cat_id: "",
        goods_cat: "",
      },
      show_: false,
      //查询
      find_id: "",
      find_good: [],
      dialogFormVisibles: false,
    };
  },
  methods: {
    //查询
    sea() {
      console.log(this.find_id);
      this.dialogFormVisibles = true;
      http({
        url: `goods/${this.find_id}`,
      }).then((res) => {
        console.log(res);
        this.find_good = res.data;
        console.log(this.find_good);
      });
    },
    //添加商品
    add() {
      this.$router.push("/home/add");
    },
    //修改
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.addgoods.goods_name = row.goods_name;
      this.newId = Number(row.goods_id);
      this.addgoods.goods_weight = row.goods_weight;
      this.addgoods.goods_price = row.goods_price;
      this.addgoods.goods_number = row.goods_number;
      this.addgoods.goods_id = row.goods_id;
      this.addgoods.cat_id = row.cat_id;
      console.log(row.goods_id);
      http({
        url: `goods/${row.goods_id}`,
      }).then((res) => {
        console.log(res);
        this.addgoods.goods_cat = res.data.goods_cat;
      });
    },
    //提交
    submitForm() {
      this.dialogFormVisible = false;
      http({
        url: `goods/${this.addgoods.goods_id}`,
        method: "put",
        data: this.addgoods,
      })
        .then((res) => {
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
        })
        .then(() => {
          http({
            url: `goods?pagenum=${this.currentPage}&pagesize=${this.pagesize}`,
          }).then((res) => {
            this.tableData = res.data;
          });
        });
    },

    //删除
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `goods/${row.goods_id}`,
            method: "delete",
          }).then(() => {
            http({
              url: `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
            }).then((res) => {
              this.tableData = res.data;
            });
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      http({
        url: `goods?pagenum=${val}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data;
        this.pagenum = Number(res.data.pagenum);
      });
    },
  },
  components: {},
  mounted() {
    http({
      url: `goods?pagenum=${this.currentPage}&pagesize=${this.pagesize}`,
    }).then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.box {
  .top {
    span {
      margin-right: 10px;
      color: #77797d;
    }
    span:nth-child(1) {
      font-weight: bold;
    }
  }
  .message {
    div {
      margin: 20px;
    }
  }
  .goodslist {
    .search {
      display: flex;
      background-color: white;
      margin-top: 20px;
      padding: 15px;
      div {
        display: flex;
        align-items: center;
        position: relative;
        input {
          width: 300px;
          height: 34px;
          border-radius: 5px 0 0 5px;
          border: 1px solid #e2e5eb;
          border-right: none;
          outline: none;
          padding: 0 0 0 15px;
          box-sizing: border-box;
        }
        .find {
          width: 62px;
          height: 34px;
          background-color: #f5f7fa;
          border-radius: 0 5px 5px 0;
          border: 1px solid #e2e5eb;
          border-left: none;
        }
        i {
          position: absolute;
          top: 50%;
          right: 6%;
          transform: translateY(-50%);
          color: #969a9e;
        }
      }
      .add_goods {
        width: 100px;
        height: 40px;
        background-color: #409eff;
        color: white;
        border-radius: 5px;
        border: none;
        margin-left: 20px;
      }
    }
  }
}
</style>
