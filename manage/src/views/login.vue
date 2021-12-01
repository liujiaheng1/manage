<template>
  <div class="all">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="name">
        <el-input v-model="ruleForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Http from "../Http/http";
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        name: "admin",
        pass: "123456",
        showClose: false,
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      Http({
        url: "login",
        method: "post",
        data: {
          username: this.ruleForm.name,
          password: this.ruleForm.pass,
        },
      })
        .then((res) => {
          console.log(res);
          sessionStorage.setItem("token", res.data.token);
          this.$message({
            showClose: true,
            message: "登录成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              this.$router.push("/home");
            },
          });
          sessionStorage.setItem("token", res.data.token);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    open2() {},
  },
  components: {},
};
</script>

<style scoped lang="scss">
.all {
  width: 100%;
  height: 100%;
  background: url("../assets/img/sign_bg.db29b0fb.png") no-repeat 0px 0px;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  form {
    width: 40%;
    background-color: white;
    height: 300px;
    padding: 50px 30px 0px 0px;
    border-radius: 15px;
    .el-form-item {
      margin-top: 25px;
    }
  }
}
</style>
