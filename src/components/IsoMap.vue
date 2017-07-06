<template>
  <button class="uk-button uk-button-primary uk-align-right" @click="openDialog"> Config  <i class="uk-icon-cog"></i>
  </button>
  <div class="uk-text-bold">
    <span class="comps-title"><b>ISOMap View</b></span>
    <span v-if="selectedBar"> - {{factory}}</span></div> {{selectedHour}}
  <div class="chart" v-el:chart></div>
  <dialog></dialog>
</template>
<script>
  import {selectedBar, factory, windToken, chemicalToken, timeToken, selectedChemical, selectedHour} from '../vuex/getters'
  import Dialog from './Dialog.vue'
  import storage from '../commons/storage'
  import config from '../commons/config'
  import ISOMap from '../charts/ISOMap'

  let { sensorsLoc, factoriesLoc, sensorOpts } = config
  let windData = null
  let sensorData = null
  let timeBeforeAndAfter = 3

  const formatFunc = (t) => {
    return 1 + t.getMonth() + '/' + t.getDate() + '/' + t.getFullYear() + ' ' + (t.getHours()) + ':00'
  }

  const getAngle = (s, t) => {
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

  const getDist = (s, t) => {
    return Math.sqrt(Math.pow(s[ 0 ] - t[ 0 ], 2) + Math.pow(s[ 1 ] - t[ 1 ], 2))
  }

  export default {
    components: {Dialog},
    vuex: {
      getters: { selectedBar, factory, windToken, chemicalToken, timeToken, selectedChemical, selectedHour }
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
      },
      updateStr () {
        this.update()
      }
    },
    computed: {
      updateStr () {
        return this.selectedHour + this.selectedChemical + this.factory
      }
    },
    data () {
      return {
        chartIns: null,
        playData: {},
        factorySensorAngle: {},
        factorySenorDist: {},
        playId: null
      }
    },
    methods: {
      openDialog () {
        // openDialog
      },
      update () {
        // todo 处理数据 画图
        this.processData()
        this.drawISO()
      },
      drawISO () {
        let chemical = this.selectedChemical
        let currentTime = this.selectedHour
        let windMap = this.windMap
        let playSensor = sensorData[ currentTime ][ chemical ]

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
//        this.chartIns.drawISOLine()
        this.chartIns.drawPeriodLine({chemical: this.selectedChemical, current: this.selectedHour, periodData: this.periodData})
          .drawISOLine({ sensorData: datas, factory: this.factory, maxValue, maxRadius })
        if (windMap[ currentTime ]) {
          this.chartIns.drawWind(windMap[ currentTime ])
        }
//        this.chartIns.draw({ sensorData: datas, windData: playWind, factory: this.factory, maxValue, maxRadius })
        this.index = (this.index + 1) % Object.keys(sensorData).length
      },
      processData () {
        let windMap = {}
        windData.forEach((d) => {
          if (!windMap[ d.date ]) {
            windMap[ d.date ] = {
              speed: d.speed,
              direction: d.direction
            }
          }
        })
        this.windMap = windMap

        let chemical = this.selectedChemical
        let currentTime = this.selectedHour

        // step 1 构造当前时刻前后数据 periodData {sensor: {time: value}},eg: {S1: {4/2/2016 1:00: 0.34}}
        let oneHour = 1000 * 60 * 60
        let currentTimeStamp = +new Date(currentTime)
        let timeArr = [currentTime]
        for (let i = 0; i < timeBeforeAndAfter; i++) {
          timeArr.push(formatFunc(new Date(currentTimeStamp - oneHour * (i + 1))))
          timeArr.push(formatFunc(new Date(currentTimeStamp + oneHour * (i + 1))))
        }
        timeArr.sort((a, b) => new Date(a) - new Date(b))
        let periodData = {}
        sensorOpts.forEach((d) => {
          periodData[d] = {}
        })
        let domain = {max: 0, min: 1000}
        timeArr.forEach((t) => {
          // 如果数据中有该时刻
          if (sensorData[t]) {
            let sensorD = sensorData[t][chemical]
            Object.keys(sensorD).forEach((s) => {
              let v = sensorD[s]
              periodData[s][t] = v
              domain.max = Math.max(v, domain.max)
              domain.min = Math.min(v, domain.min)
            })
          } else {
            // 如果没有就置为0
            sensorOpts.forEach((s) => {
              periodData[s][t] = 0
            })
          }
        })
        this.periodData = {
          data: periodData,
          domain
        }
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
