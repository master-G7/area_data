import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import dataView from '@/components/dataView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta: {
        index: 0
      }
    },
    {
      path: '/dataView',
      name: 'dataView',
      component: dataView,
      meta: {
        index: 1,
        islogin:true
      }
    }
  ]
})
