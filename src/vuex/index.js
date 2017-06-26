import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutations'
import frame from 'FRAME'

Vue.use(Vuex)
// 在Vue实例中通过this.vxMutations进行使用
frame.vueInstall({ module: 'vx', name: 'mutations' }, types)

const state = {
  month: 'M4',
  chemical: 'C2',
  factory: 'F4',
  sensor: 'S3'
}

const mutations = {
  [types.SWITCH_MONTH] (state, month) {
    state.month = month
  },
  [types.SWITCH_CHEMICAL] (state, ch) {
    state.chemical = ch
  },
  [types.SWITCH_FACTORY] (state, f) {
    state.factory = f
  },
  [types.SWITCH_SENSOR] (state, s) {
    state.sensor = s
  }
}

export default new Vuex.Store({
  strict: true,
  state,
  mutations
})
