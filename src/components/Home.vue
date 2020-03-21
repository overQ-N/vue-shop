<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
        <span>E-admin v1.0</span>
      </div>
      <!-- 用户信息下拉菜单 -->
      <el-dropdown @command="userCommand">
        <el-button type="primary">
          {{username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userinfo">个人作息</el-dropdown-item>
          <el-dropdown-item command="checkout">切换用户</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="isCollapse?'63px':'200px'">
        <el-button 
        :icon="isCollapse?'el-icon-document-add':'el-icon-document-remove'" 
        @click="toggleCollapse"
        type="info"
        size="medium"></el-button>
        <el-menu 
        :default-active="$route.path" 
        background-color="#545c64" 
        text-color="#fff" 
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        unique-opened>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item) in meuns" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="(subItem) in item.children" :key="subItem.id">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      username: '',
      meuns: [], // 左侧菜单列表数据
      iconObj: { // 字体图标
        125: 'iconfont icon-icon-test1',
        103: 'iconfont icon-root',
        101: 'iconfont icon-goods',
        102: 'iconfont icon-icon-test',
        145: 'iconfont icon-computer'
      },
      isCollapse: false // 是否折叠左侧菜单
    };
  },
  created () {
    this.getUserInfo();
    this.getrights()
  },
  methods: {
    async getrights () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.meuns = res.data
    },
    getUserInfo () {
      this.$route.params.uid = sessionStorage.getItem('vue_shop_uid') || this.$route.params.uid
      this.$axios.get('users/' + this.$route.params.uid).then(res => {
        sessionStorage.setItem('vue_shop_uid', this.$route.params.uid)
        this.username = res.data.data.username;
      });
    },
    userCommand (command) {
      if (command === 'logout') {
        sessionStorage.clear();
        this.$router.push('/login');
      }
      if (command === 'userinfo') {
      }
    },
    // 左侧菜单栏的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
  // props: ['uid']
};
</script>
<style lang="stylus" scoped>
.el-container
  height: 100%

  .el-header
    height: 60px
    background: #222
    display: flex
    justify-content: space-between

    .logo
      display: flex
      width: 200px
      justify-content: space-between
      align-items: center

      img
        width: 40px
        height: 40px

    .el-dropdown
      display: flex
      align-items: center
      
  .el-aside
    background-color: #545c64
    .el-button
      width 100%
    .el-menu
      border-right 0
      .iconfont
        margin-right 10px
        color #fff
      .el-menu-item
        padding 0 15px
  .main
    text-align left!important
    color #fff      
</style>
