/**
 * Created by huangxinxin on 17/2/15.
 */
export default (name, conf) => {
  if (name) {
    let NAME = `PAL_${name.toUpperCase()}`
    if (window.hasOwnProperty(NAME)) {
    } else {
      window[NAME] = conf
    }
  } else {
    throw new Error('windowInstall：参数设置错误')
  }
}
