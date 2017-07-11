/**
 * Created by huangwei on 2017/7/7.
 */
// import Krigins from './Kriging'
import math from '../../plugins/math.min'
// import MarchingSquaresJS from '../../plugins/marchingsquares-isobands.min'
import MarchingSquaresJS from '../../plugins/marchingsquares-isocontours.min'
const getDist = (s, t) => {
  let dist = Math.pow((s[0] - t[0]), 2) + Math.pow((s[1] - t[1]), 2)
  return Math.sqrt(dist)
}

const IDX2D = (x, y, cols) => {
  return x * cols + y
}

Array.prototype.reshape = function (rows, cols) {
  let copy = this.slice(0) // Copy all elements.
  this.length = 0 // Clear out existing array.

  for (let r = 0; r < rows; r++) {
    let row = []
    for (let c = 0; c < cols; c++) {
      let i = r * cols + c
      if (i < copy.length) {
        row.push(copy[i])
      }
    }
    this.push(row)
  }
}

let calcInvV = function (dims, itemCount, pos, mode, c0, c1, a) {
  let size = itemCount + 1

  // calculate distance matrix
  let dist = new Array(itemCount * itemCount)
  for (let i = 0; i < itemCount; ++i) {
    for (let j = i; j < itemCount; ++j) {
      let sqrD = 0
      for (let k = 0; k < dims; ++k) {
        sqrD += Math.pow(pos[i][k] - pos[j][k], 2)
      }
      dist[IDX2D(i, j, itemCount)] = dist[IDX2D(j, i, itemCount)] = Math.sqrt(sqrD)
    }
  }

  // calculate V
  let V = new Array(size * size)
  for (let i = 0; i < itemCount; ++i) {
    for (let j = 0; j < itemCount; ++j) {
      switch (mode) {
        case 1: // Spherical Mode
          V[IDX2D(i, j, size)] = V[IDX2D(j, i, size)] =
            ((dist[IDX2D(i, j, itemCount)] < a) ? (c0 + c1 * (1.5 * dist[IDX2D(i, j, itemCount)] / a - 0.5 * CUB(dist[IDX2D(i, j, itemCount)] / a))) : (c0 + c1));
          break;
        case 2: // Exponential Mode
          V[IDX2D(i, j, size)] = V[IDX2D(j, i, size)] = c0 + c1 * (1 - Math.exp(-3 * dist[IDX2D(i, j, size)] / a))
          break;
        case 3: // Guassian Mode
          V[IDX2D(i, j, size)] = V[IDX2D(j, i, size)] = c0 + c1 * (1 - Math.exp(-3 * SQR(dist[IDX2D(i, j, itemCount)]) / SQR(a)))
          break;
        case 4: // Linear Mode
          V[IDX2D(i, j, size)] = V[IDX2D(j, i, size)] = c0 + c1 * (dist[IDX2D(i, j, itemCount)] / a)
          break;
        default:
          console.log('No such mode!')
          return false
          break
      }
      if (dist[IDX2D(i, j, itemCount)] <= 1e-6)
        V[IDX2D(i, j, size)] = V[IDX2D(j, i, size)] = 0
    }
  }
  for (let i = 0; i < itemCount; ++i) {
    V[IDX2D(i, size - 1, size)] = V[IDX2D(size - 1, i, size)] = 1
  }

  V[IDX2D(size - 1, size - 1, size)] = 0

  V.reshape(size, size)
  let InvV = math.inv(V)
  return InvV
}

let interpolation = (dims, p, itemCount, pos, Z, InvV, mode, a, c0, c1) => {
  let size = itemCount + 1

  let D = new Array(size)
  for (let i = 0; i < itemCount; ++i) {
    let h = 0
    for (let j = 0; j < dims; ++j) {
      h += math.pow(pos[i][j] - p[j], 2)
    }

    h = math.sqrt(h)

    switch (mode) {
      case 1: // Spherical Mode
        D[i] = (h < a) ? c0 + c1 * (1.5 * h / a - 0.5 * Math.pow(h / a, 3)) : c0 + c1
        break;
      case 2: // Exponential Mode
        D[i] = c0 + c1 * (1 - Math.exp(-3 * h / a))
        break;
      case 3: // Gaussian Mode
        D[i] = c0 + c1 * (1 - Math.exp(-3 * h * h / a / a))
        break
      case 4: // Linear Mode
        D[i] = c0 + c1 * (h / a)
        break
      default:
        console.log('No such mode!')
        break
    }
    if (h <= 1e-6) D[i] = 0
  }
  D[size - 1] = 1

  // calculate the weights
  let weight = new Array(size)
  for (let i = 0; i < size; ++i) {
    weight[i] = 0
    for (let j = 0; j < size; ++j) {
      weight[i] += InvV[i][j] * D[j]
    }
  }

  // calculate estimated value
  let result = 0
  for (let i = 0; i < itemCount; ++i) {
    result += weight[i] * Z[i]
  }

  if (result < 0) result = 0

  let error = 0
  for (let i = 0; i < size; ++i) {
    error += weight[i] * D[i]
  }

  error = math.sqrt(error)

  return {
    value: result,
    error: error,
    weight: weight
  }
}
/**
 *
 * @param n count
 * @param x dist
 * @param y semigrams
 * @returns {{c0: number, c1: number}}
 */
function linearFitting (n, x, y) {
  let c0 = 0
  let sumSlope = 0
  for (let i = 0; i < n; ++i) {
    sumSlope += y[i] / x[i]
  }

  let c1 = sumSlope / n
  return {c0, c1}
}

onmessage = (evt) => {
  let data = evt.data
  let {sensorsLoc, sensorData, width, height} = data

  let w = Math.ceil(height)
  let h = Math.ceil(width)
  let xScale = (x) => {
    return (x - 40) * (w) / (140 - 40)
  }
  let yScale = (x) => {
    return (x - 60) * (h) / (-60 - 40)
  }
  let pos = Object.keys(sensorsLoc).map(d => {
    let p = sensorsLoc[d]
    return [xScale(p[0]), yScale(p[1])]
  })

  let len = pos.length
  let count = 0
  let dists = new Array(len * (len - 1) / 2)
  let Z = Object.keys(sensorData).map((d) => sensorData[d])
  let semigrams = new Array(len * (len - 1) / 2)
  let maxValue = Math.max(...Z)
  let min = Math.min(...Z)
  // Step 1 计算两两坐标之间的距离
  for (let i = 0; i < len; ++i)
    for (let j = 0; j < i; ++j) {
      dists[count] = getDist(pos[i], pos[j])
      semigrams[count] = 0.5 * Math.pow(Z[i] - Z[j], 2.0)
      count += 1
    }
  let a = 400
  let mode = 4
  let {c0, c1} = linearFitting(count, dists, semigrams)
  c1 *= a
  let dims = 2
  let InvV = calcInvV(dims, len, pos, mode, c0, c1, a)
  let target = new Array(dims)
  var values = new Array(w * h)
  values.reshape(w, h)
  let contours = []
  let points = []
  let max = 0
  for (let x = 0; x < w; ++x) {
    for (let y = 0; y < h; ++y) {
      target[0] = Math.round(1.0 * x / w * w)
      target[1] = Math.round(1.0 * y / h * h)
      let results = interpolation(dims, target, len, pos, Z, InvV, mode, a, c0, c1)
      values[x][y] = results.value
      if ((y % 5 === 0) && (x % 5 === 0)) {
        points.push({
          x: target[0],
          y: target[1],
          value: results.value
        })
        max = Math.max(max, results.value)
      }
    }
  }
  let isoCount = 10
  let step = (maxValue - min) / isoCount
  for (let i = 0; i < isoCount; i++) {
    contours.push({
      level: +i,
      contour: MarchingSquaresJS.isoContours(values, min + step * i, step)
    })
  }
  // test
  // for (let i = 0; i < len; ++i) {
  //   let x = math.floor(pos[i][0] / 200 * 720)
  //   let y = math.floor(pos[i][1] / 200 * 720)
  //   target[0] = 1. * x / 720 * 200
  //   target[1] = 1. * y / 720 * 200
  //   // console.log([pos[i][0], pos[i][1]], [target[0], target[1]])
  //   let value = interpolation(dims, target, len, pos, Z, InvV, mode, a, c0, c1).value
  //   points.push({
  //     x: target[0],
  //     y: target[1],
  //     value
  //   })
  //   max = Math.max(max, value)
  // }
  self.postMessage({points, contours, domain: [0, max]})
}
