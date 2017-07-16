<template>
    <div class="uk-width-1-1 uk-flex full-height">
        <div class="container uk-width-5-6">
            <div class="uk-width-1-1" v-for="(index, ch) in diffChart">
                <i class="uk-icon-close uk-align-right"></i>
                <span class="uk-badge uk-badge-primary">{{ch.factory}} - {{ch.sensor}}</span>
                <div class="uk-width-1-1 chart" :id="'DirectionDiff-'+ch.sensor+ch.factory"
                     :draw="calcAndDrawDiff(ch, '#DirectionDiff-'+ch.sensor+ch.factory)"></div>
            </div>
        </div>
        <div class="uk-width-1-6">
            <p class="p-title">Sort</p>
            <!--<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-flex-space-between">-->
                <!--<button v-for="op in factoryOpts"-->
                        <!--class="uk-button"-->
                        <!--:class="{'uk-button-primary': op === factory}"-->
                        <!--@click="switchFactory(op)"> {{op}}-->
                <!--</button>-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
  import {month, sensor, factory, diffChart, windToken, selectedHour} from '../vuex/getters'
  import {addDiffChart, switchFactory} from '../vuex/actions'
  import config from '../commons/config'
  import storage from '../commons/storage'
  import DiffChart from '../charts/DiffChart'

  let {sensorsLoc, factoriesLoc, sensorOpts, factoryOpts} = config

  const calDiffSizePercent = (factoryLoc, sensorLoc, windDirection) => {
    let dx = factoryLoc.x - sensorLoc.x
    let dy = factoryLoc.y - sensorLoc.y
    let r = Math.sqrt(dx * dx + dy * dy)
    let theta = Math.acos(dy / r) * 180.0 / Math.PI
    if (dx < 0) theta = 360 - theta

    let directionDifference = theta - windDirection
    while (directionDifference < -180) {
      directionDifference += 360
    }
    while (directionDifference >= 180) {
      directionDifference -= 360
    }
    directionDifference = Math.abs(directionDifference)

    let minSize = 1
    let maxSize = 100
    let minAdd = 10
    let maxScore = 1.0 / (0 + minAdd)
    let minScore = 1.0 / (180 + minAdd)
    let resultAdded = directionDifference + minAdd
    let score = 1.0 / resultAdded
    let scoreSize = minSize + (maxSize - minSize) * (score - minScore) / (maxScore - minScore)

    return scoreSize
  }

  let allData = null
  allData
  let windData = null
  export default {
    vuex: {
      getters: {month, sensor, factory, diffChart, windToken, selectedHour},
      actions: {addDiffChart, switchFactory}
    },
    watch: {
      selectedHour () {
        Object.keys(this.diffCharts).forEach((chart) => {
          this.diffCharts[chart].highlightCurrent(this.selectedHour)
        })
      },
//      factory () {
//        this.addChart()
//      },
      windToken () {
        if (this.windToken) windData = storage.get(this.windToken)
      },
      month () {
        this.diffChart.forEach((chart, index) => {
          let selector = '#DirectionDiff-' + chart.sensor + chart.factory
          this.diffCharts[selector].clearCurrent()
          this.calcAndDrawDiff(chart, selector)
        })
      }
    },
    data () {
      return {
        factoryOpts,
        diffCharts: {},
        selectedFactory: null,
        factorySensorAngle: {}
      }
    },
    methods: {
      addChart () {
        if (this.factory) {
          sensorOpts.forEach((sensor) => {
            this.addDiffChart({ sensor, factory: this.factory, month: this.month })
          })
        }
      },
      calcAndDrawDiff (ch, selector) {
        if (!windData && this.windToken) windData = storage.get(this.windToken)
        let {factory, sensor} = ch
        let month = this.month
        // 绘图数据是data
        let data = windData

        // Step1 处理数据
        // todo: factor and sensor loc
        let factoryLoc = {}
        factoryLoc.x = factoriesLoc[factory][0]
        factoryLoc.y = factoriesLoc[factory][1]
        let sensorLoc = {}
        sensorLoc.x = sensorsLoc[sensor][0]
        sensorLoc.y = sensorsLoc[sensor][1]
        let chartData = this.processData(data, month, factoryLoc, sensorLoc)

        // this.threshold 不同化学物质的阈值
        // Step2绘图
        this.$nextTick(() => {
          // console.log('next tick of direction diff vue')
          if (!this.diffCharts[selector]) {
            let chart = new DiffChart(selector)
            this.diffCharts[selector] = chart
          }
          this.diffCharts[selector].draw(chartData, month)
        })
      },
      // 风向差异图数据处理
      processData (data, month, factoryLoc, sensorLoc) {
        let tmpdataValues = []
        if (data) {
          for (let i = 0; i < data.length; i++) {
            let d = data[i].date
            let m = new Date(d).getMonth() + 1
            if (m === month) {
              // console.log('calDiffSizePercent', calDiffSizePercent(factoryLoc, sensorLoc, data[i].direction))
              tmpdataValues.push({
                x: data[i].date,
                y: calDiffSizePercent(factoryLoc, sensorLoc, data[i].direction)
              })
            }
          }
        }

        return tmpdataValues
      }
    },
    created () {
      factoryOpts.forEach((factory) => {
        sensorOpts.forEach((sensor) => {
          this.addDiffChart({ sensor, factory, month: this.month })
        })
      })
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  @chart-height: 50px;
  .container {
    height: 100%;
    overflow-y: scroll;
    i {
      cursor: pointer;
      color: @color-main;
    }
    .chart {
      height: @chart-height;
      border-bottom: 1px solid #ddd;
    }
  }
  .label {
    font: 12px sans-serif;
    text-anchor: end;
  }
  .linechart_label_text {
    font: 12px sans-serif;
  }
  .axis text {
    font: 12px sans-serif;
  }
  .axis path {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
  .d3_linechart_line > .line {
    fill: none;
    z-index: 3;
    opacity: 0.35;
  }
  .grid {
    fill: none;
  }
  .grid line {
    stroke: rgba(0, 0, 0, 0.25);
    shape-rendering: crispEdges;
  }
  .brush .extent {
    stroke: #fff;
    stroke-opacity: 0.6;
    fill-opacity: 0.125;
    shape-rendering: crispEdges;
  }
  .brush .resize rect {
    fill: #000;
  }
  .linechart_reset_zoom {
    position: absolute;
    border-radius: 1px;
    border: solid 1px #e8e8e8;
    text-align: center;
    background: #f8f8f8;
    z-index: 2;
    font-size: 8px;
    cursor: pointer;
    }
  .mouseovertip {
    position: absolute;
    border-radius: 3px;
    border: solid 1px;
    opacity: 0.875;
    text-align: center;
    background: #fdfdfd;
    z-index: 6;
    font-size: 12px;
    pointer-events: none;
  }
  .mouseoverpoint {
    pointer-events: none;
    stroke-width: 5px;
    opacity: 0.65;
  }
  .mouseover_linechart {
    stroke: yellow;
  }
  .colored_line {
    pointer-events: none;
    z-index: 3;
  }
  .colored_point {
    pointer-events: none;
  }
</style>
