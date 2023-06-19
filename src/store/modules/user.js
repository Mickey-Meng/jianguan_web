/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-15 11:49:23
 */
import {doLogin, getUserInfo, loginMap} from "@/api/user";
import {getToken, setToken} from "@/utils/auth";
import {asyncRouters, resetRouter} from "../../router";
// import {loadView} from "../../router/loadView";
import ParentView from '@/components/ParentView'
import {MessageBox, Message} from "element-ui";

import Layout from '@/layout/index'


import store from "../index";

const getDefaultState = () => {
  return {
    token: getToken("zj_token"),
    authToken: getToken("auth_token"),
    rolePerms: getToken("role_perms"),
    name: getToken("userName"),
    avatar: "",
    deptName: "",
    ID: getToken("ID"),
    roles: getToken("roles"),
    GROUPID: getToken("GROUPID"),
    menus: [],
    menu: [],
    roleId:getToken('groupId'),
    rights: getToken("rights") ? getToken("rights") : []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_AUTH_TOKEN: (state, authToken) => {
    state.authToken = authToken;
  },
  SET_ROLE_PERMS: (state, rolePerms) => {
    state.rolePerms = rolePerms;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_DEPTNAME: (state, deptName) => {
    state.deptName = deptName;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ID: (state, id) => {
    state.ID = id;
  },
  SET_ROLE_ID: (state,id) => {
    state.roleId = id
  },
  SET_GROUPID: (state, id) => {
    state.GROUPID = id;
  },
  SET_ROELS: (state, roles) => {
    state.roles = roles;
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus.filRouters;
    state.menu = menus.filRouters[menus.defaultIndex].children || [];
  },
  SET_RIGHTS: (state, rights) => {
    state.rights = rights;
  }
};

const actions = {
  // 登录
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      doLogin(JSON.stringify(loginForm)).then(res => {
        console.log("modules/user.login.doLogin->then:");
        console.log(res);
        if (!res.data) {
          reject(res);
        }
        let { userInfo } = res.data;
        if (!userInfo && !userInfo.deptId) {
          Message({
            message: "账户没有组织信息,请联系管理员",
            type: "warning",
            customClass: "message_override"
          });
          window.localStorage.clear();
          reject(res);
          return false;
        }
        // 设置store信息
        commit("SET_TOKEN", res.data.jwtToken); //ZHU_ji原token，取消
        commit("SET_AUTH_TOKEN", userInfo.token);
        commit("SET_NAME", userInfo.nickName);
        debugger
        commit("SET_DEPTNAME", userInfo.deptName);
        commit("SET_ID", userInfo.userId);
        commit("SET_ROLE_ID", userInfo.roleId);
        commit("SET_GROUPID", userInfo.deptId);
        commit("SET_ROLE_PERMS", userInfo.rolePermission);

        setToken("zj_token", res.data.jwtToken); //ZHU_ji原token，取消
        setToken("auth_token", userInfo.token);
        setToken("name", userInfo.nickName);
        setToken("ID", userInfo.userId);
        setToken("userName", userInfo.nickName);
        setToken("role_perms", userInfo.rolePermission);

        setToken("groupId", userInfo.deptId);
        setToken("GROUPID", userInfo.deptId);


        // TODO 地图信息
        setToken("explorerId", userInfo.userId);
        setToken("explorerRoles", userInfo.roleIds);
        // 菜单信息
        let usermenuCodeList = userInfo.menuPermission;

        ////////////////////
        // 目前菜单写死，且不返回1.0版本的code，所以这里根据返回菜单动态生成code
        const rescode = []
        function getMenuCode(asyncRoutersData, codesRights) {
          asyncRoutersData.forEach(route => {
            const tmp = { ...route };
            rescode.push(tmp.path)
            if (tmp.children) {
              tmp.children = getMenuCode(tmp.children, codesRights);
            }
          });
        }
        getMenuCode(res.data.menus);
        // console.log(rescode)

        commit("SET_RIGHTS", rescode);
        setToken("rights", rescode);
        ////////////////////
        // commit("SET_RIGHTS", usermenuCodeList);
        // setToken("rights", usermenuCodeList);

        loginMap('', '').then(res1 => {
          store.dispatch("user/getUserRights").then(res3 => {
            console.log(res3)
            resolve(res);
          });
        });

        // 遍历后台传来的路由字符串，转换为组件对象
        function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
          return asyncRouterMap.filter((route) => {
            if (type && route.children) {
              route.children = filterChildren(route.children);
            }
            if (route.component) {
              // Layout ParentView 组件特殊处理
              if (route.component === "Layout") {
                route.component = Layout;
              } else if (route.component === "ParentView") {
                route.component = ParentView;
              } else {
                // route.component = route.component.replace("/views", "")
                route.component = loadView(route.component);
                // if (route.query) route.query.meta = {...route.query.meta, ...JSON.parse(route.query)}
              }
            }
            if (route.children != null && route.children && route.children.length) {
              route.children = filterAsyncRouter(route.children, route, type);
            } else {
              delete route["children"];
              delete route["redirect"];
            }
            return true;
          });
        }

        function filterChildren(childrenMap, lastRouter = false) {
          var children = [];
          childrenMap.forEach((el, index) => {
            if (el.children && el.children.length) {
              if (el.component === "ParentView") {
                el.children.forEach((c) => {
                  c.path = el.path + "/" + c.path;
                  if (c.children && c.children.length) {
                    children = children.concat(filterChildren(c.children, c));
                    return;
                  }
                  children.push(c);
                });
                return;
              }
            }
            if (lastRouter) {
              el.path = lastRouter.path + "/" + el.path;
            }
            children = children.concat(el);
          });
          return children;
        }
        const loadView = (view) => {
          console.log(`@${view}`)
          if (process.env.NODE_ENV === 'development') {
            return (resolve) => require([`@${view}.vue`], resolve)
          } else {
            // 使用 import 实现生产环境的路由懒加载
            return () => import(`@${view}`)
          }
        }

        // let filRouters = filterAsyncRouter(res.data.menus)
        // let router = resetRouter();
        // router.addRoutes(filRouters);
        // commit("SET_MENUS", filRouters);
        // setToken("routerMenus", filRouters);
        // resolve(res);

      }).catch(error => {
        console.log("modules/user.login.doLogin->catch:");
        console.log(error);

        Message({
          message: "用户名或密码错误！连续错误五次将锁定十分钟！",
          type: "warning",
          customClass: "message_override"
        });
        reject(error)
      })
    })
  },

  login1({ commit }, userInfo) {
    let { username, pwd } = userInfo;
    return new Promise((resolve, reject) => {
      login(JSON.stringify(userInfo))
        .then(res => {
          if (!res.data) {
            reject(res);
          }
          let {groupid, loginData} = res.data;
          if (loginData) {
            commit("SET_TOKEN", loginData.token);
            commit("SET_AUTH_TOKEN", loginData.authToken);
            commit("SET_NAME", loginData.name);
            commit("SET_ID", loginData.id);
            commit("SET_ROLE_ID", groupid);
            setToken("ID", loginData.id);
            setToken("zj_token", loginData.token);
            setToken("auth_token", loginData.authToken);
            setToken("userName", loginData.name);
            setToken("groupId", groupid);
          }
          /**
           * @Description: explorer 运维用户登陆获取地图图层信息 explorer 123456
           */
          loginMap(username, pwd).then(res1 => {
            setToken("explorerId", res1.data.ID);
            getUserInfo(res1.data.ID).then(res2 => {
              console.log("getUserInfo:res2");
              console.log(res2);
              let arr = [];
              const getRight = nodes => {
                if (!nodes) {
                  return false;
                }
                for (let ni of nodes) {
                  const { MENUCODE, children } = ni;
                  if (MENUCODE) arr.push(MENUCODE);
                  if (children) {
                    getRight(children);
                  }
                }
                return arr;
              };
              let menuRights = res2.data.menuTree;
              let rights = getRight(menuRights);
              setToken("explorerRoles", res2.data.roles);
              setToken("rights", rights);
              commit("SET_RIGHTS", rights);
              if (!res2.data.userInfo.deptId) {
                Message({
                  message: "账户没有组织信息,请联系管理员",
                  type: "warning",
                  customClass: "message_override"
                });
                window.localStorage.clear();
                reject();
                return false;
              }
              commit("SET_GROUPID", res2.data.userInfo.deptId);
              setToken("GROUPID", res2.data.userInfo.deptId);
              setToken("name", res2.data.userInfo.nickName);
              store.dispatch("user/getUserRights").then(res3 => {
                resolve(res);
              });
            });
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getUserRights({ commit }, item) {
    return new Promise((resolve, reject) => {
      function filterAsyncRouter(asyncRoutersData, codesRights) {
        const res = [];
        asyncRoutersData.forEach((route,index) => {
          const tmp = { ...route };
          ////////////////////
          // 目前菜单写死，且不返回1.0版本的code，所以这里根据返回菜单动态生成code
          // if (codesRights.indexOf(tmp.meta.code) !== -1) {
          if (codesRights.indexOf(tmp.path) !== -1) {
            if (tmp.children) {
              tmp.children = filterAsyncRouter(tmp.children, codesRights);
            }
            res.push(tmp);
          }
        });
        return res;
      }
      let userId = store.getters.userInfo.ID;
      if (userId) {
        let defaultIndex = 0;
        let routers = filterAsyncRouter(asyncRouters, state.rights);
        let filRouters = routers //.filter(e => e.children && e.children.length>0)

        routers.forEach((item, index) => {
          if (item.path == "/jianshezhuanti") defaultIndex = index;
        })

        let router = resetRouter();
        router.addRoutes(filRouters);
        localStorage.setItem('defaultIndex', defaultIndex);
        commit("SET_MENUS", {filRouters, defaultIndex} );
        setToken("routerMenus", filRouters);
        resolve(filRouters);
      } else {
        reject();
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
