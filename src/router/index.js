import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Login
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
  
    children: [
      {path:"/welcome",component:()=>import('../components/welcome.vue')},
      { path: "/users", component: Users },
      {path:"/rights",component:()=>import('@/views/power/Rights.vue')},
      {path:"/roles",component:()=>import('@/views/power/Roles.vue')},
      {path:"/categories",component:()=>import('@/views/goods/cate.vue')},
      {path:"/params",component:()=>import('@/views/goods/params.vue')},
      {path:"/goods",component:()=>import('@/views/goods/goodsList.vue')},
      {path:"/goods/add",component:()=>import('@/views/goods/addgoods.vue')},
      {path:"/orders",component:()=>import('@/views/order/order.vue')},
      {path:"/reports",component:()=>import('@/views/report/report.vue')}
    ]
  }
];

const router = new VueRouter({
  routes
});
("b");
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  let tokenlogin = window.sessionStorage.getItem("token");
  if (!tokenlogin) return next("/login");
  next();
});

export default router;
