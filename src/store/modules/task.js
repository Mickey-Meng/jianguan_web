

const state = {
    agencytasknum:0,
    copytasknum:0
}

const mutations = {
  UPDATE_AGENCY_NUM: (state, agencytasknum) => {
    state.agencytasknum = agencytasknum
  },
  UPDATE_COPY_NUM: (state, copytasknum) => {
    state.copytasknum = copytasknum
  }
}

const actions = {
  updateAgencyNum({
    commit
  }, agencytasknum) {
    commit('UPDATE_AGENCY_NUM', agencytasknum)
  },
  updateCopyNum({
    commit
  }, copytasknum) {
    commit('UPDATE_COPY_NUM', copytasknum)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
