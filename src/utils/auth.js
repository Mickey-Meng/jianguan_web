/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-11 13:38:15
 */
// import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }


// 从localstorage 取出一项数据
export const getToken = function (name) {
  return JSON.parse(localStorage.getItem(name))
}

//向localstorage存一项数据
export const setToken = function (name, obj) {
  localStorage.setItem(name, JSON.stringify(obj))
}

//删除

export const removeToken = function (name) {
  localStorage.removeItem(name)

}
