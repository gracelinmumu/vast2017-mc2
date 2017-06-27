import types from './mutations'

export const switchMonth = (store, month) => {
  store.dispatch(types.SWITCH_MONTH, month)
}

export const switchChemical = (store, month) => {
  store.dispatch(types.SWITCH_CHEMICAL, month)
}

export const switchSensor = (store, month) => {
  store.dispatch(types.SWITCH_SENSOR, month)
}

export const switchFactory = (store, month) => {
  store.dispatch(types.SWITCH_FACTORY, month)
}

export const updateThreshold = (store, key, value) => {
  store.dispatch(types.UPDATE_THRESHOLD, key, value)
}

export const setSCTToken = (store, token) => {
  store.dispatch(types.SET_SCT_TOKEN, token)
}

export const addSCTChart = (store, {sensor, chemical, month}) => {
  store.dispatch(types.ADD_SCT_CHART, {sensor, chemical, month})
}

export const removeSCTChart = (store, index) => {
  store.dispatch(types.REMOVE_SCR_CHART, index)
}

export const updateSelectedBar = (store, {month, chemical, sensor, dataToken}) => {
  store.dispatch(types.UPDATE_DISTRIBUTE, {month, chemical, sensor, dataToken})
}
