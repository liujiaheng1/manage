import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:()=>import('../views/login.vue')
  },
  {
    path:'/home',
    component:()=>import('../views/home.vue')
  }
]

const router = new VueRouter({
  routes
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path != '/login' && !sessionStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})


export default router
