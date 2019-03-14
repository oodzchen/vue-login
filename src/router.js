import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './components/Login'
import HelloWorld from './components/HelloWorld'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/hello',
    component: HelloWorld
  }
]

const router = new VueRouter({
  routes
})

export default router
