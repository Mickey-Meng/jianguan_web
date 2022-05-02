/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-11 10:02:53
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-20 13:43:43
 */
import { getToken, setToken } from "@/utils/auth";

const getDefaultState = () => {
  return {
    project: getToken("project_info"),
    uploadUrl: "/ZhuJiRoad/mong/upload",
    lookUrl: "/ZhuJiRoad/mong/preview?fileid="
  };
};

const state = getDefaultState();

const mutations = {
  SET_PROJECT: (state, item) => {
    setToken("project_info", item);
    state.project = item;
  }
};

const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
