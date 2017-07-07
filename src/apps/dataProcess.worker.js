/**
 * Created by huangwei on 2017/6/27.
 */
// 计算均值
const getMean = (data) => {
  let sum = 0
  let keys = Object.keys(data)
  if (keys.length) {
    keys.forEach((d) => {
      sum += data[ d ]
    })
    return sum / keys.length
  }
  return 0
}
// 计算方差
const getDeviate = (data, mean) => {
  let deviate = 0
  let keys = Object.keys(data)
  keys.forEach((k) => {
    deviate += Math.pow(data[ k ] - mean, 2)
  })
  return Math.sqrt(deviate)
}
// 计算协方差
const getCov = ({ dataX, dataY, mx, my }) => {
  let keysX = Object.keys(dataX)
  let cov = 0
  keysX.forEach((k) => {
    if (dataY[ k ] !== undefined) {
      cov += ((dataX[ k ] - mx) * (dataY[ k ] - my))
    }
  })
  return cov
}

const calcuPearson = (dataX, dataY) => {
  let mx = getMean(dataX)
  let my = getMean(dataY)
  let dx = getDeviate(dataX, mx)
  let dy = getDeviate(dataY, my)
  let cov = getCov({ dataX, dataY, mx, my })
  return cov / (dx * dy)
}

onmessage = (evt) => {
  let { sensorData } = evt.data
  let bySensor = {}
  let byChemical = {}
  let byTime = {}
  sensorData.forEach((d) => {
    let m = 'S' + d.monitor
    let c = d.chemical
    let time = d.date

    if (!bySensor[ m ]) bySensor[ m ] = {}
    if (!bySensor[ m ][ c ]) bySensor[ m ][ c ] = {}
    bySensor[ m ][ c ][ time ] = d.reading

    if (!byChemical[ c ]) byChemical[ c ] = {}
    if (!byChemical[ c ][ m ]) byChemical[ c ][ m ] = {}
    byChemical[ c ][ m ][ time ] = d.reading

    if (!byTime[ time ]) byTime[ time ] = {}
    if (!byTime[ time ][ c ]) byTime[ time ][ c ] = {}
    byTime[ time ][ c ][ m ] = d.reading
  })
  let pearsonSameSensor = {}
  Object.keys(bySensor).forEach((sensor) => {
    let sensorData = bySensor[ sensor ]
    let chemical = Object.keys(sensorData)
    for (let i = 0; i < chemical.length; i++) {
      for (let j = i + 1; j < chemical.length; j++) {
        let pearson = calcuPearson(sensorData[ chemical[ i ] ], sensorData[ chemical[ j ] ])
        pearsonSameSensor[ sensor + '-' + chemical[ i ] + '-' + chemical[ j ] ] = pearson
        // console.log(sensor, ' ', chemical[ i ], chemical[ j ], pearson)
      }
    }
  })

  let pearsonSameChemical = []
  let chemicals = [ 'Methylosmolene', 'AGOC-3A', 'Appluimonia', 'Chlorodinine' ]
  let sensors = Object.keys(bySensor)

  for (let i = 1; i < sensors.length; i++) {
    for (let j = i + 1; j <= sensors.length; j++) {
      let s1 = 'S' + i
      let s2 = 'S' + j
      let d = {}
      chemicals.forEach((c) => {
        let pearson = calcuPearson(bySensor[ s1 ][ c ], bySensor[ s2 ][ c ])
        d[ c ] = pearson
      })
      pearsonSameChemical.push({ name: s1 + '-' + s2, x: i, y: j, correlation: d })
    }
  }
  self.postMessage({ bySensor, byChemical, byTime, pearsonSameChemical, pearsonSameSensor })
  self.close()
}
