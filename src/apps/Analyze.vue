<template>
  <div id="App"
       class="uk-width-1-1"
       namespace="App">
    <div class="uk-navbar uk-width-1-1">
      <b class="uk-navbar-brand app-title">VAST Challenge Mini Challenge 2</b>
    </div>
    <div class="uk-width-1-1 uk-grid app-top clear-grid-margin">
      <!--<div class="select-menu uk-width-1-6 uk-panel-box uk-padding-remove">-->
      <!--<select-menu></select-menu>-->
      <!--</div>-->
      <div class="calendar uk-width-1-2">
        <!--<ul class="uk-tab" data-uk-tab>-->
        <!--<li class="{'uk-active': op.active === activeCal.value} uk-text-bold" v-for="op in calenderView">-->
        <!--<a href="" @click="switchCalendar(op)">{{op.text}}</a>-->
        <!--</li>-->
        <!--</ul>-->
        <div class="uk-width-1-1 full-height">
          <component :is="activeCal.comp"></component>
        </div>

      </div>
      <div class="iso-map uk-width-1-2">
        <iso-map></iso-map>
      </div>
      <!--<div class="distribute uk-width-1-6 uk-panel-box">-->
      <!--<distribute-view></distribute-view>-->
      <!--</div>-->
    </div>
    <div class="uk-width-1-1 uk-grid app-bottom clear-grid-margin">
      <div class="time-line uk-width-1-1 uk-panel">
        <time-line></time-line>
      </div>
    </div>
  </div>
  <!--::-webkit-scrollbar {-->
  <!--width: @scrollbar-width;-->
  <!--height: @scrollbar-height;-->
  <!--}-->
  <!--::-webkit-scrollbar-thumb {-->
  <!--background: @scrollbar-fg-color;-->
  <!--}-->
  <!--::-webkit-scrollbar-track-piece {-->
  <!--background: @scrollbar-bg-color;-->
  <!--}-->
  <div id="SkyeyeTooltip"></div>
</template>
<script>
  import DistributeView from '../components/DistributeView.vue'
  import SelectMenu from '../components/SelectMenu.vue'
  import TimeLine from '../components/TimeLine.vue'
  import Calendar from '../components/Calendar.vue'
  import Correlation from '../components/Correlation.vue'
  import IsoMap from '../components/IsoMap.vue'

  import sensorData from '../data/sensor.json'
  import storage from '../commons/storage'
  import Process from './dataProcess.worker'
  import banner from '../../assets/images/display.jpg'
  import {setSCTToken, setChemicalToken, setTimeToken, setCorrelation} from '../vuex/actions'
  import config from '../commons/config'

  let colorMap = config.colorMap

  export default{
    vuex: {
      actions: { setSCTToken, setChemicalToken, setTimeToken, setCorrelation }
    },
    components: { IsoMap, SelectMenu, TimeLine, DistributeView, Calendar, Correlation },
    data () {
      return {
        banner,
        calenderView: [ {
          value: 'calendar',
          text: 'Calendar',
          comp: 'Calendar'
        }, {
          value: 'correlation',
          text: 'Correlation',
          comp: 'Correlation'
        } ],
        activeCal: {
          value: 'calendar',
          text: 'Calendar',
          comp: 'Calendar'
        },
        colorsArr: Object.keys(colorMap).map((d) => {
          return {
            name: d,
            color: colorMap[ d ]
          }
        })
      }
    },
    methods: {
      switchCalendar (op) {
        this.activeCal = op
      }
    },
    ready () {
      this.$fLogs.info('[APP]Analyze is ready !!!')
    },
    created () {
      let wk = new Process()
      wk.postMessage({ sensorData })
      wk.onmessage = (evt) => {
        let { bySensor, byChemical, byTime, pearsonSameChemical } = evt.data
        console.log(evt.data, 'evt===')
        let dataToken = storage.set(bySensor, 'sctData')
        this.setSCTToken(dataToken)
        let chemicalToken = storage.set(byChemical, 'byChemical')
        this.setChemicalToken(chemicalToken)
        let timeToken = storage.set(byTime, 'byTime')
        this.setTimeToken(timeToken)

        let pearsonToken = storage.set(pearsonSameChemical, 'pearsonSameChemical')
        this.setCorrelation(pearsonToken)
      }
    }
  }
</script>
<style lang="less">
  @import "../commons/base.less";
  @import "../commons/base.vars.less";
  @title-h: 40px;
  @body-top-h: 60%;
  #App {
    height: 100%;
    .app-top {
      height: 60%;
      .calendar {
        height: 100%;
        border-right: 1px dashed #ddd;
      }
    }
    .app-bottom {
      margin-top: 8px;
      height: calc(~"39% - " @title-h);
      .time-line {
        height: 100%;
        border-top: 1px dashed #ddd;
      }
    }
    .clear-grid-margin {
      margin-left: 0;
    }
    .app-title {
      height: @title-h;
      color: #0459a2;
    }
    .full-height {
      height: 100%;
    }
    .legend {
      width: 550px;
      margin-top: 10px;
      .legend-item {
        height: 100%;
        width: 30px;
        border-radius: 10px;
      }
    }
  }
  #SkyeyeTooltip {
    position: fixed;
    z-index: 1010;
    line-height: @font-size-l;
    font-weight: bold;
    padding: @margin-m;
    color: #fff;
    border: 1px solid @color-bd;
    background: @color-card-bg;
  }
</style>
