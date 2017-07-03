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

export const addDiffChart = (store, {sensor, month, factory}) => {
  store.dispatch(types.ADD_DIFF_CHART, {month, sensor, factory})
}

export const setWindToken = (store, token) => {
  store.dispatch(types.SET_WIND_TOKEN, token)
}

export const setChemicalToken = (store, token) => {
  store.dispatch(types.SET_CHEMICAL_TOKEN, token)
}
export const setTimeToken = (store, token) => {
  store.dispatch(types.SET_TIME_TOKEN, token)
}

export const setCorrelation = (store, token) => {
  store.dispatch(types.SET_CORRELATION_TOKEN, token)
}
