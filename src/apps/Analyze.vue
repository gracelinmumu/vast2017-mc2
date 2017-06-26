<template>
  <div id="App"
       class="animated"
       namespace="App"
       transition="fadeUD">
    <div class="uk-width-1-1 uk-grid top">
      <div class="select-menu uk-width-1-6 uk-panel uk-panel-box">
        <select-menu></select-menu>
      </div>
      <div class="calendar uk-width-1-6 uk-panel uk-panel-box">
        <calendar></calendar>
      </div>
      <div class="iso-map uk-width-1-2 uk-panel uk-panel-box">
        <iso-map></iso-map>
      </div>
      <div class="distribute uk-width-1-6 uk-panel uk-panel-box">
        <distribute-view></distribute-view>
      </div>
    </div>
    <div class="uk-width-1-1 bottom">
      <div class="time-line uk-panel uk-panel-box">
        <time-line></time-line>
      </div>
    </div>
  </div>
</template>
<script>
  import '../commons/base.less'
  import IsoMap from '../components/IsoMap.vue'
  import SelectMenu from '../components/SelectMenu.vue'
  import TimeLine from '../components/TimeLine.vue'
  import DistributeView from '../components/DistributeView.vue'
  import Calendar from '../components/Calendar.vue'

  export default{
    data () {
      return {
        links: []
      }
    },
    components: { IsoMap, SelectMenu, TimeLine, DistributeView, Calendar },
    methods: {
      transitionAppBeforeEnter () {
        this.$fLogs.log('[App]transitionBeforeEnter')
      }
    },
    ready () {
      this.show = true
      this.links = [ {
        url: 'https://confluence.b.360.cn/pages/viewpage.action?pageId=10092607',
        text: '教程'
      }, {
        url: 'http://10.95.24.22:5011/package/@qnpm/skyfenv',
        text: 'skyfenv'
      }, {
        url: '/mochatest/index',
        text: 'Mocha单元测试'
      } ]
      this.$fLogs.info('[APP]HelloWorld is ready !!!')
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";

  @bottom: 500px;
  #App {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    .top {
      height: calc(~"100% -" @bottom);
    }
    .bottom {
      height: 400px;
    }
    .time-line {
      height: 100%;
    }
  }
</style>