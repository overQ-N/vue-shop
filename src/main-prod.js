import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.styl'
import './assets/font/iconfont.css'
import './plugins/element.js'
// 树形组件
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入nprogress
import NProgress from 'nprogress'

import axios from 'axios'
axios.defaults.baseURL = 'http://47.115.48.144:3000/api/private/v1/'
axios.interceptors.request.use(function (config) {
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('vue_shop_token')
  return config
})
axios.interceptors.response.use(function (config) {
  NProgress.done()
  return config
})
Vue.config.productionTip = false
Vue.prototype.$axios = axios
// treetable组件
Vue.component('tree-table', TreeTable)
// 富文本
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
