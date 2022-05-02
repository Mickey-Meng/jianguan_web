/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-17 19:48:00
 */
import Vue from 'vue'
import Router from 'vue-router';

import { constantRoutes, asyncRoutes } from './router'

Vue.use(Router)

export const constantRouters = constantRoutes
export const asyncRouters = asyncRoutes

// console.log(asyncRoutes,1314)

//解决新版路由重复点击控制台报错问题
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

// const router = new VueRouter({
//   mode: 'history',
//   routes
// })

const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  base: '/zjBIM/',
  routes: constantRoutes
})

const router = createRouter()
// router.addRoutes(asyncRoutes)
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  return router
}
export default router
