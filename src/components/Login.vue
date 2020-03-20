<template>
  <div class="login-container">
    <div class="login">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            autocomplete="off"
            prefix-icon="el-icon-unlock"
            v-model="loginForm.password"
            @change="login"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则
      loginRules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { require: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮，重置表单
    resetForm () {
      this.$refs.loginFormRef.resetFields();
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post('login', this.loginForm);
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            return false;
          }
          this.$message.success(res.meta.msg);
          sessionStorage.setItem('vue_shop_token', res.data.token)
          this.$router.push('/home');
        }
      });
    }
    
  }
};
</script>
<style lang="stylus" scoped>
.login-container
  height: 100%
  background: url('../assets/images/bg.jpg') no-repeat 100%
  background-size: 100% 100%
  display: flex
  justify-content: center
  align-items: center

  .login
    width: 500px
    height: 360px
    border-radius: 6px
    background: #9ebfcc
    display: flex
    align-items: center
    justify-content: center
    position: relative

    .logo
      position: absolute
      border-radius: 50%
      background-color: #ccc
      top: -20%
      left: 50%
      padding: 6px
      transform: translateX(-50%)
      box-shadow: 0 0 8px #ddd

      img
        width: 120px
        height: 120px
        border-radius: 50%

    .el-form
      margin-top: 0
      width: 60%
</style>
