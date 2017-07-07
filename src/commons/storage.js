import windowInstall from './windowInstall'

let storage = {}

const makeId = () => {
  return `id${+new Date()}-${~~(Math.random() * 1e9)}`
}

const get = (id, isRemove = false) => {
  let retData
  if (storage.hasOwnProperty(id)) {
    let { data } = storage[ id ]
    retData = data
  }
  if (isRemove) {
    delete storage[ id ]
  }
  return retData
}

const set = (data, name, id) => {
  id = id || makeId()
  storage[ id ] = { data, name }
  return id
}

const remove = (id) => {
  delete storage[ id ]
}

const clear = () => {
  storage = {}
}

windowInstall('showStorage', () => {
  let len = Object.keys(storage).length
  for (let k in storage) { get(k) }
  return len
})

export default { get, set, remove, clear }
