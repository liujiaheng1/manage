<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      list: [],
      timelist: [],
      addreelist: [],
      serve_list: [],
    };
  },
  methods: {
    load() {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        legend: {
          data: this.addreelist,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.timelist,
        },
        yAxis: {
          type: "value",
        },
        series: this.serve_list,
      };

      option && myChart.setOption(option);
    },
  },
  components: {},
  mounted() {
    this.load();
    http({
      url: "reports/type/1",
    }).then((res) => {
      this.list = res.data;
      this.timelist = this.list.xAxis[0].data;
      this.addreelist = this.list.legend.data;
      this.serve_list = res.data.series;
      this.$message({
        showClose: true,
        message: res.meta.msg,
        duration: 5000,
      });
      this.load();
    });
  },
};
</script>

<style scoped lang="scss">
.el-breadcrumb {
  padding-top: 20px;
  padding-left: 20px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
