<template>
  <div id="login">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="rules"
      >
        <!-- 登录用户名-->
        <el-form-item label prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item label prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 提交 -->
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      // 登录表单数据绑定
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 登录表单数据验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度3～10个字符"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度6～10个字符"
          }
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮触发
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields(); //重置函数
    },
    login() {
      let _this =this;
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // const {data}= await this.$http.post("login",this.loginForm);
        // console.log(data)
        this.$http
          .post("login", this.loginForm)
          .then(function(res) {
            let data = res.data;
            console.log(data)


           if(data.meta.status !==200) return _this.$message.error("登录失败");
           _this.$message({
             message:"登录成功",
             type:'success',
             duration:1000

           });
           window.sessionStorage.setItem("token",data.data.token);
           _this.$router.push('/home')


          })
          .catch(function(error) {
            console.log(error);
          });
      }); //预验证
    }
  }
};
</script>

<style scoped>
#login {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  height: 300px;
  width: 400px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  border: 1px solid #fff;
}
.login_logo {
  height: 100px;
  width: 100px;
  position: absolute;
  left: 50%;
  top: -20%;
  transform: translate(-50%, 0);
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  padding: 20px;
}
.login_logo img {
  height: 100%;
  width: 100%;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}
.login_button {
  display: flex;
  justify-content: center;
}
</style>
