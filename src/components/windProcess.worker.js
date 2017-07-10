/**
 * Created by huangwei on 2017/7/10.
 */
onmessage = (evt) => {
  let data = evt.data.data
  let monthWindMap = {}
  data.forEach((d) => {
    d.timestamp = +new Date(d.date)
    let month = 1 + new Date(d.date).getMonth()
    if (monthWindMap[month]) {
      monthWindMap[month].push(d)
    } else {
      monthWindMap[month] = [d]
    }
  })
  self.postMessage({monthWindMap})
}
