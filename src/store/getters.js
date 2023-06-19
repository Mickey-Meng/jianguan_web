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
  authToken: state => state.user.authToken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user,
  deptName: state => state.user.deptName,
  menus: state => state.user.menus,
  menu: state => state.user.menu,
  project: state => state.project.project,
  uploadUrl: state => state.project.uploadUrl,
  lookUrl: state => state.project.lookUrl,
  getUrl: state => state.settings.getUrl,
  roleId: state => state.user.roleId,
  rolePerms: state => state.user.rolePerms,
  rights: state => state.user.rights,
  isMine: state => state.project.isMine,
  agencytasknum: state => state.task.agencytasknum,
  copytasknum: state => state.task.copytasknum,
};
export default getters;
