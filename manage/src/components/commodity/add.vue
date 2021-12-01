<template>
  <div class="add_box">
    <p class="top">
      <span>首页</span><span>></span> <span>商品管理</span><span>></span>
      <span>商品列表</span>
    </p>
    <div class="message">
      <p class="title">
        <i class="el-icon-info"></i>
        <span>添加商品信息</span>
      </p>
      <el-steps :active="selection" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs
        :tab-position="tabPosition"
        @tab-click="ind"
        :before-leave="beforeleave"
      >
        <el-tab-pane label="基本信息">
          <el-form
            :model="addObject"
            :rules="rules"
            ref="addObject"
            label-width="100px"
            class="demo-ruleForm"
          >
            <div class="row">
              <p><span>*</span>商品名称</p>
              <el-form-item prop="goods_name">
                <el-input
                  v-model="addObject.goods_name"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <p><span>*</span>商品价格</p>
              <el-form-item prop="goods_price">
                <el-input
                  v-model="addObject.goods_price"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <p><span>*</span>商品重量</p>
              <el-form-item prop="goods_weight">
                <el-input
                  v-model="addObject.goods_weight"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <p><span>*</span>商品数量</p>
              <el-form-item prop="goods_number">
                <el-input
                  v-model="addObject.goods_number"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <p><span>*</span>商品分类</p>
              <el-cascader
                :options="catlist"
                v-model="addObject.categories"
                :props="{
                  value: 'cat_id',
                  label: 'cat_name',
                }"
                :plain="true"
              ></el-cascader>
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 获取商品参数 -->
        <el-tab-pane label="商品参数">
          <el-checkbox v-model="checked">{{ addObject.goods_cat }}</el-checkbox>
        </el-tab-pane>
        <!-- 获取商品属性 -->
        <el-tab-pane label="商品属性">
          <div class="attr" v-for="items in onlyatt" :key="items.id">
            <p>{{ items.attr_name }}</p>
            <input type="text" :placeholder="items.attr_vals" />
          </div>
        </el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://192.168.1.61:8888/api/private/v1/upload"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor v-model="addObject.goods_introduce"></quill-editor>
          <el-button @click="add" type="primary" style="margin: 20px 0"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      tabPosition: "left",
      selection: 0,
      region: "",
      catlist: [],
      checked: true,
      onlyatt: [],
      addObject: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        categories: "",
        goods_introduce: "",
        goods_cat: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //跳转商品参数
    ind(v) {
      if (this.addObject.categories.length < 3) {
        this.$message.error("商品分类不能为空");
        this.selection = 0;
        return;
      } else {
        this.selection = Number(v.index);
      }
    },
    beforeleave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName, this.addObject.categories[2]);
      if (oldActiveName == 0 && this.addObject.categories.length < 3) {
        this.$message.error("商品分类不能为空");
        return false;
      }
      http({
        url: `categories/${Number(this.addObject.categories[2])}/attributes`,
        params: { sel: "many" },
      }).then((res) => {
        console.log(res.data[0].attr_vals);
        this.addObject.goods_cat = res.data[0].attr_vals;
      });
      http({
        url: `categories/${Number(this.addObject.categories[2])}/attributes`,
        params: { sel: "only" },
      }).then((res) => {
        console.log(res.data);
        this.onlyatt = res.data;
        // this.goods_att = res.data[0].attr_vals;
      });
    },
    //添加商品
    add() {
      console.log(
        this.addObject.goods_name,
        this.addObject.goods_cat,
        this.addObject.goods_price,
        this.addObject.goods_number,
        this.addObject.goods_weight
      );
      http({
        url: "goods",
        method: "post",
        data: {
          goods_name: this.addObject.goods_name,
          goods_cat: this.addObject.goods_cat,
          goods_price: this.addObject.goods_price,
          goods_number: this.addObject.goods_number,
          goods_weight: this.addObject.goods_weight,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.msg == "创建商品成功") {
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.$router.push("/home/goods");
        }
      });
    },
  },
  components: {},
  mounted() {
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
.add_box {
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
    width: 100%;
    padding: 20px;
    margin-top: 20px;
    box-sizing: border-box;
    background-color: white;
    .attr {
      p {
        font-size: 16px;
        color: #674e53;
      }
      input {
        width: 100%;
        height: 35px;
        text-indent: 20px;
        line-height: 35px;
        color: #606166;
        border-radius: 10px;
        border: 1px solid #dee1e7;
        outline: none;
        margin: 20px 0;
      }
    }
    title {
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #8f939a;
      //   display: flex;
      //   align-items: center;
      background-color: #f4f4f5;
    }
    .el-steps {
      margin: 20px 0;
    }
  }
  .row {
    .el-input {
      margin: 10px 0 10px -100px;
    }
    p {
      span {
        font-size: 16px;
        color: red;
        margin-right: 5px;
      }
      font-size: 16px;
      color: #4f4f75;
    }
    input {
      width: 95%;
      height: 35px;
      border-radius: 8px;
      border: 1px solid #e0e3e9;
      outline: none;
      margin: 20px 0;
    }
    .demo-ruleForm {
      position: relative;
      top: 20px;
      right: 100px;
    }
  }
}
</style>
