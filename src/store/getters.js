/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-08 20:09:30
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user,
  menus: state => state.user.menus,
  project: state => state.project.project,
  uploadUrl: state => state.project.uploadUrl,
  lookUrl: state => state.project.lookUrl,
  getUrl: state => state.settings.getUrl
};
export default getters;
