import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import cookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$cookies = cookies

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

