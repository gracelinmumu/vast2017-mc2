<template>
  <!--title-->
  <span class="comps-title"><b>Calendar View</b></span>
  <div class="calendar-legend uk-align-right" v-el:legend></div>
  <div class="uk-align-right uk-flex">
    <div class="danger"></div>Reading ≥ Threshold
    <div class="safe"></div>Reading < Threshold
    <div class="black"></div>Data Missing
  </div>
  <!--params-->
  <div class="uk-width-1-1 uk-flex uk-flex-wrap">
    Sensor:  <select v-model="selectedSensor" class="label-color"><option v-for="op in sensorOpts"> {{op}} </select>
     Chemicals: <template v-for="op in chemicalOpts">
    <input type="checkbox" id="chemical" value="chemicalsMap[op]" v-model="chemicalsMap[op]">
    <div :style="{'background': chemicalsMap[op]}"></div>
    <label for="chemical" :class="{'label-color': chemicalsMap[op]}" :style="{'color': colorMap[op][1]}">{{op}}</label>
  </template>
  </div>
  <!--body-->
  <div class="uk-width-1-1 uk-flex container">
    <div class="container-left">
      <b>April</b>
      <div class="uk-width-1-1 chart" v-el:april></div>
      <b>August</b>
      <div class="uk-width-1-1 chart" v-el:august></div>
      <b>December</b>
      <div class="uk-width-1-1 chart" v-el:december></div>
    </div>
    <div class="container-right full-height hour-container">
      <div class="uk-flex hour-time-label" v-if="hoursData.length"><div class="item" v-for="h in hourArr">{{h}}</div></div>
      <div class="uk-width-1-1 hour-chart-item uk-flex" v-for="hour in hoursData">
        <div class="day-label">{{hour.display}}<i class="uk-icon-close" @click="closeHour(hour)"></i></div>
        <!--<div class="day-label" :style="{'color': colorMap[hour.chemical][1]}">{{hour.display}}<i class="uk-icon-close" @click="closeHour(hour)"></i></div>-->
        <div class="uk-width-1-1 full-height"
             :id="'Day'+hour.day+hour.sensor"
             :draw="drawHours(hour)">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Calendar from '../charts/Calendar'
  import Dialog from './Dialog.vue'
  import Hour from '../charts/Hour'
  import storage from '../commons/storage'
  import config from '../commons/config'
  import CalendarLegend from '../charts/CalendarLegend'
  import {formatFunc} from '../commons/utils'
  import {selectedBar, timeToken, threshold, selectedDay} from '../vuex/getters'
  import {updateSelectedTime, updateSelectedChemical, switchMonth, updateTimeCurves} from '../vuex/actions'
  let dataByTime = null

  let { chemicalOpts, sensorOpts, colorMap } = config
  let chemicalsMap = {}
  chemicalOpts.forEach((d) => {
    chemicalsMap[ d ] = true
  })

  let hourArr = []
  for (let i = 0; i < 24; i++) {
    hourArr.push(i)
  }

  let dayProjectField = []
  chemicalOpts.forEach((ch) => {
    sensorOpts.forEach((s) => {
      dayProjectField.push({ch, s})
    })
  })
  export default {
    vuex: {
      getters: { selectedBar, timeToken, threshold, selectedDay },
      actions: {updateSelectedTime, updateSelectedChemical, switchMonth, updateTimeCurves}
    },
    components: { Dialog },
    watch: {
      selectedDay: {
        deep: true,
        handler () {
          let {day, hour} = this.selectedDay
          if (this.hourChartMap[day + this.selectedSensor]) {
            this.hourChartMap[day + this.selectedSensor].highlight(hour)
          } else {
            this.hoursData = [ {sHour: hour, sensor: this.selectedSensor, chemical: chemicalOpts, day, data: this.april[day], display: this.selectedSensor + ' ' + (new Date(+day).getMonth() + 1) + '/' + (new Date(+day).getDate())} ].concat(this.hoursData)
          }
        }
      },
      selectedBar: {
        deep: true,
        handler () {
          if (this.selectedBar) this.update()
        }
      },
      threshold: {
        deep: true,
        handler () {
          this.update()
        }
      },
      timeToken () {
        if (this.timeToken) {
          dataByTime = storage.get(this.timeToken)
          this.update()
        }
      },
      selectedChemicals () {
        this.update()
        // this.legendChart && this.legendChart.update(this.selectedChemicals)
      },
      selectedSensor () {
        this.update()
      }
    },
    computed: {
      selectedChemicals () {
        return Object.keys(this.chemicalsMap).filter((c) => this.chemicalsMap[ c ])
      },
      hoursDataMap () {
        let dict = {}
        this.hoursData.forEach((d, index) => {
          dict[ d.day + d.chemical + d.sensor ] = index + 1
        })
        return dict
      }
    },
    data () {
      return {
        hourArr,
        colorMap,
        chemicalsMap,
        chemicalOpts,
        sensorOpts,
        selectedSensor: 'S6',
        hoursData: [],
        hourChartMap: {}
      }
    },
    methods: {
      closeHour (day) {
        this.hoursData.$remove(day)
      },
      drawHours ({ day, data, chemical, sensor, sHour }) {
        this.$nextTick(() => {
          let chart = new Hour('#Day' + day + sensor)
          this.hourChartMap[day + sensor] = chart
          //            .draw(data, +day, this.threshold, this.selectedChemicals)
          chart.draw(data, +day, this.threshold, chemical)
            .on('clickHour', this.clickHour)
          sHour && chart.highlight(sHour)
        })
      },
      calculateProjectData (day) {
        let data = [] // 二维数组
        let timeLabel = []
        let oneHour = 1000 * 60 * 60
        for (let i = 0; i < 24; i++) {
          let time = formatFunc(new Date(+day + oneHour * i))
          let rowData = dataByTime[time]
          let row
          if (rowData) {
            row = dayProjectField.map((d) => rowData[d.ch] ? rowData[d.ch][d.s] || 0 : 0)
          } else {
            row = dayProjectField.map(d => 0)
          }
          timeLabel.push(time)
          data.push(row)
        }
        let time = new Date(+day)
        this.updateTimeCurves({day, dayDisplay: (1 + time.getMonth()) + '/' + time.getDate(), timeLabel, data})
      },
      clickDay (day, data, ch) {
        let d = new Date(+day)
        let month = 1 + d.getMonth()
        this.switchMonth(month)
        if (!this.hourChartMap[day + this.selectedSensor]) {
          this.hoursData = [ { sensor: this.selectedSensor, chemical: chemicalOpts, day, data, display: this.selectedSensor + ' ' + (1 + d.getMonth()) + '/' + d.getDate() } ].concat(this.hoursData)
        }
        if (!this.hoursDataMap[ day + ch + this.selectedSensor ]) {
          let dataSelect = data[ch]
          let hour
          if (dataSelect) {
            if (dataSelect.value) {
              let time = dataSelect.time
              let times = Object.keys(time).filter((d) => time[d] > this.threshold[ch])
              times.length && (hour = times[0])
            } else {
              hour = formatFunc(d)
            }
          }
          hour && this.clickHour(hour, ch)
        }
        this.calculateProjectData(day)
      },
      clickHour (hour, ch) {
        console.log('clicked hour', hour, ch)
        let time = new Date(hour)
        this.calculateProjectData(+new Date((1 + time.getMonth()) + '/' + time.getDate() + '/2016 00:00:00'))
        this.updateSelectedTime(hour)
        this.updateSelectedChemical(ch)
      },
      update () {
        if (dataByTime) {
          // 1.处理数据； 2.绘图
          let { april, august, december } = this.processData()
          let values = [].concat(Object.keys(april).map((d) => april[ d ]), Object.keys(august).map((d) => august[ d ]), Object.keys(december).map((d) => december[ d ]))
          let domainMap = {}
          values.forEach((d) => {
            chemicalOpts.forEach((c) => {
              let v = d[ c ].value
              if (domainMap[ c ]) {
                domainMap[ c ] = Math.max(domainMap[ c ], v)
              } else {
                domainMap[ c ] = v
              }
            })
          })
          this.chartApril.draw(april, domainMap, this.selectedChemicals)
          this.chartAugust.draw(august, domainMap, this.selectedChemicals)
          this.chartDecember.draw(december, domainMap, this.selectedChemicals)
          this.april = april
          this.august = august
          this.december = december
        }
      },
      processData () {
        let data = dataByTime
        let april = {}
        let august = {}
        let december = {}
        let byHours = {}
        let month = this.selectedBar.month

        Object.keys(data).forEach((d) => {
          let day = new Date(d.split(' ')[ 0 ])
          let m = day.getMonth() + 1
          let h = new Date(d).getHours() + 1
          if (m === month) {
            this.setItem(byHours, +h, data[ d ], d)
          }
          switch (m) {
            case 4:
              this.setItem(april, +day, data[ d ], d)
              break
            case 8:
              this.setItem(august, +day, data[ d ], d)
              break
            case 12:
              this.setItem(december, +day, data[ d ], d)
              break
          }
        })
        return { april, december, august, byHours }
      },
      setItem (map, day, data, time) {
//        let sensor = this.selectedBar.sensor
        let sensor = this.selectedSensor
        if (!map[ day ]) map[ day ] = {}
        Object.keys(data).forEach((d) => {
          let t = this.threshold[ d ]
          let v = data[ d ][ sensor ]
          if (map[ day ][ d ]) {
            let target = map[ day ][ d ]
            target.value = +(target.value) + (v > t ? 1 : 0)
            target.time[ time ] = v
          } else {
            map[ day ][ d ] = {
              value: v > t ? 1 : 0,
              time: {
                [time]: v
              }
            }
          }
        })
      },
      preProcess () {
        this.preData = dataByTime
      },
      openPanel () {
        this.$refs.menu.show()
      },
      configConfirm () {
        this.update()
        this.$refs.menu.close()
      },
      updateSensor (op) {
        this.selectedSensor = op
      }
    },
    ready () {
      this.chartApril = new Calendar(this.$els.april)
      this.chartApril.on('clickDay', this.clickDay)
      this.chartAugust = new Calendar(this.$els.august)
      this.chartAugust.on('clickDay', this.clickDay)
      this.chartDecember = new Calendar(this.$els.december)
      this.chartDecember.on('clickDay', this.clickDay)

      this.legendChart = new CalendarLegend(this.$els.legend)
      this.legendChart && this.selectedChemicals && this.legendChart.update(this.selectedChemicals)
      this.preProcess()
      this.update()
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  @right: 40px;
  @hour-wid: 40px;
  @container-left-width: 250px;
  @legend-div-size: 20px;
  .legend-div {
    width: calc(~"3 * "@legend-div-size);
  }
  .danger {
    margin-left: @margin-m;
    margin-right: @margin-s;
    width: @legend-div-size;
    height: @legend-div-size;
    background: red;
  }
  .safe {
    margin-left: @margin-m;
    margin-right: @margin-s;
    width: @legend-div-size;
    height: @legend-div-size;
    background: #ddd;
  }
  .black {
    margin-left: @margin-m;
    margin-right: @margin-s;
    width: @legend-div-size;
    height: @legend-div-size;
    background: #000;
  }
  .calendar-legend {
    width: 40px;
    height: 40px;
  }
  .container {
    .container-left {
      width: @container-left-width;
    }
    .container-right {
      width: calc(~"100% - 11px - " @container-left-width);
      margin-left: 10px;
    }
    height: calc(~"100% - 60px");
    .left {
      width: calc(~"100% - " @right);
      height: 100%;
    }
    .right {
      /*overflow-x: scroll;*/
    }
    .chart {
      height: calc(~"33% - 24px");
      margin-bottom: 4px;
    }
    .hour-chart-item {
      width: 100%;
      height: @hour-wid;
      margin-top: 2px;
      .day-label {
        width: 72px;
        height: 20px;
        text-align: center;
        line-height: calc(@hour-wid~" - 1px");
        i {
          color: @color-main;
        }
      }
    }
    .hour-container {
      overflow-y: scroll;
    }
    .hour-time-label {
      margin-left: 70px;
      width: calc(~"100% - 70px");
      margin-top: 3px;
      border-bottom: 1px dashed #ddd;
      .item {
        margin-top: 2px;
        height: 20px;
        width: 4.16%;
        text-align: center;
      }
    }
  }
</style>