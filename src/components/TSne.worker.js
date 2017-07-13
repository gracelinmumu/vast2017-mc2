/**
 * Created by huangwei on 2017/7/7.
 */
import tsne from '../../plugins/tsne'

onmessage = (evt) => {
  let data = evt.data
  let T = new tsne.tSNE({
    epsilon: 10, perplexity: 30, dim: data[0].length
  })
  T.initDataRaw(data)
  let steps = 4000
  for (let k = 0; k < steps; k++) {
    T.step()
  }

  let Y = T.getSolution()
  self.postMessage(Y)
}
