/**
 * Created by huangwei on 2017/6/27.
 */
import config from '../commons/config'
let {sensorOpts, chemicalOpts} = config
// 计算均值
const getMean = (data) => {
  let sum = 0
  let keys = Object.keys(data)
  if (keys.length) {
    keys.forEach((d) => {
      sum += data[d]
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
    deviate += Math.pow(data[k] - mean, 2)
  })
  return Math.sqrt(deviate)
}
// 计算协方差
const getCov = ({dataX, dataY, mx, my}) => {
  let keysX = Object.keys(dataX)
  let cov = 0
  keysX.forEach((k) => {
    if (dataY[k] !== undefined) {
      cov += ((dataX[k] - mx) * (dataY[k] - my))
    }
  })
  return cov
}

const calcuPearson = (dataX, dataY) => {
  let mx = getMean(dataX)
  let my = getMean(dataY)
  let dx = getDeviate(dataX, mx)
  let dy = getDeviate(dataY, my)
  let cov = getCov({dataX, dataY, mx, my})
  return cov / (dx * dy)
}

onmessage = (evt) => {
  let {sensorData} = evt.data
  let bySensor = {}
  let byChemical = {}
  let byTime = {}
  let mdsData = {}
  let redundantData = {}

  sensorData.forEach((d) => {
    let m = 'S' + d.monitor
    let c = d.chemical
    let time = d.date
    let combine = m + '::' + c + '::' + time
    if (redundantData[combine]) {
      redundantData[combine] = redundantData[combine].concat(d)
    } else {
      redundantData[combine] = [d]
    }
    if (!bySensor[m]) bySensor[m] = {}
    if (!bySensor[m][c]) bySensor[m][c] = {}
    bySensor[m][c][time] = d.reading

    if (!byChemical[c]) byChemical[c] = {}
    if (!byChemical[c][m]) byChemical[c][m] = {}
    byChemical[c][m][time] = d.reading

    if (!byTime[time]) byTime[time] = {}
    if (!byTime[time][c]) byTime[time][c] = {}
    byTime[time][c][m] = d.reading
    // if (+new Date(time) < +new Date('1/1/2017 00:00:00') && +new Date(time) >= +new Date('12/1/2016 00:00:00')) {
    //   if (!mdsData[time]) {
    //     mdsData[time] = {
    //       [c + m]: d.reading
    //     }
    //   } else {
    //     mdsData[time][c + m] = d.reading
    //   }
    // }
  })
  let pearsonSameSensor = {}
  Object.keys(bySensor).forEach((sensor) => {
    let sensorData = bySensor[sensor]
    let chemical = Object.keys(sensorData)
    for (let i = 0; i < chemical.length; i++) {
      for (let j = i + 1; j < chemical.length; j++) {
        let pearson = calcuPearson(sensorData[chemical[i]], sensorData[chemical[j]])
        pearsonSameSensor[sensor + '-' + chemical[i] + '-' + chemical[j]] = pearson
        // console.log(sensor, ' ', chemical[ i ], chemical[ j ], pearson)
      }
    }
  })

  let pearsonSameChemical = []
  let chemicals = ['Methylosmolene', 'AGOC-3A', 'Appluimonia', 'Chlorodinine']
  let sensors = Object.keys(bySensor)

  for (let i = 1; i < sensors.length; i++) {
    for (let j = i + 1; j <= sensors.length; j++) {
      let s1 = 'S' + i
      let s2 = 'S' + j
      let d = {}
      chemicals.forEach((c) => {
        let pearson = calcuPearson(bySensor[s1][c], bySensor[s2][c])
        d[c] = pearson
      })
      pearsonSameChemical.push({name: s1 + '-' + s2, x: i, y: j, correlation: d})
    }
  }
  let fields = []
  // sensorOpts.forEach((s) => {
  //   chemicalOpts.forEach((c) => {
  //     fields.push(c + s)
  //   })
  // })
  let mdsArr = Object.keys(mdsData).map((d) => {
    fields.forEach((f) => {
      if (!mdsData[d][f]) {
        mdsData[d][f] = 0
      }
    })
    mdsData[d]['time'] = d
    return mdsData[d]
  })
  let timesArr = Object.keys(mdsData)

  let redundantArr = []
  // Object.keys(redundantData)
  //   .forEach((d) => {
  //     if (redundantData[d].length > 1) {
  //       redundantArr.push({
  //         text: d,
  //         len: redundantData[d].length
  //       })
  //     }
  //   })
  self.postMessage({bySensor, byChemical, byTime, pearsonSameChemical, pearsonSameSensor, mdsArr, timesArr, redundantArr})
  self.close()
}
