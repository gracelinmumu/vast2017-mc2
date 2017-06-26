import Vue from 'vue'
import App from '../apps/HelloWorld.vue'
import Store from '../vuex/index'
import config from '../commons/config'
import frame from 'FRAME'

Vue.use(frame)
frame.vueInstall({ module: 'v', name: 'config' }, config) // 在Vue实例中通过this.vConfig进行使用

const run = function () {
  return new Vue({
    el: 'body',
    replace: false,
    components: {
      App
    },
    store: Store
  })
}

run()
