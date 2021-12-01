import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/home.vue'),
    children: [
      { path: '/', redirect: 'welcome' },
      { path: 'welcome', component: () => import('../components/welcome/welcome.vue') },
      { path: 'users', component: () => import('../components/user/users.vue') },
      { path: 'roles', component: () => import('../components/quanxian/roles.vue') },
      { path: 'rights', component: () => import('../components/quanxian/rights.vue') },
      { path: 'goods', component: () => import('../components/commodity/goods.vue') },
      { path: 'params', component: () => import('../components/commodity/params.vue') },
      { path: 'add', component: () => import('../components/commodity/add.vue') },
      { path: 'categories', component: () => import('../components/commodity/categories.vue') },
      { path: 'orders', component: () => import('../components/order/orders.vue') },
      { path: 'reports', component: () => import('../components/data/reports.vue') },
    ]
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
