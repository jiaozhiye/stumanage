<template>
<el-container id="app">
  <el-header>
    <AppHeader></AppHeader>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <AppSidebar></AppSidebar>
    </el-aside>
    <el-main>
      <transition name="router">
        <router-view class="view-wrapper"></router-view>
      </transition>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import 'common/css/reset.css'
import 'common/css/style.css'
import 'animate.css'

import AppHeader from 'components/Header.vue'
import AppSidebar from 'components/Sidebar.vue'

import {getCookie} from 'common/js/tools'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'app',
  data (){
    return {
      perInfo: {}
    }
  },
  methods: {
    ...mapActions([
      'createPersonalInfo'
    ]),
    getPerInfo(callback){
      const _this = this
      this.$http.get('/login/getUserInfo', {
        params: {
          id: getCookie('userId') || '10'
        }
      })
      .then(function (response){
        // console.log(response.data)
        if (response.data.code == 1){
          _this.perInfo.id = response.data.id
          _this.perInfo.name = response.data.name
          _this.perInfo.deptId = response.data.deptId
          _this.perInfo.type = response.data.type // 0 -> 普通员工    1 -> 部门经理    2 -> 管理员
          callback && callback()
        } else {
          _this.$message({
              type: 'error',
              message: response.data.message
          })
        }
      })
      .catch(function (error){
          console.log(error)
      })
    }
  },
  created(){
    this.getPerInfo(() => {
      this.createPersonalInfo(this.perInfo)
    })
  },
  components: {
    AppHeader,
    AppSidebar
  }
}
</script>

<style>
#app .el-header {
  background-color: #2dc3e8;
  line-height: 60px;
}
#app .el-container {
  height: calc(100vh - 60px);
}
#app .el-main {
  position: relative;
  background-color: #eee;
}
#app .view-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding: 20px;
  min-height: 400px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow-y: auto;
}

/**
 * form 校验提醒
 */
#app .formDanger > input {
    border-color: #fa5555!important;
}
#app .prompt-title {
    color: #fa5555;
    display: inline-block;
}

/**
 * 路由组件切换动画
 */
#app .router-enter {
  opacity: 0;
  -webkit-transform: translate3d(0, 25px, 0);
  transform: translate3d(0, 25px, 0);
}
#app .router-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-leave {
  opacity: 1;
}
#app .router-leave-to {
  opacity: 0;
}
#app .router-enter-to,
#app .router-leave {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-enter-active,
#app .router-leave-active {
  -webkit-transition: all .5s ease-out;
  transition: all .5s ease-out;
}

/**
 * form box style
 */
.app-form-panel {
    padding: 30px 40px 20px 20px;
}
.app-form-item {
  margin-bottom: 15px;
  clear: both;
}
.app-form-label {
  float: left;
  display: block;
  padding: 10px 15px;
  width: 80px;
  font-weight: 400;
  text-align: right;
  line-height: 20px;
  position: relative;
}
.app-form-label > i {
    color: #ff4545;
}
.app-input-block {
  margin-left: 110px;
  min-height: 40px;
  line-height: 40px;
  position: relative;
}
.form-group-apart {
    font-weight: 700;
    height: 20px;
    line-height: 20px;
    margin-bottom: 20px;
    font-size: 16px;
}
.form-group-apart .icon {
    color: #409eff;
    margin-right: 5px;
    font-size: 20px;
    vertical-align: middle;
}
.app-input-block .el-tree {
    background: none;
}
.app-input-block .el-radio + .el-radio {
    margin-left: 12px;
}

/**
 * paginatio style
 */
#app .el-pagination {
    text-align: center;
    padding-top: 20px;
}

/* 图标底部说明信息 */
.count-text {
    text-align: center;
    padding-top: 10px;
}
</style>