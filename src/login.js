/**
 * @Author: jzy
 * @Date: 2017/12/7
 * @Last Modified by: jzy
 * @Last Modified time: 2017/12/7
 */
import Vue from 'vue'
import AppLogin from './Login.vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Common from 'common/js/common'
import 'common/js/validate'

Vue.use(ElementUI)

// 在 Vue 原型上挂载 $http 方法
Vue.prototype.$http = axios.create({
  baseURL: window.serverUrl,
  timeout: 4000
})

new Vue({
  el: '#app',
  render: h => h(AppLogin)
})
