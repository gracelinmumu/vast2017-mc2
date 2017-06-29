/**
 * Created by huangwei on 2017/6/27.
 */
onmessage = (evt) => {
  let { sensorData } = evt.data
  let res = {}
  let byChemical = {}
  let byTime = {}
  sensorData.forEach((d) => {
    let m = 'S' + d.monitor
    let c = d.chemical
    let time = d.date

    if (!res[ m ]) res[ m ] = {}
    if (!res[ m ][ c ]) res[ m ][ c ] = {}
    res[ m ][ c ][ time ] = d.reading

    if (!byChemical[ c ]) byChemical[ c ] = {}
    if (!byChemical[ c ][ m ]) byChemical[ c ][ m ] = {}
    byChemical[ c ][ m ][ time ] = d.reading

    if (!byTime[ time ]) byTime[ time ] = {}
    if (!byTime[ time ][ c ]) byTime[ time ][ c ] = {}
    byTime[ time ][ c ][ m ] = d.reading
  })
  self.postMessage({ bySensor: res, byChemical, byTime })
  self.close()
}
