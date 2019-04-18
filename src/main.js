// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cube from 'cube-ui'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import 'babel-polyfill'
import  '../static/css/common.css'
Vue.use(Vuex)
FastClick.attach(document.body);
Vue.use(Cube)
Vue.config.productionTip = false

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.islogin == true) {
    if (sessionStorage.getItem('islogin') == 'letmyBoss') {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

