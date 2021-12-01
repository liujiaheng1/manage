<template>
  <div class="box">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主要视图区域 -->
    <el-card class="card1">
      <!-- 卡片视图区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="databtn_"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist1" border stripe class="older_list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | capitalize }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改地址 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <!-- 查看快递进度 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
            <!-- 订单详情按钮 -->
            <el-button
              type="success"
              icon="el-icon-document"
              size="mini"
              @click="addressData(scope.row)"
            ></el-button>
            <!-- 修改订单按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="overData(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityOptions"
            :props="props"
            collapse-tags
            v-model="addressForm.address1"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progresInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="numData" width="30%">
      <span>{{ numData_data }}</span>
    </el-dialog>

    <!-- 修改订单状态 -->
  </div>
</template>

<script>
import http from "../../Http/http";
import cityOptions from "./city_data2017_element.js";
export default {
  props: {},
  data() {
    return {
      // 查询对象
      queryInfo: {
        // 查询条件
        query: "",
        //页数
        pagenum: 1,
        //显示数量
        pagesize: 10,
      },
      total: 0,
      orderlist: [],
      orderlist1: [],
      // 弹出层判断
      addressVisible: false,
      // 弹出层输入内容
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省/市/区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 城市选择数据
      props: { multiple: true },
      cityOptions: cityOptions,

      // 快递查询
      progressVisible: false,
      progresInfo: [],
      // 订单详情
      numData: false,
      numData_data: [],
    };
  },
  methods: {
    // 实现页面分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    getOrderList() {
      http({
        url: `orders?pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}`,
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return console.log("获取订单列表失败");
        }
        this.total = res.data.total;
        this.orderlist = res.data.goods;
        console.log(this.orderlist);
      });
    },

    // 修改地址功能
    showBox() {
      this.addressVisible = true;
    },
    // 清空地址框
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    /**
     * 查询快递功能
     */
    showProgressBox() {
      this.progressVisible = true;
      http({
        url: "/kuaidi/1106975712662",
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return (
            this.$message.error("获得物流进度失败"),
            (this.progressVisible = false)
          );
        }
        this.progresInfo = res.data.data;
        this.progressVisible = true;
        console.log(this.progresInfo);
      });
    },

    // 订单详情
    addressData(a) {
      this.numData = true;
      console.log(a.order_id);
      http({
        url: `orders/${a.order_id}`,
      }).then((res) => {
        console.log(res);
        this.numData_data = res.data;
      });
    },
    // 修改订单状态
    overData(e) {
      console.log(e);
      http({
        url: `orders/68`,
        mothed: "put",
        data: {
          is_send: "1",
          pay_status: "1",
          order_pay: "1",
          order_price: 80,
        },
      }).then((res) => console.log(res));
    },

    // 查询数组
    databtn_() {
      console.log(this.queryInfo.query);
    },
  },
  mounted() {
    http({
      url: `orders?pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}`,
    }).then((res) => {
      if (res.meta.status !== 200) {
        return console.log("获取订单列表失败");
      }
      this.total = res.data.total;
      this.orderlist = res.data.goods;
      if (this.queryInfo.query == "") {
        this.orderlist1 = this.orderlist;
        // console.log(this.orderlist1);
      }
    });
  },
  components: {},
  filters: {
    capitalize: function (value) {
      let dt = new Date(value);
      let y = dt.getFullYear();
      let mm = dt.getMonth() + 1;
      let day = dt.getDate();
      let h = dt.getHours();
      let min = dt.getMinutes();
      let s = dt.getSeconds();
      return `${y}-${mm}-${day}-${h}:${min}:${s}`;
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
}
.card1 {
  margin-top: 17px;
}
.older_list {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
