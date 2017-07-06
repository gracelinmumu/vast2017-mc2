<template>
  <!--title-->
  <span class="comps-title"><b>Calendar View</b></span>
  <button class="uk-button uk-button-primary uk-align-right" @click="openPanel"> Config  <i class="uk-icon-cog"></i>
  </button>
  <!--params-->
  <div class="uk-width-1-1 uk-flex">
    Sensor:<span class="uk-badge uk-badge-primary">{{selectedSensor}}</span>&nbsp;&nbsp;
    Chemicals: <span v-for="op in selectedChemicals" class="uk-badge uk-badge-primary uk-margin-right">{{op}}</span>
  </div>
  <!--body-->
  <div class="uk-width-1-1 uk-flex container">
    <div class="uk-width-1-2">
      <b>April</b>
      <div class="uk-width-1-1 chart" v-el:april></div>
      <b>August</b>
      <div class="uk-width-1-1 chart" v-el:august></div>
      <b>December</b>
      <div class="uk-width-1-1 chart" v-el:december></div>
    </div>
    <div class="uk-width-1-2 full-height uk-flex hour-container">
      <div class="hour-chart-item" v-for="hour in hoursData">
        {{hour.display}}<i class="uk-icon-close uk-align-right" @click="closeHour(hour)"></i>
        <div class="uk-width-1-1 full-height"
             :id="'Day'+hour.day"
             :draw="drawHours(hour)">
        </div>
      </div>
    </div>
  </div>
  <!--dialog-->
  <dialog v-ref:menu>
    <div slot="title">Config Panel</div>
    <div slot="body">
      <div class="uk-width-1-1">
        <span>Sensor</span>
        <button v-for="op in sensorOpts"
                class="uk-button"
                :class="{'uk-button-primary': op===selectedSensor}"
                @click="updateSensor(op)">
          {{op}}
        </button>
      </div>
      <br>
      <div class="uk-width-1-1">
        <span>Chemical</span>
        <template v-for="op in chemicalOpts">
          <input type="checkbox" id="chemical" value="chemicalsMap[op]" v-model="chemicalsMap[op]">
          <label for="chemical">{{op}}</label>
        </template>
      </div>
      <button class="uk-button uk-button-success uk-align-right" @click="configConfirm"> Confirm </button>
    </div>
  </dialog>
</template>
<script>
  import Calendar from '../charts/Calendar'
  import Dialog from './Dialog.vue'
  import Hour from '../charts/Hour'
  import storage from '../commons/storage'
  import {selectedBar, timeToken, threshold} from '../vuex/getters'
  import {updateSelectedTime, updateSelectedChemical} from '../vuex/actions'
  import config from '../commons/config'

  let dataByTime = null

  let { chemicalOpts, sensorOpts } = config
  let chemicalsMap = {}
  chemicalOpts.forEach((d) => {
    chemicalsMap[ d ] = true
  })

  export default {
    vuex: {
      getters: { selectedBar, timeToken, threshold },
      actions: {updateSelectedTime, updateSelectedChemical}
    },
    components: { Dialog },
    watch: {
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
      }
    },
    computed: {
      selectedChemicals () {
        return Object.keys(this.chemicalsMap).filter((c) => this.chemicalsMap[ c ])
      },
      hoursDataMap () {
        let dict = {}
        this.hoursData.forEach((d, index) => {
          dict[ d.day ] = index + 1
        })
        return dict
      }
    },
    data () {
      return {
        chemicalsMap,
        chemicalOpts,
        sensorOpts,
        selectedSensor: 'S6',
        hoursData: []
      }
    },
    methods: {
      closeHour (day) {
        this.hoursData.$remove(day)
      },
      drawHours ({ day, data }) {
        this.$nextTick(() => {
          new Hour('#Day' + day)
            .draw(data, this.threshold, this.selectedChemicals)
            .on('clickHour', this.clickHour)
        })
      },
      clickDay (day, data) {
        let d = new Date(+day)
        if (!this.hoursDataMap[ day ]) {
          this.hoursData = this.hoursData.concat([ { day, data, display: 1 + d.getMonth() + ' ' + d.getDate() } ])
        }
      },
      clickHour (hour, ch) {
        console.log('clicked hour', hour, ch)
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

//      this.chartHour = new Hour(this.$els.hour)

      this.preProcess()
      this.update()
    }
  }
</script>
<style lang="less" scoped>
  @right: 40px;
  @hour-wid: 50px;
  .container {
    height: calc(~"100% - 60px");
    .left {
      width: calc(~"100% - " @right);
      height: 100%;
    }
    .right {
      overflow-x: scroll;
    }
    .chart {
      height: calc(~"33% - 24px");
      margin-bottom: 4px;
    }
    .hour-chart-item {
      width: @hour-wid;
      height: 100%;
    }
    .hour-container {
      overflow: scroll;
    }
  }
</style>