<template>
    <div class="uk-width-1-1 full-height">
        <span class="comps-title"><b>Time Projection View</b></span>
        <input type="radio" id="hour" value="hour" v-model="pType">
        <label for="hour">Hour</label>
        <input type="radio" id="day" value="day" v-model="pType">
        <label for="day">Day</label>
        <div class="uk-width-1-1 uk-flex row">
            <div class="uk-width-1-2 chart-item">
                <span class="uk-badge uk-badge-success">Day Time Curves {{timeCurves.dayDisplay}}</span>
                <div v-el:timecurves class="chart"></div>
            </div>
            <div class="uk-width-1-2 chart-item">
                <span class="uk-badge uk-badge-primary">April</span>
                <div v-el:april class="chart"></div>
            </div>
        </div>
        <div class="uk-width-1-1 uk-flex row">
            <div class="uk-width-1-2 chart-item">
                <span class="uk-badge uk-badge-primary">August</span>
                <div v-el:august class="chart"></div>
            </div>
            <div class="uk-width-1-2 chart-item">
                <span class="uk-badge uk-badge-primary">December</span>
                <div v-el:december class="chart"></div>
            </div>
        </div>
    </div>
</template>
<script>
  import aprilData from '../data/aprilTSNERes.json'
  import augustData from '../data/augustTSNERes.json'
  import decemberData from '../data/decemberTSNERes.json'
  import ProjectChart from '../charts/ProjectionChart'
  import TimeCurves from '../charts/TimeCurves'
  import {selectedHour, timeCurvesDay, timeCurves} from '../vuex/getters'
  import {updateSelectedDay} from '../vuex/actions'
  import TSne from './TSne.worker'

  let aprilDomain = {
    x: [-17.809239285164566, 16.020030518152996],
    y: [-17.012366169842696, 15.875796232120257]
  }
  let augustDomain = {
    x: [-20.088467772713106, 26.957853124539195],
    y: [-9.917188760379982, 10.386875078466188]
  }
  let decemberDomain = {
    x: [-19.759709943192007, 24.05643777740353],
    y: [-23.65158361947559, 15.461593808939696]
  }

  export default {
    vuex: {
      getters: {selectedHour, timeCurvesDay, timeCurves},
      actions: {updateSelectedDay}
    },
    watch: {
      selectedHour () {
        this.timeCurvesChart.inited && this.timeCurvesChart.highlightCurrent(this.selectedHour)
        let month = new Date(this.selectedHour).getMonth() + 1
        switch (month) {
          case 4:
            this.aprilChart.highlightCurrent(this.selectedHour)
            break
          case 8:
            this.augustChart.highlightCurrent(this.selectedHour)
            break
          case 12:
            this.decemberChart.highlightCurrent(this.selectedHour)
            break
        }
      },
      timeCurvesDay () {
        // Step1. 布局
        let worker = new TSne()
        worker.postMessage(this.timeCurves.data)
        worker.onmessage = (evt) => {
          let evtData = evt.data
          // Step2. 绘制
          this.timeCurvesChart.draw({timeCurves: this.timeCurves, pos: evtData})
            .highlightCurrent(this.selectedHour)
        }
      },
      pType () {
        console.log(this.pType, this.timeCurves)
      }
    },
    data () {
      return {
        aprilChart: null,
        augustChart: null,
        decemberChart: null,
        timeCurvesChart: null,
        pType: 'hour'
      }
    },
    methods: {
      clickHour (hour) {
        console.log('hour', hour)
        let time = new Date(hour)
        let day = +new Date((1 + time.getMonth()) + '/' + (time.getDate()) + '/2016 00:00:00')
        this.updateSelectedDay(day, hour)
      }
    },
    ready () {
      this.aprilChart = new ProjectChart(this.$els.april)
      this.aprilChart.on('clickHour', this.clickHour)
      this.aprilChart.draw(aprilData, aprilDomain)

      this.augustChart = new ProjectChart(this.$els.august)
      this.augustChart.on('clickHour', this.clickHour)
      this.augustChart.draw(augustData, augustDomain)

      this.decemberChart = new ProjectChart(this.$els.december)
      this.decemberChart.on('clickHour', this.clickHour)
      this.decemberChart.draw(decemberData, decemberDomain)

      this.timeCurvesChart = new TimeCurves(this.$els.timecurves)
        .on('clickHour', this.clickHour)
    }
  }
</script>
<style lang="less" scoped>
@title-h: 10px;
.row {
  height: calc(~"50% - " @title-h);
}
.chart-item {
  height: 100%;
  border: 1px dashed #ddd;
  .chart {
    height: calc(~"100% - 20px");
  }
}
</style>
