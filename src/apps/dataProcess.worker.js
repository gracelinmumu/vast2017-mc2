/**
 * Created by huangwei on 2017/6/27.
 */
onmessage = (evt) => {
  let { sensorData } = evt.data
  let res = {}
  let byChemical = {}
  sensorData.forEach((d) => {
    let m = 'S' + d.monitor
    let c = d.chemical

    if (!res[ m ]) res[ m ] = {}
    if (!res[ m ][ c ]) res[ m ][ c ] = {}
    res[ m ][ c ][ d.date ] = d.reading

    if (!byChemical[ c ]) byChemical[ c ] = {}
    if (!byChemical[ c ][ m ]) byChemical[ c ][ m ] = {}
    byChemical[ c ][ m ][ d.date ] = d.reading
  })
  self.postMessage({ bySensor: res, byChemical })
  self.close()
}
