<template>
  <div class="all">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }"
        >用户管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/home/users' }"
        >用户列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 搜索框 -->

    <div class="main">
      <div class="input">
        <input type="text" v-model="search_val" />
        <button class="search" @click="search_">
          <i class="fa fa-search" size="36px"></i>
        </button>
        <button class="adduser" @click="add_">添加用户</button>
      </div>
      <!-- 表格 -->
      <div class="table_list" style="width: 100%">
        <el-table :data="tableData" style="width: 100%" :stripe="true">
          <el-table-column label="#" width="90">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <span>{{ scope.row.role_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"> </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                class="fa fa-pencil"
              ></el-button>
              <!-- 删除 -->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                class="fa fa-trash-o"
              ></el-button>
              <!-- 设置 -->
              <el-button
                size="small"
                type="warning"
                @click="change(scope.$index, scope.row)"
                class="fa fa-gear"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ye"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="all"
          @next-click="next"
          @prev-click="up"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 删除 -->
    <el-button type="text"></el-button>
    <!-- 添加 -->
    <div class="add" v-show="add_show">
      <div class="both_add">
        <div class="add_top">
          <span>添加用户</span>
          <span class="fa fa-remove" @click="add_noshow"></span>
        </div>
        <div class="add_input">
          <div>
            <span>*</span>
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="username" />
          </div>
          <div>
            <span>*</span>
            <label for="pass">密码</label>
            <input type="password" id="pass" v-model="pwd" />
          </div>
          <div>
            <span>*</span>
            <label for="email">邮箱</label>
            <input type="text" id="email" v-model="eml" />
          </div>
          <div>
            <span>*</span>
            <label for="phone">手机</label>
            <input type="text" id="phone" v-model="phone" />
          </div>
        </div>
        <div class="submit">
          <button @click="no_add">取消</button>
          <button @click="add_people">确定</button>
        </div>
      </div>
    </div>
    <!-- 分配角色 -->
    <div class="change" v-show="change_info">
      <div class="change_text">
        <div class="change_top">
          <span>分配角色</span>
          <span class="fa fa-remove" @click="no_change"></span>
        </div>
        <div class="info">
          <div>
            <span>当前的用户：{{ y }}</span>
            <span></span>
          </div>
          <div>
            <span>当前的角色：{{ old }}</span>
            <span></span>
          </div>
          <div>
            <span>分配的新角色：</span>
            <span>
              <el-select v-model="value" placeholder="请选择" @change="ch">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="yes">
          <button @click="btn_noc">取消</button>
          <button @click="btn_change">确定</button>
        </div>
      </div>
    </div>
    <!-- 修改 -->
    <div class="add" v-show="alter_">
      <div class="both_add">
        <div class="add_top">
          <span>添加用户</span>
          <span class="fa fa-remove" @click="alter_no"></span>
        </div>
        <div class="add_input">
          <div>
            <label for="name">用户名</label>
            <input type="text" id="name" v-model="alter_name" disabled />
          </div>
          <div>
            <span>*</span>
            <label for="em">邮箱</label>
            <input type="text" id="em" v-model="alter_eml" />
          </div>
          <div>
            <span>*</span>
            <label for="ph">手机</label>
            <input type="text" id="ph" v-model="alter_phone" />
          </div>
        </div>
        <div class="submit">
          <button @click="no_alter">取消</button>
          <button @click="alter_yes">确定</button>
        </div>
      </div>
    </div>
    
  </div>
</template>
            
          

<script>
import Http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      // 用户输入的搜索框数据
      val: "",
      // 序号
      num: 0,
      // 用户数据
      tableData: [],
      // 页码
      ye: 1,
      // 条数
      tiao: 2,
      search: "",
      // 用户总数
      all: 0,
      // 控制添加弹出框的显示与隐藏
      add_show: false,
      // 用户名
      username: "",
      // 密码
      pwd: "",
      // 邮箱
      eml: "",
      // 手机
      phone: "",
      // 搜索框内容
      search_val: "",
      // 新数组用于保存搜索后的数据
      newarr: [],
      // 下拉框选项
      // options: [],
      // 分配框的显示与隐藏
      change_info: false,
      // 修改框的显示与隐藏
      alter_: false,
      // 修改框的用户名
      alter_name: "",
      alter_eml: "",
      alter_phone: "",
      // 修改数据是所用的id
      alter_id: 0,
      // 分配角色使用的id
      people_id: 0,
      options: [
        {
          value: "1",
          label: "主管",
        },
        {
          value: "2",
          label: "超级管理员",
          disabled: true,
        },
        {
          value: "3",
          label: "经理",
        },
        {
          value: "4",
          label: "秘书",
        },
        {
          value: "5",
          label: "司机",
        },
      ],
      value: "",
      some_id: 0,
      y: "",
      old:''
    };
  },
  methods: {
    // 获取用户列表
    get() {
      Http({
        url: `users?query=${this.search_val}&pagenum=${this.ye}&pagesize=${this.tiao}`,
      }).then((res) => {
        console.log(res);
        this.tableData = res.data.users;
        this.all = res.data.total;
      });
    },
    // 下一页
    next() {
      this.ye++;
      this.get();
    },
    // 上一页
    up() {
      this.ye--;
      this.get();
    },
    // 页面显示多少条
    handleSizeChange(val) {
      this.tiao = val;
      this.get();
    },
    // 跳转页面
    handleCurrentChange(val) {
      this.ye = val;
      this.get();
    },
    // 分配角色
    change(index, item) {
      this.change_info = true;
      console.log(index, item);
      this.people_id = item.id;
      this.y = item.username
      this.old = item.role_name
    },
    ch(v) {
      this.some_id = v;
    },
    // 点击确定提交分配
    btn_change() {
      Http({
        url: `users/${this.people_id}`,
        method: "put",
        data: {
          rid: this.some_id,
        },
      }).then((res) => {
        console.log(res);
        this.get();
        this.change_info = false;
      });
    },
    // 修改数据
    handleEdit(index, item) {
      this.alter_ = true;
      this.alter_name = item.username;
      this.alter_id = item.id;
    },
    // 点击确定修改数据
    alter_yes() {
      Http({
        url: `users/${this.alter_id}`,
        method: "put",
        data: {
          email: this.alter_eml,
          mobile: this.alter_phone,
        },
      }).then((res) => {
        console.log(res);
        this.alter_ = false;
        (this.alter_eml = ""), (this.alter_phone = "");
        this.get();
      });
    },
    // 点击X关闭修改弹出框
    no_alter() {
      this.alter_ = false;
    },
    // 点击取消关闭弹出框
    alter_no() {
      this.alter_ = false;
    },
    // 关闭分配弹出框
    no_change() {
      this.change_info = false;
    },
    // 点击取消关闭分配弹出框
    btn_noc() {
      this.change_info = false;
    },
    // 删除
    handleDelete(index, item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Http({
            url: `users/${item.id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.get();
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          console.log("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          console.log("取消");
        });
    },
    // 添加用户弹出框显示
    add_() {
      this.add_show = true;
    },
    // 添加用户弹出框的隐藏
    add_noshow() {
      this.add_show = false;
    },
    // 点击确定添加用户
    add_people() {
      Http({
        url: "users",
        method: "post",
        data: {
          username: this.username,
          password: this.pwd,
          email: this.eml,
          mobile: this.phone,
        },
      }).then((res) => {
        console.log(res);
        (this.username = ""),
          (this.pwd = ""),
          (this.eml = ""),
          (this.phone = "");
        if (res.data != null) {
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.add_show = false;
          this.get();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 点击取消关闭添加弹窗
    no_add() {
      this.add_show = false;
    },
    // 搜索
    search_() {
      if (this.search_val == "") {
        this.get();
      } else {
        Http({
          url: `users?query&pagenum=1&pagesize=${this.all}`,
        }).then((res) => {
          for (let i = 0; i < res.data.users.length; i++) {
            this.newarr.push(res.data.users[i].username);
          }
          let index = this.newarr.indexOf(this.search_val);
          Http({
            url: `users/${res.data.users[index].id}`,
          }).then((res) => {
            this.tableData = [];
            this.tableData.push(res.data);
            this.newarr = [];
          });
        });
      }
    },
  },
  components: {},
  mounted() {
    this.get();
  },
};
</script>

<style scoped lang="scss">
.all {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  padding: 20px;

  .main {
    background-color: white;
    padding: 20px;
    width: 90%;
    margin-top: 20px;
    .input {
      width: 450px;
      display: flex;
      input {
        width: 400px;
        height: 38px;
        border: 1px solid #c0c4cc;
        border-right: none;
        outline: none;
        font-size: 16px;
        padding-left: 10px;
        border-radius: 5px 0px 0px 5px;
      }
      .search {
        width: 80px;
        height: 40px;
        background-color: #f5f7fa;
        border: 1px solid #dcdfe6;
        font-size: 20px;
        color: #93969c;
        margin-right: 20px;
        border-radius: 0px 5px 5px 0px;
      }
      .adduser {
        width: 150px;
        height: 40px;

        background-color: #409eff;
        border: none;
        color: white;
        border-radius: 5px;
      }
    }
  }
  .add {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);

    display: flex;
    justify-content: center;
    align-items: center;
    .both_add {
      width: 50%;
      height: 35%;
      background-color: white;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 5px;
      .add_top {
        display: flex;
        justify-content: space-between;
        span:nth-child(2) {
          font-size: 20px;
          font-weight: 100;
          color: #757779;
        }
      }
      .add_input {
        margin-top: 30px;
        div {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 20px 0;
          span:nth-child(1) {
            color: red;
          }
          label {
            color: #606266;
            margin-left: 3px;
          }
          input {
            width: 85%;
            height: 30px;
            margin-left: 10px;
            outline: none;
            font-size: 16px;
            border: 1px solid #c0c4cc;
            border-radius: 5px;
            padding-left: 10px;
            box-sizing: border-box;
          }
        }
      }
      .submit {
        display: flex;
        justify-content: flex-end;
        button {
          width: 60px;
          height: 30px;
          margin-left: 20px;
          margin-top: 30px;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
        }
        button:nth-child(1) {
          background-color: white;
        }
        button:nth-child(2) {
          background-color: #409eff;
          color: white;
        }
      }
    }
  }
  .change {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .change_text {
      width: 50%;
      height: 30%;
      background-color: white;
      padding: 20px;
      box-sizing: border-box;

      .change_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-child(1) {
          font-size: 23px;
        }
        span:nth-child(2) {
          font-size: 24px;
          color: #757779;
        }
      }
      .info {
        div {
          margin-top: 10px;
        }
        div:nth-child(2),
        div:nth-child(1) {
          margin-top: 20px;
        }
      }
      .yes {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        button {
          width: 60px;
          height: 30px;
          margin-left: 20px;
          margin-top: 30px;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
        }
        button:nth-child(1) {
          background-color: white;
        }
        button:nth-child(2) {
          background-color: #409eff;
          color: white;
        }
      }
    }
  }
}
</style>
