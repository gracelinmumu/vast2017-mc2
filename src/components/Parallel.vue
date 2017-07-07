<template>
  <div class="uk-text-bold">等高线<span v-if="selectedBar">{{selectedBar.chemical}} - {{factory}}</span></div>
  <div class="chart" v-el:chart></div>
</template>
<script>
  import {selectedBar, factory, windToken, chemicalToken, timeToken} from '../vuex/getters'
  import storage from '../commons/storage'
  import config from '../commons/config'
  import ISOMap from '../charts/ISOMap'

  let { sensorsLoc, factoriesLoc } = config
  let windData = null
  let sensorData = null

  function getAngle (s, t) {
    let a = Math.abs(Math.atan((t[ 1 ] - s[ 1 ]) / (t[ 0 ] - s[ 0 ])))
    if (s[ 0 ] < t[ 0 ]) {
      if (s[ 1 ] < t[ 1 ]) {
        a += Math.PI * 0.5
      } else {
        a = Math.PI / 2 - a
      }
    } else {
      if (s[ 1 ] > t[ 1 ]) {
        a = Math.PI * 3 / 2 + a
      } else {
        a = Math.PI * 3 / 2 - a
      }
    }
    return a
  }

  function getDist (s, t) {
    return Math.sqrt(Math.pow(s[ 0 ] - t[ 0 ], 2) + Math.pow(s[ 1 ] - t[ 1 ], 2))
  }
  export default {
    vuex: {
      getters: { selectedBar, factory, windToken, chemicalToken, timeToken }
    },
    watch: {
      windToken () {
        if (this.windToken) windData = storage.get(this.windToken)
      },
      timeToken () {
        if (this.timeToken) sensorData = storage.get(this.timeToken)
      },
      selectedBar: {
        deep: true,
        handler () {
          this.update()
        }
      }
    },
    data () {
      return {
        chartIns: null,
        playData: {},
        factorySensorAngle: {},
        factorySenorDist: {}
      }
    },
    methods: {
      update () {
        let { chemical } = this.selectedBar
        // todo 处理数据 画图
        this.processData()

        let windMap = {}
        windData.forEach((d) => {
          if (!windMap[ d.date ]) {
            windMap[ d.date ] = {
              speed: d.speed,
              direction: d.direction
            }
          }
        })
        let index = 0
        let timeArr = Object.keys(sensorData)

        setInterval(() => {
          let currentTime = timeArr[ index ]
          let playSensor = sensorData[ currentTime ][ chemical ]
          let playWind = windMap[ currentTime ]

          let dataSet = Object.keys(playSensor).map((d) => {
            return {
              name: d,
              value: playSensor[ d ],
              angle: this.factorySensorAngle[ this.factory ][ d ]
            }
          })
          dataSet.sort((a, b) => config.sensorSort.indexOf(a.name) - config.sensorSort.indexOf(b.name))
          let count = 20
          let datas = []
          for (let i = 0; i < count; i++) {
            let d = dataSet.map((item) => {
              return {
                name: item.name,
                value: (count - i) * item.value / count,
                angle: item.angle
              }
            })
            datas.push(d)
          }

          dataSet.sort((a, b) => b.value - a.value)
          let max = dataSet[ 0 ]
          let min = dataSet[ dataSet.length - 1 ]
          let maxValue = max.value
          let maxRadius = this.factorySenorDist[ this.factory ][ min.name ] * max.value / min.value
          this.chartIns.draw({ sensorData: datas, windData: playWind, factory: this.factory, maxValue, maxRadius })
          index = (index + 1) % Object.keys(sensorData).length
        }, 3000)
      },
      processData () {
      },
      getAnglesAndDist () {
        let axisAngle = {}
        let distMap = {}
        Object.keys(factoriesLoc).forEach((f) => {
          axisAngle[ f ] = {}
          distMap[ f ] = {}
          Object.keys(sensorsLoc).forEach((s) => {
            axisAngle[ f ][ s ] = getAngle(factoriesLoc[ f ], sensorsLoc[ s ])
            distMap[ f ][ s ] = getDist(factoriesLoc[ f ], sensorsLoc[ s ])
          })
        })
        this.factorySensorAngle = axisAngle
        this.factorySenorDist = distMap
      }
    },
    created () {
      // 计算角度和距离
      this.getAnglesAndDist()
    },
    ready () {
      this.chartIns = new ISOMap(this.$els.chart)
    }
  }
</script>
<style lang="less" scoped>
  .chart {
    height: calc(~"100% - 20px");
  }
</style>
