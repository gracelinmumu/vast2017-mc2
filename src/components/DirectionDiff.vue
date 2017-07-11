<template>
  <div class="container uk-width-1-1">
      <div class="uk-width-1-1" v-for="(index, ch) in diffChart"> <!--diffChart-->
        <i class="uk-icon-close uk-align-right"></i>
        <span class="uk-badge uk-badge-primary">{{ch.factory}} - {{ch.sensor}}</span>
        <div class="uk-width-1-1 chart" :id="'DirectionDiff-'+index" :draw="calcAndDrawDiff(ch, '#DirectionDiff-'+index)"></div>
      </div>
  </div>
</template>
<script>
  import {sctBarChart, diffChart, sctDataToken, threshold, windToken} from '../vuex/getters'
  import config from '../commons/config'
  import storage from '../commons/storage'
  import DiffChart from '../charts/DiffChart'

  let localFactoriesLoc = {
    'Roadrunner': [ 89, 27 ],
    'Kasios': [ 90, 21 ],
    'Radiance': [ 109, 26 ],
    'Indigo': [ 120, 22 ]
  }
  let localSensorsLoc = {
    S1: [ 62, 21 ],
    S2: [ 66, 35 ],
    S3: [ 76, 41 ],
    S4: [ 88, 45 ],
    S5: [ 103, 43 ],
    S6: [ 102, 22 ],
    S7: [ 89, 3 ],
    S8: [ 74, 7 ],
    S9: [ 119, 42 ]
  }

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
  let windData = null
  let { sensorsLoc, factoriesLoc, sensorOpts, factoryOpts } = config
  // let sensorsLoc2 = JSON.parse(JSON.stringify(sensorsLoc))

  console.log('sensorOpts', sensorOpts, 'sssssssssssssssssssssssssssssssssss')
  console.log('factoryOpts', factoryOpts, 'ssssssssssssssssssssssssssssssssssssss')
  console.log('Loc', sensorsLoc, factoriesLoc, 'sssssssssssssssssssssssssssssssssssssssssssssss')

  export default {
    vuex: {
      getters: { sctBarChart, diffChart, sctDataToken, threshold, windToken }
    },
    watch: {
      sctDataToken () {
        allData = storage.get(this.sctDataToken)
        allData
      },
      windToken () {
        if (this.windToken) windData = storage.get(this.windToken)
        windData
      },
      threshold: {
        deep: true,
        handler () {
          if (this.threshold) this.update()
        }
      },
      factory: {
        deep: true,
        handler () {
          if (this.factory) this.update()
        }
      },
      selectedBar: {
        deep: true,
        handler () {
          if (this.selectedBar) this.update()
        }
      }
    },
    data () {
      return {
        sensor: null,
        factory: null,
        diffCharts: {},
        selectedFactory: null,
        factorySensorAngle: {},
        factoryOpts: null,
        month: null
      }
    },
    methods: {
      update () {
        // todo 处理数据 画图
        let factoryLoc = {}
        factoryLoc.x = localFactoriesLoc[this.factory][0]
        factoryLoc.y = localFactoriesLoc[this.factory][1]
        let sensorLoc = {}
        sensorLoc.x = localSensorsLoc[this.sensor][0]
        sensorLoc.y = localSensorsLoc[this.sensor][1]
        this.processData(windData, this.month, factoryLoc, sensorLoc)
        // this.drawDiff()
        return
      },
      calcAndDrawDiff (ch, selector) {
        // ch里面有factory和month
        // console.log(ch)
        let { month, factory } = ch
        this.month = month
        this.factory = factory
        // console.log('DirectionDiff calcAndDrawDiff', month)
        // console.log(this.diffChart)

        // todo: 从哪里获得传感器信息？
        this.sensor = 'S6'

        // 容器选择器
        // console.log(selector)

        // 绘图数据是data
        // console.log('wind data', windData)
        let data = windData

        // console.log(this.factory)
        // Step1 处理数据
        // todo: factor and sensor loc
        let factoryLoc = {}
        factoryLoc.x = localFactoriesLoc[this.factory][0]
        factoryLoc.y = localFactoriesLoc[this.factory][1]
        let sensorLoc = {}
        sensorLoc.x = localSensorsLoc[this.sensor][0]
        sensorLoc.y = localSensorsLoc[this.sensor][1]
        // console.log('diff processdata', month, factoryLoc, sensorLoc)
        let chartData = this.processData(data, month, factoryLoc, sensorLoc)
        chartData

        // this.threshold 不同化学物质的阈值
        // Step2绘图
        this.$nextTick(() => {
          // console.log('next tick of direction diff vue')
          let chart = new DiffChart(selector)
          this.diffCharts[selector] = chart
          chart.draw(chartData, month)
        })
      },
      // 风向差异图数据处理
      processData (data, month, factoryLoc, sensorLoc) {
        let tmpdataValues = []
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
        return tmpdataValues
      }
    }
  }
</script>
<style lang="less" scoped>
  @chart-height: 50px;
  .container {
    height: 100%;
    overflow-y: scroll;
    i {
      cursor: pointer;
      color: red;
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

  /*let colored line become unable to be mouseovered*/
  .colored_line {
    pointer-events: none;
    z-index: 3;
  }

  /*let colored point become unable to be mouseovered*/
  .colored_point {
    pointer-events: none;
  }
</style>
