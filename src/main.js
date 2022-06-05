import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(ElementUI)

const routes = [
  { path: '/', component: (resolve) => require(['./components/Index.vue'], resolve) },
  { path: '/video', name: 'video', component: (resolve) => require(['./components/Video.vue'], resolve) },
]

const router = new VueRouter({
  routes,
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
