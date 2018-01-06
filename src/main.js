/**
 * @Author: jzy
 * @Date: 2017/12/7
 * @Last Modified by: jzy
 * @Last Modified time: 2017/12/7
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router'
import routes from './routes'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Common from 'common/js/common'
import _ from 'lodash'
import 'common/js/validate'

Vue.use(VueRouter)
const router = new VueRouter(routes)

Vue.use(ElementUI)

// 在 Vue 原型上挂载 $http 方法
Vue.prototype.$http = axios.create({
  baseURL: window.serverUrl,
  timeout: 4000,
  // withCredentials: true, // 跨域请求时是否需要使用凭证
  paramsSerializer: function(params){
    // 序列化 get 请求参数 -> a: [1, 2] => a=1&a=2
    return qs.stringify(params, {arrayFormat: 'repeat'})
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
