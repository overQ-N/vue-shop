import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import User from '../components/user/User.vue'
// import Roles from '../components/rights/Roles.vue'
// import Rights from '../components/rights/Rights.vue'
// import Welcome from '../components/Welcome.vue'
// import Categories from '../components/goods/Catagories.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/Home.vue')
// const Welcome = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/Welcome.vue')
const User = () => import(/* webpackChunkName: "user" */ '../components/user/User.vue')
const Roles = () => import(/* webpackChunkName: "rights" */ '../components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: "rights" */ '../components/rights/Rights.vue')
const Categories = () => import(/* webpackChunkName: "Cate" */ '../components/goods/Catagories.vue')
Vue.use(VueRouter)
// { path: '/welcome', component: Welcome, name: 'Welcome' },
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, name: 'Login' },
  {
    path: '/Home',
    component: Home,
    name: 'Home',
    redirect: '/users',
    children: [
    
      { path: '/users', component: User, name: 'User' },
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
