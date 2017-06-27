/**
 * Created by huangwei on 2017/6/27.
 */
onmessage = (evt) => {
  let { sensorData } = evt.data
  let res = {}
  sensorData.forEach((d) => {
    let m = 'S' + d.monitor
    if (!res[ m ]) {
      res[ m ] = {}
    }
    if (!res[ m ][ d.chemical ]) {
      res[ m ][ d.chemical ] = {}
    }
    res[ m ][ d.chemical ][ d.date ] = d.reading
  })
  self.postMessage(res)
  self.close()
}
