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

export const switchFactory = (store, factory) => {
  store.dispatch(types.SWITCH_FACTORY, factory)
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

export const switchPlay = (store, isPlay) => {
  store.dispatch(types.SWITCH_PLAY, isPlay)
}

export const addSCTCharts = (store, {chemical, month}) => {
  store.dispatch(types.ADD_SCT_CHARTS, {chemical, month})
}

export const updateSelectedTime = (store, hour) => {
  store.dispatch(types.UPDATE_SELECTED_TIME, hour)
}

export const updateSelectedChemical = (store, ch) => {
  store.dispatch(types.UPDATE_SELECTED_CHEMICAL, ch)
}

export const updateSelectedFactory = (store, factory) => {
  store.dispatch(types.UPDATE_SELECTED_FACTORY, factory)
}

export const switchTimelineState = (store, s) => {
  store.dispatch(types.SWITCH_TIMELINE_STATE, s)
}

export const updateSelectedDay = (store, day, hour) => {
  store.dispatch(types.UPDATE_SELECTED_DAY, day, hour)
}

export const updateTimeCurves = (store, opts) => {
  store.dispatch(types.UPDATE_TIME_CURVES, opts)
}