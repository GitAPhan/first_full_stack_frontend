import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import cookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$cookies = cookies

new Vue({
  render: h => h(App)
}).$mount('#app')

