/**
 * Created by huangwei on 2017/7/7.
 */
import $ from 'jquery'

export const formatFunc = (t) => {
  return 1 + t.getMonth() + '/' + t.getDate() + '/' + t.getFullYear() + ' ' + (t.getHours()) + ':00'
}

export const skyeyeTooltip = {
  show (data, evt) {
    let str = ''
    if (data instanceof Array) {
      str = data.map((item) => item.name ? item.name + ': ' + item.value : item.value).join('<br>')
    } else if (data instanceof Object) {
      str = Object.keys(data).map((k) => k ? k + ': ' + data[ k ] : data[ k ]).join('<br>')
    }
    let top = evt.pageY + 20
    let left = evt.pageX + 20
    let $el = $('#SkyeyeTooltip').css({ 'display': 'block' }).html(str)
    const ew = $el.width()
    const eh = $el.height()
    const ww = $(window).width() - 20
    const wh = $(window).height() - 20
    if (top + eh >= wh) {
      top = top - eh - 20
    }
    if (left + ew >= ww) {
      left = left - ew - 20
    }
    $el.css({ top, left })
  },
  hide () {
    $('#SkyeyeTooltip').css({ 'display': 'none' })
  }
}
