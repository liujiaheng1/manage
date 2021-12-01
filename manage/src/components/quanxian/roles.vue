<template>
  <div class="all">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="top">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="both">
      <el-row class="btn">
        <el-col>
          <el-button type="primary" @click="add_">添加数据</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['border_b', index == 0 ? 'border_t' : '', 'vcenter']"
              v-for="(item, index) in scope.row.children"
              border
              :key="item.id"
            >
              <!-- 一级 -->
              <el-col :span="5" class="center">
                <el-tag closable @close="delete_three(scope.row.id, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三 -->
              <el-col :span="19">
                <el-row
                  class="border_b vcenter"
                  v-for="ite in item.children"
                  :key="ite.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="delete_three(scope.row.id, ite.id)"
                      type="success"
                      >{{ ite.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="it in ite.children"
                      :key="it.id"
                      type="warning"
                      @close="delete_three(scope.row.id, it.id)"
                      >{{ it.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column lable="操作">
          <template width="300" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="change(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delete_(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showset(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改用户 -->
    <div class="all_change" v-show="change_show">
      <div class="change_info">
        <div class="change_top">
          <span>修改用户</span>
          <span class="fa fa-remove" @click="guan"></span>
        </div>
        <div>
          <label for="name">当前角色:</label>
          <span>{{ change_name }}</span>
        </div>

        <div>
          <label for="use">角色描述:</label>
          <input type="text" id="use" v-model="change_new_name" />
        </div>
        <div>
          <span>新选角色:</span>
          <el-select
            v-model="value"
            clearable
            placeholder="请选择"
            @change="xuan"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ok">
          <button @click="guan">取消</button>
          <button @click="ok">完成</button>
        </div>
      </div>
    </div>
    <!-- 添加用户 -->
    <div class="add" v-show="add_show">
      <div class="both_add">
        <div class="add_top">
          <span>添加用户</span>
          <span class="fa fa-remove" @click="no_add"></span>
        </div>
        <div class="add_input">
          <div>
            <span>*</span>
            <label for="username" style="margin-right: 10px">角色名称: </label>
            <el-select
              v-model="v"
              clearable
              placeholder="请选择"
              @change="add_name"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <input type="text" id="username" v-model="old_username" /> -->
          </div>
          <div>
            <span>*</span>
            <label for="phone">角色描述:</label>
            <input type="text" id="phone" v-model="new_username" />
          </div>
        </div>
        <div class="submit">
          <button @click="no_add">取消</button>
          <button @click="add_people">确定</button>
        </div>
      </div>
    </div>
    <!-- 分配角色弹出框 -->
    
        <el-dialog
          title="提示"
          :visible.sync="set_right"
          width="50%"
          
        >
        <!-- 树状图 -->
          <el-tree :data="rights_list" show-checkbox :default-expand-all="true" :default-checked-keys="datatree" node-key="id" :props="tree" ref="treeRef"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="set_no">取 消</el-button>
            <el-button type="primary" @click="set_rights  "
              >确 定</el-button
            >
          </span>
        </el-dialog>
     
  </div>
</template>

<script>
import Http from "../../Http/http";
export default {
  props: {},
  data() {
    return {
      // 表格数据
      tableData: [],
      //控制编辑弹出框的显示与隐藏
      change_show: false,
      // 修改数据的id
      change_id: 0,
      // 修改数据的角色名称
      change_name: "",
      // 修改数据的角色描述
      change_new_name: "",
      options: [
        {
          value: "超级管理员",
          label: "超级管理员",
        },
        {
          value: "董事长",
          label: "董事长",
        },
        {
          value: "理事长",
          label: "理事长",
        },
        {
          value: "经理",
          label: "经理",
        },
        {
          value: "秘书",
          label: "秘书",
        },
      ],
      value: "",
      //   添加用户弹出框的显示与隐藏
      add_show: false,
      //添加用户的名称和描述
      old_username: "",
      new_username: "",
      //添加用户时选择的角色
      v: "",
      // 分配权限弹出窗的显示与隐藏
      set_right: false,
      // 所有权限数据
      rights_list:[],
      // 树形数据
      tree:{
        label:'authName',
        children:'children'
      },
      // 默认选中的数组
      datatree:[],
      // 角色id
      roleid:0
    };
  },
  methods: {
    get() {
      Http({
        url: "roles",
      }).then((res) => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
    // 删除
    delete_(index, item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Http({
            url: `roles/${item.id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.get();
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

    // 点击选项确认角色
    xuan(v) {
      this.change_name = v;
    },
    // 编辑
    change(index, item) {
      console.log(index, item);
      this.change_id = item.id;
      this.change_name = item.roleName;
      this.change_show = true;
    },
    // 点击X号和取消关闭编辑弹出框
    guan() {
      this.change_show = false;
    },
    // 点击确定修改数据
    ok() {
      Http({
        url: `roles/${this.change_id}`,
        method: "put",
        data: {
          roleName: this.change_name,
          roleDesc: this.change_new_name,
        },
      }).then((res) => {
        this.value = "";
        console.log(res);
        this.get();
        this.change_show = false;
        this.$message({
          type: "success",
          message: "修改成功!",
        });
      });
    },
    // 点击添加按钮打开弹出框
    add_() {
      this.add_show = true;
    },
    // 点击X和取消关闭弹出框
    no_add() {
      this.add_show = false;
    },
    // 点击确定添加
    add_people() {
      Http({
        url: "roles",
        method: "post",
        data: {
          roleName: this.old_username,
          roleDesc: this.new_username,
        },
      }).then((res) => {
        console.log(res);
        (this.new_username = ""), (this.old_username = ""), (this.v = "");
        this.get();
        this.add_show = false;
        if (res.data != null) {
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
        } else {
          this.$message.error({
            message: res.meta.msg,
          });
        }
      });
    },
    add_name(a) {
      this.old_username = a;
    },
    // 删除第三级权限 fid角色id cid权限id
    delete_three(fid, cid) {
      console.log(fid, cid);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Http({
            url: `roles/${fid}/rights/${cid}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.get();
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
    // 删除第二级权限
    delete_two(fid, cid) {
      console.log(fid, cid);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Http({
            url: `roles/${fid}/rights/${cid}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.get();
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
    // 删除第一级权限
    delete_one(fid, cid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Http({
            url: `roles/${fid}/rights/${cid}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.get();
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
    // 打开分配权限弹出框
    showset(item) {
      this.roleid = item.id
      Http({
        url:'rights/tree'
      }).then(res=>{
        console.log(res);
        this.rights_list = res.data
        console.log(this.rights_list);
      })
      this.get_id(item,this.datatree)

      this.set_right = true
    },
    // 关闭后清空数组
  set_no(){
    this.set_right = false
    this.datatree = []
  },
    // 获取三级权利的id
    get_id(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(it => {
          this.get_id(it,arr)
      });
    },
    // 点击确定分配权限
    set_rights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      Http({
        url:`roles/${this.roleid}/rights`,
        method:'post',
        data:{
          rids:idstr
        }
      }).then(res=>{
        console.log(res);
        this.set_right = false
        this.datatree = []
        this.get()
      })
    }
  },
  components: {},
  mounted() {
    this.get();
  },
};
</script>

<style scoped lang="scss">
.el-tag {
  margin: 20px;
}
.border_b {
  border-bottom: 1px solid #eee;
}
.border_t {
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vcenter {
  display: flex;
  align-items: center;
}
.all {
  padding: 20px;
}
.both {
  margin-top: 20px;
}
.btn {
  margin-bottom: 20px;
}
.all_change {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .change_info {
    width: 50%;
    height: 25%;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    .change_top {
      display: flex;
      justify-content: space-between;

      align-items: center;
      span:nth-child(1) {
        font-size: 20px;
        font-weight: 600;
      }
      span:nth-child(2) {
        font-size: 22px;
        color: #757779;
      }
    }
    div {
      margin: 20px;
      input {
        width: 85%;
        height: 30px;
        margin-left: 10px;
        outline: none;
        padding-left: 10px;
        border-radius: 5px;
        border: 1px solid #6062668c;
      }
    }
    .ok {
      display: flex;
      justify-content: flex-end;
      margin-top: 50px;
      button {
        width: 80px;
        height: 30px;
        margin-left: 10px;
        border: 1px solid #eee;
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
    height: 30%;
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
        //   justify-content: ;
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
</style>
