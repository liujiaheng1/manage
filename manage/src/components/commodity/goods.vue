<template>
  <div class="box">
    <p class="top">
      <span>首页</span><span>></span> <span>商品管理</span><span>></span>
      <span>商品列表</span>
    </p>
    <div class="goodslist">
      <div class="search">
        <div>
          <input type="text" placeholder="请输入内容" />
          <button class="find"></button>
          <i class="fa fa-search"></i>
        </div>
        <button class="add_goods">添加商品</button>
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
    };
  },
  methods: {
    //修改
    handleEdit(index, row) {
      console.log(index, row);
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(typeof row.goods_id);
          http({
            url: `goods/${row.goods_id}`,
            method: "delete",
          }).then(() => {
            http({
              url: `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
            }).then((res) => {
              console.log(res.data);
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
        console.log(res.data);
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
      console.log(res.data.goods.length);
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
