<template>
  <div id="App"
       class="uk-width-1-1"
       namespace="App">
    <div class="uk-navbar uk-width-1-1">
      <b class="uk-navbar-brand app-title">VAST Challenge Mini Challenge 2</b>
      <span class="uk-align-right uk-clearfix current uk-text-bold" v-show="selectedHour">Selected Time:  {{selectedHour}}</span>
    </div>
    <div class="uk-width-1-1 uk-grid app-top clear-grid-margin">
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
    <div class="uk-width-1-1 uk-grid app-bottom clear-grid-margin" :class="{'app-bottom-top': timeLineState==='top'}">
      <!--<div class="project uk-width-1-3 uk-panel">-->
        <!--<project></project>-->
      <!--</div>-->
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
  import Project from '../components/Project.vue'

  import sensorData from '../data/sensor.json'
  import storage from '../commons/storage'
  import Process from './dataProcess.worker'
  import banner from '../../assets/images/display.jpg'
  import {setSCTToken, setChemicalToken, setTimeToken, setCorrelation} from '../vuex/actions'
  import {selectedHour, timeLineState} from '../vuex/getters'
  import config from '../commons/config'

  let colorMap = config.colorMap

  export default{
    vuex: {
      actions: { setSCTToken, setChemicalToken, setTimeToken, setCorrelation },
      getters: {selectedHour, timeLineState}
    },
    components: { IsoMap, SelectMenu, TimeLine, DistributeView, Calendar, Correlation, Project },
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
        let { bySensor, byChemical, byTime, pearsonSameChemical, mdsArr, timesArr, redundantArr } = evt.data
        mdsArr
        timesArr
//        console.log(timesArr)
//        console.log(mdsArr)
        console.log(redundantArr)
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
    .center {
      width: 10px;
      i {
        color: @color-main;
      }
    }
    .current {
      line-height: @title-h;
      color: #00a8e6;
      margin-left: 0;
      margin-bottom: 0;
    }
    .app-top {
      height: 60%;
      .calendar {
        height: 100%;
        border-right: 1px dashed #ddd;
      }
    }
    .app-bottom {
      margin-top: 8px;
      height: calc(~"39% - 20px - " @title-h);
      border-top: 1px dashed #ddd;
      background-color: #fff;
      .time-line {
        height: 100%;
        background-color: #fff;
        border-left: 1px dashed #ddd;
      }
    }
    .app-down {
      margin-top: 8px;
      height: calc(~"39% - 20px - " @title-h);
    }
    .app-bottom-top {
      margin-top: calc(~"-38% + 40px");
      height: 100%;
      background: #fff;
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
