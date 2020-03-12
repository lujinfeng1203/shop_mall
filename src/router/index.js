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
    children: [
      { path: "/users", component: Users },
      {path:"/rights",component:()=>import('@/views/power/Rights.vue')},
      {path:"/roles",component:()=>import('@/views/power/Roles.vue')}
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
