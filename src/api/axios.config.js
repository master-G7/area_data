import axios from 'axios'
import qs from 'qs'
import {
  Toast
} from 'cube-ui'
// 响应时间
axios.defaults.timeout = 5 * 1000
// 配置cookie
axios.defaults.withCredentials = true
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'https://wx.richwin8.com/index.php/'
let tusi
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
    config => {
     if(config.url!='boss/getTodayData'){
      tusi = Toast.$create({
        txt: 'Loading...',
        mask: true,
        time:5000
      })
      tusi.show()
     }
      if (config.method === 'post') {
        config.data = qs.stringify(config.data)
      }
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )

// 返回

axios.interceptors.response.use(
  res => {
    if (res.data.errcode == 0) {
      tusi.hide()
      return res
    } else {
      tusi.hide()
     let warn = Toast.$create({
        txt: `错误代码${res.data.errcode}-${res.data.errmsg}`,
        type:'warn',
        time:2000,
      })
      warn.show()
    }
  },
  err => {
    console.log(err);
    return Promise.reject(err)
  }
)

  export function post(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then(
          res => {
            resolve(res.data)
          },
          err => {
            reject(err.data)
            console.log(err);
          }
        )
        .catch(err => {
          reject(err)
        })
    })
  }
  export function postformdata(url, params) {
    return new Promise((resolve, reject) => {
      const instance = axios.create({
        withCredentials: true
      })
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      instance
        .post(url, params, config)
        .then(
          res => {
            resolve(res.data)
          },
          err => {
            reject(err.data)
            console.log('终于找到你');
          }
        )
        .catch(err => {
          reject(err)
          console.log(1);
  
        })
    })
  }
  export function get(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    })
  }