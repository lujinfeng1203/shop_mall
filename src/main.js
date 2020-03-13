import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'


import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'


axios.interceptors.request.use(config => {
config.headers.Authorization=window.sessionStorage.getItem("token")
// Do something before request is sent

return config;
},error => {
// Do something with request error
return Promise.reject(error);
});

Vue.prototype.$http = axios





Vue.use(ElementUI);
Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
