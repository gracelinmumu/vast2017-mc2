<template>
  <div class="uk-panel-title">
    <template v-if="selectedBar">{{selectedBar.sensor}} - {{selectedBar.chemical}} - M{{selectedBar.month}}
    </template>
  </div>
  <div class="uk-width-1-1 uk-flex container">
    <div class="left">
      <b>April</b>
      <div class="uk-width-1-1 chart" v-el:april></div>
      <b>August</b>
      <div class="uk-width-1-1 chart" v-el:august></div>
      <b>December</b>
      <div class="uk-width-1-1 chart" v-el:december></div>
    </div>
    <div class="right" v-el:hour></div>
  </div>

</template>
<script>
  import Calendar from '../charts/Calendar'
  import Hour from '../charts/Hour'
  import storage from '../commons/storage'
  import {selectedBar, threshold} from '../vuex/getters'
  import _ from 'lodash'

  let sensorData = null
  export default {
    vuex: {
      getters: { selectedBar, threshold }
    },
    watch: {
      selectedBar: {
        deep: true,
        handler () {
          if (this.selectedBar) this.update()
        }
      }
    },
    methods: {
      update () {
        if (this.selectedBar) {
          let { dataToken } = this.selectedBar

          let data = storage.get(dataToken)
          // todo 1.处理数据； 2.绘图
          let { april, august, december, byHours } = this.processData(data)
          let colorMap = [ '#00b32d', '#71e38e', '#f1a66a', '#f26157', '#db4b0b' ]

          // 分段的策略，现在是均匀分!
          // todo
          let values = [].concat(Object.keys(april).map((d) => april[ d ]), Object.keys(august).map((d) => august[ d ]), Object.keys(december).map((d) => december[ d ]))
          let max = _.max(values)
          let count = 5
          let step = max / count
          let domain = []
          for (let i = 1; i < count; i++) {
            domain.push(step * i)
          }
          this.chartApril.draw(april, domain, colorMap)
          this.chartAugust.draw(august, domain, colorMap)
          this.chartDecember.draw(december, domain, colorMap)
          this.chartHour.draw(byHours, domain, colorMap)
        }
      },
      processData (data) {
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
            this.setItem(byHours, +h, data[ d ])
          }
          switch (m) {
            case 4:
              this.setItem(april, +day, data[ d ])
              break
            case 8:
              this.setItem(august, +day, data[ d ])
              break
            case 12:
              this.setItem(december, +day, data[ d ])
              break
          }
        })

        return { april, december, august, byHours }
      },
      setItem (map, day, d) {
        let t = this.threshold[ this.selectedBar.chemical ]
        if (map[ day ]) {
          map[ day ] = +(map[ day ]) + (d > t ? 1 : 0)
        } else {
          map[ day ] = d > t ? 1 : 0
        }
      },
      preProcess () {
        this.preData = sensorData
      }
    },
    ready () {
      this.chartApril = new Calendar(this.$els.april)
      this.chartAugust = new Calendar(this.$els.august)
      this.chartDecember = new Calendar(this.$els.december)

      this.chartHour = new Hour(this.$els.hour)

      this.preProcess()
      this.update()
    }
  }
</script>
<style lang="less" scoped>
  @right: 40px;
  .container {
    height: calc(~"100% - 20px");
    .left {
      width: calc(~"100% - " @right);
      height: 100%;
    }
    .right {
      width: @right;
      height: 100%;
    }
    .chart {
      height: calc(~"33% - 24px");
      margin-bottom: 4px;
    }
  }
</style>