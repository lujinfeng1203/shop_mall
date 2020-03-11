<template>
  <el-container class="container">
    <el-header>
      admin后台
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '55px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <el-menu
          :default-active="activePath"
          active-text-color="#409bff"
          background-color="#273046"
          text-color="#fff"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          router
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveActivePath('/' + subitem.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subitem.authName }}</span>
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
  name: "Home",
  data() {
    return {
      menuList: [],
      iconlist: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getMenuList() {
      let _this = this;
      this.$http.get("menus").then(function(res) {
        let data = res.data;
        console.log(data);
        if (data.meta.status !== 200)
          return _this.$message.error(data.meta.msg);
        _this.menuList = data.data;
      });
    },
    // 点击按钮展开/关闭
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.el-button {
  float: right;
  margin-top: 10px;
}
.el-menu {
  border-right: 0;
}
.el-header {
  background-color: #2b3a57;
  line-height: 60px;
  font-size: 26px;
  color: #fff;
}

.el-aside {
  background-color: #273046;
}
.el-main {
  font-size: 30px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.iconfont {
  margin-right: 20px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
