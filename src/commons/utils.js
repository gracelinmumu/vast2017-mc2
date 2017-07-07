/**
 * Created by huangwei on 2017/7/7.
 */
export const formatFunc = (t) => {
  return 1 + t.getMonth() + '/' + t.getDate() + '/' + t.getFullYear() + ' ' + (t.getHours()) + ':00'
}
