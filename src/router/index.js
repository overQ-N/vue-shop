import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Roles from '../components/rights/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import Welcome from '../components/Welcome.vue'
import Categories from '../components/goods/Catagories.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, name: 'Login' },
  {
    path: '/Home',
    component: Home,
    name: 'Home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, name: 'Welcome' },
      { path: '/users', component: User },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Categories },
      { path: '/params', component: () => import('../components/goods/Params.vue') },
      { path: '/goods', component: () => import('@/components/goods/Goods.vue') },
      {
        path: '/goods/add', component: () => import('@/components/goods/Add.vue')
      },
      {
        path: '/orders', component: () => import('@/components/order/Order.vue')
      },
      {
        path: '/reports', component: () => import('@/components/report/Report.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('vue_shop_token')
  if (!token) return next('/login')
  next()
})
export default router
