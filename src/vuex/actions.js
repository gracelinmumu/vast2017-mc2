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
