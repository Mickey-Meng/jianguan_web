/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-15 11:49:23
 */
import { login, getUserInfo, loginMap } from "@/api/user";
import { getToken, setToken } from "@/utils/auth";
import { asyncRouters, resetRouter } from "../../router";

import store from "../index";

const getDefaultState = () => {
  return {
    token: getToken("zj_token"),
    name: getToken("userName"),
    avatar: "",
    ID: getToken("ID"),
    roles: getToken("roles"),
    GROUPID: getToken("groupId"),
    menus: [],
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
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ID: (state, id) => {
    state.ID = id;
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
          let { groupid, loginData } = res.data;
          if (loginData) {
            commit("SET_TOKEN", loginData.token);
            commit("SET_NAME", loginData.name);
            commit("SET_ID", loginData.id);
            setToken("ID", loginData.id);
            setToken("zj_token", loginData.token);
            setToken("userName",loginData.name);
            setToken("groupId",groupid);
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
              setToken("GROUPID", res2.data.userInfo.GROUPID);
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
        let router = resetRouter();
        router.addRoutes(routers);
        commit("SET_MENUS", routers);
        setToken("routerMenus", routers);
        resolve(routers);
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
