import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../views/Home.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/home',
    component:Home

  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path ==='/login') return next()
  let tokenlogin= window.sessionStorage.getItem('token')
  if(!tokenlogin) return next('/login')
  next()

})

export default router
