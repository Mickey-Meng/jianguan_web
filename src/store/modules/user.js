/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-15 11:49:23
 */
import {login, getUserInfo, loginMap} from "@/api/user";
import {getToken, setToken} from "@/utils/auth";
import {asyncRouters, resetRouter} from "../../router";
import {MessageBox, Message} from "element-ui";


import store from "../index";

const getDefaultState = () => {
  return {
    token: getToken("zj_token"),
    authToken: getToken("auth_token"),
    name: getToken("userName"),
    avatar: "",
    ID: getToken("ID"),
    roles: getToken("roles"),
    GROUPID: getToken("GROUPID"),
    menus: [],
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
  SET_NAME: (state, name) => {
    state.name = name;
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
    state.menus = menus;
  },
  SET_RIGHTS: (state, rights) => {
    state.rights = rights;
  }
};

const actions = {
  login({ commit }, userInfo) {
    let { username, pwd } = userInfo;
    return new Promise((resolve, reject) => {
      login(JSON.stringify(userInfo))
        .then(res => {
          /**
           * @Description: 诸暨用户登陆系统
           * @author wangharry
           * @param {}
           * @returns {}
           * @date 2021/7/21
           */
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
           * @author wangharry
           * @param {}
           * @returns {}
           * @date 2021/7/21
           */
          loginMap(username, pwd).then(res1 => {
            setToken("explorerId", res1.data.ID);
            getUserInfo(res1.data.ID).then(res2 => {
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
              let menuRights = res2.data.userAuth.menuCookie;
              let rights = getRight(menuRights);
              setToken("explorerRoles", res2.data.roles);
              setToken("rights", rights);
              commit("SET_RIGHTS", rights);
              if (!res2.data.userInfo.GROUPID) {
                Message({
                  message: "账户没有组织信息,请联系管理员",
                  type: "warning",
                  customClass: "message_override"
                });
                window.localStorage.clear();
                reject();
                return false;
              }
              commit("SET_GROUPID", res2.data.userInfo.GROUPID);
              setToken("GROUPID", res2.data.userInfo.GROUPID);
              setToken("name", res2.data.userInfo.USERNAME);
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
        asyncRoutersData.forEach(route => {
          const tmp = { ...route };
          if (codesRights.indexOf(tmp.meta.code) !== -1) {
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
        let routers = filterAsyncRouter(asyncRouters, state.rights);
        let filRouters = routers.filter(e => e.children.length>0)

        let router = resetRouter();
        router.addRoutes(filRouters);
        commit("SET_MENUS", filRouters);
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
