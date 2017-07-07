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
  console.log(V)
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
