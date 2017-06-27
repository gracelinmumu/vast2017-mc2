<template>
  <div id="App"
       class="uk-width-1-1 uk-grid"
       namespace="App">
    <div class="uk-width-1-1 uk-grid top">
      <div class="select-menu uk-width-1-6 uk-panel-box uk-padding-remove">
        <select-menu></select-menu>
      </div>
      <div class="calendar uk-width-1-6 uk-panel-box">
        <calendar></calendar>
      </div>
      <div class="iso-map uk-width-1-2 uk-panel-box">
        <iso-map></iso-map>
      </div>
      <div class="distribute uk-width-1-6 uk-panel-box">
        <distribute-view></distribute-view>
      </div>
    </div>
    <div class="uk-width-1-1 uk-grid bottom">
      <div class="time-line uk-width-1-1 uk-panel uk-panel-box">
        <time-line></time-line>
      </div>
    </div>
  </div>
</template>
<script>
  import '../commons/base.less'
  import DistributeView from '../components/DistributeView.vue'
  import SelectMenu from '../components/SelectMenu.vue'
  import TimeLine from '../components/TimeLine.vue'
  import Calendar from '../components/Calendar.vue'
  import IsoMap from '../components/IsoMap.vue'

  import sensorData from '../data/sensor.json'
  import storage from '../commons/storage'
  import Process from './dataProcess.worker'

  import {setSCTToken, setChemicalToken} from '../vuex/actions'

  export default{
    vuex: {
      actions: { setSCTToken, setChemicalToken }
    },
    components: { IsoMap, SelectMenu, TimeLine, DistributeView, Calendar },
    ready () {
      this.$fLogs.info('[APP]Analyze is ready !!!')
    },
    created () {
      let wk = new Process()
      wk.postMessage({ sensorData })
      wk.onmessage = (evt) => {
        let {bySensor, byChemical} = evt.data
        let dataToken = storage.set(bySensor, 'sctData')
        this.setSCTToken(dataToken)
        let chemicalToken = storage.set(byChemical, 'byChemical')
        this.setChemicalToken(chemicalToken)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  #App {
    height: 100%;
    .top {
      height: 60%;
    }
    .bottom {
      margin-top: 8px;
      height: 39%;
    }
    .time-line {
      height: 100%;
    }
    .select-menu {
      overflow-y: scroll;
    }
  }
</style>