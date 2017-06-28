import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutations'
import frame from 'FRAME'

Vue.use(Vuex)
// 在Vue实例中通过this.vxMutations进行使用
frame.vueInstall({ module: 'vx', name: 'mutations' }, types)

const state = {
  month: 4,
  chemical: [],
  factory: [],
  sensor: [],
  threshold: {
    Chlorodinine: 3.0,
    Methylosmolene: 0.5,
    Appluimonia: 5.0,
    'AGOC-3A': 5.0
  },
  chemicalToken: null,
  windToken: null,
  sctDataToken: null, // 传感器-化学物质-时间-读数 数据的token
  sctBarChart: [], // {sensor: 1, chemical: 'C', month: 'M4' }
  diffChart: [],
  selectedBar: null
}

const mutations = {
  [types.SWITCH_MONTH] (state, month) {
    state.month = month
  },
  [types.SWITCH_CHEMICAL] (state, ch) {
    state.chemical = ch
  },
  // [types.SWITCH_CHEMICAL] (state, ch) {
  //   let chemical = state.chemical
  //   let index = chemical.indexOf(ch)
  //   if (index !== -1) {
  //     chemical.splice(index, 1)
  //   } else {
  //     chemical.push(ch)
  //   }
  // },
  [types.SWITCH_FACTORY] (state, f) {
    state.factory = f
  },
  [types.SWITCH_SENSOR] (state, s) {
    state.sensor = s
  },
  [types.UPDATE_THRESHOLD] (state, k, v) {
    state.threshold[ k ] = v
  },
  [types.SET_SCT_TOKEN] (state, token) {
    state.sctDataToken = token
  },
  [types.ADD_SCT_CHART] (state, { sensor, month, chemical }) {
    state.sctBarChart = [ { sensor, month, chemical } ].concat(state.sctBarChart)
  },
  [types.REMOVE_SCR_CHART] (state, index) {
    state.sctBarChart.splice(index, 1)
  },
  [types.UPDATE_DISTRIBUTE] (state, { month, chemical, sensor, dataToken }) {
    state.selectedBar = { month, chemical, sensor, dataToken }
  },
  [types.ADD_DIFF_CHART] (state, { month, sensor, factory }) {
    state.diffChart = [ { month, sensor, factory } ].concat(state.diffChart)
  },
  [types.SET_WIND_TOKEN] (state, token) {
    state.windToken = token
  },
  [types.SET_CHEMICAL_TOKEN] (state, token) {
    state.chemicalToken = token
  }
}

export default new Vuex.Store({
  strict: true,
  state,
  mutations
})
