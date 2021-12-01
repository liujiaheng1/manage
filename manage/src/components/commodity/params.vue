<template>
  <div class="par_box">
    <p class="top">
      <span>首页</span><span>></span> <span>商品管理</span><span>></span>
      <span>商品列表</span>
    </p>
    <div class="content">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        style="width: 30%; margin-bottom: 20px"
      >
      </el-alert>
      <el-form label-width="120px">
        <el-form-item label="选择商品分类：">
          <el-cascader
            :options="catlist"
            v-model="categories"
            @change="find"
            :props="{
              value: 'cat_id',
              label: 'cat_name',
            }"
            :plain="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 参数类型动态和静态 -->
      <!-- 动态参数 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" style="margin: 10px 0" @click="addOne"
            >添加参数</el-button
          >
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <span style="width: 100%">{{ props.row.attr_vals }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="desc">
              <template slot-scope="scope">
                <el-button size="mini" @click="editone(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteone(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" style="margin: 10px 0" @click="addTwo"
            >添加属性</el-button
          >
          <el-table :data="tableData1" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item style="margin-left: 150px">
                    <!-- <span style="width: 100%" v-for="item in props.row.attr_vals.split(' ')" :key="item">{{item}} -->

                    <!-- </span> -->
                    <el-tag
                      :key="tag"
                      v-for="tag in props.row.attr_vals.split(' ')"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput"
                      >+ New Tag</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="desc">
              <template slot-scope="scope">
                <el-button size="mini" @click="edittwo(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deletetwo(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 参数添加 -->
    <el-dialog title="添加动态参数" :visible.sync="showone">
      <el-form :model="formone" :rules="rules" ref="formone">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="formone.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数id" prop="attr_id">
          <el-input v-model="formone.attr_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showone = false">取 消</el-button>
        <el-button type="primary" @click="submitOne">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 属性添加 -->
    <el-dialog title="添加静态属性" :visible.sync="showtwo">
      <el-form :model="formtwo" :rules="rulestwo" ref="formtwo">
        <el-form-item label="静态属性" prop="attr_name">
          <el-input v-model="formtwo.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数id" prop="attr_id">
          <el-input v-model="formtwo.attr_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showtwo = false">取 消</el-button>
        <el-button type="primary" @click="submitTwo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 属性修改 -->
    <el-dialog title="修改静态属性" :visible.sync="changetwo">
      <el-form
        :model="formchangetwo"
        :rules="ruleschangetwo"
        ref="formchangetwo"
      >
        <el-form-item label="静态属性" prop="attr_name">
          <el-input
            v-model="formchangetwo.attr_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showchangetwo = false">取 消</el-button>
        <el-button type="primary" @click="submitchangetwo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 参数修改 -->
    <el-dialog title="修改动态参数" :visible.sync="changeone">
      <el-form
        :model="formchangeone"
        :rules="ruleschangeone"
        ref="formchangeone"
      >
        <el-form-item label="动态参数" prop="attr_name">
          <el-input
            v-model="formchangeone.attr_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showchangeone = false">取 消</el-button>
        <el-button type="primary" @click="submitchangeone">确 定</el-button>
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
      catlist: [],
      categories: "",
      par_id: 0,
      activeName: "first",
      tableData: [],
      tableData1: [],
      inputVisible: false,
      inputValue: "",
      showone: false,
      showtwo: false,
      changetwo: false,
      changeone: false,
      newid: 0,
      //动态参数的参数
      formone: {
        attr_id: 0,
        attr_name: "",
        attr_sel: ["many"],
      },
      //动态参数的验证
      rules: {
        attr_name: [
          { required: true, message: "请填写参数名称", trigger: "blur" },
        ],
        attr_id: [{ required: true, message: "请填写参数id", trigger: "blur" }],
      },
      //静态属性的参数
      formtwo: {
        attr_id: 0,
        attr_name: "",
        attr_sel: ["only"],
      },
      //静态属性的验证
      rulestwo: {
        attr_name: [
          { required: true, message: "请填写属性名称", trigger: "blur" },
        ],
        attr_id: [{ required: true, message: "请填写属性id", trigger: "blur" }],
      },
      //静态属性的参数修改
      formchangetwo: {
        id: 0,
        attrld: 0,
        attr_name: "",
        attr_sel: ["only"],
      },
      //静态属性的验证修改
      ruleschangetwo: {
        attr_name: [
          { required: true, message: "请填写属性名称", trigger: "blur" },
        ],
      },
      //动态参数修改
      formchangeone: {
        id: 0,
        attrld: 0,
        attr_name: "",
        attr_sel: ["many"],
      },
      //动态验证修改
      ruleschangeone: {
        attr_name: [
          { required: true, message: "请填写参数名称", trigger: "blur" },
        ],
      },
    };
  },
  //选好之后的变化值
  methods: {
    find(v) {
      this.par_id = Number(v[0]);
      this.newid = Number(v[2]);
      //获取动态参数
      http({
        url: `categories/${Number(v[2])}/attributes`,
        params: { sel: "many" },
      }).then((res) => {
        this.tableData = res.data;
      });
      //获取静态属性
      http({
        url: `categories/${Number(v[2])}/attributes`,
        params: { sel: "only" },
      }).then((res) => {
        this.tableData1 = res.data;
      });
    },
    //标签页点击获取
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //动态参数的添加
    addOne() {
      this.showone = true;
    },
    //动态参数的提交
    submitOne() {
      this.showone = false;
      http({
        url: `categories/${this.formone.attr_id}/attributes`,
        method: "post",
        data: this.formone,
      }).then((res) => {
        console.log(res);
        this.$message({
          type: "success",
          message: res.meta.msg,
        });
      });
    },
    //动态参数的修改
    editone(index, row) {
      this.changeone = true;
      this.formchangeone.id = row.cat_id;
      this.formchangeone.attrld = row.attr_id;
      this.formchangeone.attr_name = row.attr_name;
    },
    //新的参数的添加
    submitchangeone() {
      this.changeone = false;
      http({
        url: `categories/${this.formchangeone.id}/attributes/${this.formchangeone.attrld}`,
        data: this.formchangeone,
        method: "put",
      }).then((res) => {
        console.log(res);
        this.$message({
          type: "success",
          message: res.meta.msg,
        });
      });
    },
    //动态参数的删除
    deleteone(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.formchangeone.id = row.cat_id;
        this.formchangeone.attrld = row.attr_id;
        http({
          url: `categories/${this.formchangeone.id}/attributes/${this.formchangeone.attrld}`,
          data: this.formchangeone,
          method: "delete",
        })
          .then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
          })
          .then(() => {
            http({
              url: `categories/${this.newid}/attributes`,
              params: { sel: "many" },
            }).then((res) => {
              this.tableData = res.data;
            });
          });
      });
    },
    //静态属性的添加
    addTwo() {
      this.showtwo = true;
    },
    //静态属性的提交
    submitTwo() {
      this.showtwo = false;
      http({
        url: `categories/${this.formone.attr_id}/attributes`,
        method: "post",
        data: this.formone,
      }).then((res) => {
        console.log(res);
        this.$message({
          type: "success",
          message: res.meta.msg,
        });
      });
    },
    //静态属性的修改
    edittwo(index, row) {
      this.changetwo = true;
      this.formchangetwo.id = row.cat_id;
      this.formchangetwo.attrld = row.attr_id;
      this.formchangetwo.attr_name = row.attr_name;
    },
    //新的属性提交
    submitchangetwo() {
      this.changetwo = false;
      http({
        url: `categories/${this.formchangetwo.id}/attributes/${this.formchangetwo.attrld}`,
        data: this.formchangetwo,
        method: "put",
      }).then((res) => {
        console.log(res);
        this.$message({
          type: "success",
          message: res.meta.msg,
        });
      });
    },
    //静态属性的删除
    deletetwo(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.formchangetwo.id = row.cat_id;
        this.formchangetwo.attrld = row.attr_id;
        http({
          url: `categories/${this.formchangetwo.id}/attributes/${this.formchangetwo.attrld}`,
          data: this.formchangetwo,
          method: "delete",
        })
          .then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
          })
          .then(() => {
            console.log(1);
            http({
              url: `categories/${this.newid}/attributes`,
              params: { sel: "only" },
            }).then((res) => {
              this.tableData1 = res.data;
            });
          });
      });
    },
  },
  components: {},
  mounted() {
    http({
      url: "categories",
    }).then((res) => {
      this.catlist = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.par_box {
  .top {
    span {
      margin-right: 10px;
      color: #77797d;
    }
    span:nth-child(1) {
      font-weight: bold;
    }
  }
  .content {
    padding: 20px;
    box-sizing: border-box;
    background-color: white;
    margin: 20px 0;
    border-radius: 8px;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-form-item {
  width: 100% !important;
}
.el-form-item__content {
  width: 100% !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin: 10px;
  vertical-align: bottom;
}
</style>
