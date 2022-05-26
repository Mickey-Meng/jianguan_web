/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:28
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-15 11:53:09
 */
import axios from 'axios'
import {
	MessageBox,
	Message
} from 'element-ui'
import store from '@/store'
import {
	getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	// baseURL:'http://192.168.2.32:8080',
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		if (config.url.indexOf('STSfmzj') != -1) {} else {
			if (store.getters.token) {
				config.headers['token'] = getToken('zj_token')
			}
		}
		if ((config.method === 'post' || config.method === 'put') && !config.headers['Content-Type']) {
			config.headers['Content-Type'] = 'application/json'
		}
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get http information such as headers or status
	 * Please return  response => response
	 */

	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	response => {
		const res = response.data
		if (res.status === 200 || res.meow === 0 || res.status === 300 || res.success === true) {
			return Promise.resolve(res)
		}

		// // if the custom code is not 20000, it is judged as an error.
		// if (res.code !== 20000) {
		//   Message({
		//     message: res.message || 'Error',
		//     type: 'error',
		//     duration: 5 * 1000
		//   })

		//   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
		//   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
		//     // to re-login
		//     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
		//       confirmButtonText: 'Re-Login',
		//       cancelButtonText: 'Cancel',
		//       type: 'warning'
		//     }).then(() => {
		//       store.dispatch('user/resetToken').then(() => {
		//         location.reload()
		//       })
		//     })
		//   }
		//   return Promise.reject(new Error(res.message || 'Error'))
		// } else {
		//   return res
		// }
	},
	error => {
		console.log('err' + error) // for debug
		Message({
			message: '请求失败',
			// message: error.message,
			type: 'error',
			duration: 1 * 1000
		})
		return Promise.reject(error)
	}
)

export default service
