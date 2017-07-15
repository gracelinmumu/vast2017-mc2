<template>
  <div class="uk-width-1-1">
    <span class="comps-title"><b>Reading View</b></span>
    <i v-if="timeLineState==='bottom'" class="uk-icon-expand uk-icon-small"  @click="switchTimelineState('top')"></i>
    <i v-else class="uk-icon-compress uk-icon-small"  @click="switchTimelineState('bottom')"></i>
    <div class="uk-align-right"> Month
      <button class="uk-button" :class="{'uk-button-primary': selectedMonth===month}">Three Months</button>
      <button v-for="month in monthOpts"
         class="uk-button"
         :class="{'uk-button-primary': selectedMonth===month}"
         @click="switchMonth(month)">M{{month}}
      </button>
    </div>
    <!--<button class="uk-button uk-button-primary uk-align-right" @click="openDialog"> Config  <i class="uk-icon-cog"></i>-->
    <!--</button>-->
  </div>
  <div class="uk-width-1-1 top panel">
    <div class="content">
      <div v-for="(index,bar) in sctBarChart"
           class="uk-width-1-1 bar-container">
        <i class="uk-icon-close uk-align-right" @click="closeBar(index,bar)"></i>
        <span class="uk-badge uk-badge-primary">{{bar.sensor}} - {{bar.chemical}}</span>
        <div class="uk-width-1-1 full-height uk-grid">
          <div class="uk-width-5-6 bar-item" :id="'Bar-'+index" :draw="calcAndDrawReading(bar, '#Bar-'+index)"></div>
          <div class="uk-width-1-6 bar-item" :id="'BarDistribute-'+index"
               :draw="calcAndDrawDistribute(bar, '#BarDistribute-'+index)"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="uk-width-1-1 middle panel">
    <direction-diff></direction-diff>
  </div>
  <div class="uk-width-5-6 bottom panel">
    <wind></wind>
  </div>
  <dialog v-ref:menu>
    <div slot="title">Config Panel</div>
    <div slot="body">
      <select-menu @close-dialog="closeDialog"></select-menu>
    </div>
  </dialog>
</template>
<script>
  import Dialog from './Dialog.vue'
  import DirectionDiff from './DirectionDiff.vue'
  import Wind from './Wind.vue'
  import SelectMenu from './SelectMenu.vue'
  import storage from '../commons/storage'
  import Histogram from '../charts/Histogram'
  import BarChart from '../charts/BarChart'
  import config from '../commons/config'
  import {
    month,
    chemical,
    sensor,
    factory,
    threshold,
    sctDataToken,
    sctBarChart,
    selectedBar,
    selectedHour,
    timeLineState
  } from '../vuex/getters'
  import {switchMonth, removeSCTChart, updateSelectedBar, switchPlay, updateThreshold, addSCTCharts, switchTimelineState} from '../vuex/actions'

  let allData = null
  let {monthOpts, chemicalOpts} = config
  export default {
    vuex: {
      getters: { selectedMonth: month, chemical, sensor, factory, threshold, sctDataToken, sctBarChart, selectedBar, selectedHour, timeLineState },
      actions: { switchMonth, removeSCTChart, updateSelectedBar, switchPlay, updateThreshold, addSCTCharts, switchTimelineState }
    },
    data () {
      return {
        bar: null,
        histCharts: {},
        barChemical: {},
        barCharts: {},
        monthOpts,
        barChartMap: {}
      }
    },
    watch: {
      sctDataToken () {
        allData = storage.get(this.sctDataToken)
      },
      threshold: {
        deep: true,
        handler () {
          this.update()
        }
      },
      selectedHour () {
        this.updateCurrent()
      },
      selectedMonth () {
        this.updateMonth()
      }
    },
    components: { Wind, DirectionDiff, Dialog, SelectMenu },
    methods: {
      clickUp () {
        console.log('go up')
      },
      updateMonth () {
        this.sctBarChart.forEach((bar, index) => {
          let selector = '#Bar-' + index
//          this.barChartMap[selector] && (this.barChartMap[selector].clearHighlight())
          this.calcAndDrawReading(bar, selector)
          let distributeSelector = '#BarDistribute-' + index
          this.calcAndDrawDistribute(bar, distributeSelector, this.selectedMonth)
        })
      },
      // todo 处理数据，绘制一个分布图
      calcAndDrawDistribute (bar, selector, mMonth = null) {
        if (!allData && this.sctDataToken) {
          allData = storage.get(this.sctDataToken)
        }
        // 柱状图相关数据
        let { month, chemical } = bar
        if (mMonth != null) month = mMonth

        // 绘图数据是data
        if (allData) {
          let data = allData[ bar.sensor ][ bar.chemical ]

          // Step1 处理数据
          let chartData = this.processData(data, month)
          // this.threshold 不同化学物质的阈值
          // Step2绘图
          this.$nextTick(() => {
            let chart = null
            if (!this.histCharts[selector]) {
              chart = new Histogram(selector, bar.chemical)
              // new
              this.histCharts[selector] = chart
              this.barChemical[selector] = bar.chemical
              chart.on({ updateThreshold: this.updateT })
            }
            chart = this.histCharts[selector]
            chart.draw(chartData, this.threshold[ chemical ], chemical)
          })
        }
      },
      updateT (t, chemical) {
        this.updateThreshold(chemical, t)
      },
      update () {
        for (let index = 0; index < this.sctBarChart.length; index++) {
          let selector = '#BarDistribute-' + index
          this.histCharts[selector].update(this.threshold[this.barChemical[selector]])
        }
        for (let index = 0; index < this.sctBarChart.length; index++) {
          let selector = '#Bar-' + index
          let barChemicalSelector = '#BarDistribute-' + index
          this.barCharts[selector].update(this.threshold[this.barChemical[barChemicalSelector]])
        }
      },
      updateCurrent () {
        let time = this.selectedHour
        this.sctBarChart.forEach((chart, index) => {
          let selector = '#Bar-' + index
          this.barCharts[selector].highlightCurrent(time)
        })
      },
      // 分布图数据处理
      processData (data, month) {
        let dataValues = []
        Object.keys(data).forEach((d) => {
          let m = new Date(d).getMonth() + 1
          if (m === month) {
            dataValues.push(data[ d ])
          }
        })
        return dataValues
      },
      processReadingData (data, month) {
        let dataValues = []
        let t = 0
        let hoursOfDay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        let ii = 0
        Object.keys(data).forEach((d) => {
          let m = new Date(d).getMonth() + 1
          t = new Date(d).getHours()
          while (t !== hoursOfDay[ ii ]) {
            ii = (ii + 1) % 24
            if (m === month) {
              dataValues.push({
                value: 0,
                time: new Date(d)
              })
            }
          }

          if (m === month) {
            dataValues.push({
              value: data[ d ],
              time: new Date(d)
            })
          }

          ii = (ii + 1) % 24
        })
        return dataValues
      },
      // todo 绘制一个读数图
      calcAndDrawReading (bar, selector) {
        if (!allData && this.sctDataToken) {
          allData = storage.get(this.sctDataToken)
        }
        // 柱状图相关数据
        let { chemical } = bar
        let month = this.selectedMonth
        // 绘图数据是data
        if (allData) {
          let data = allData[ bar.sensor ][ bar.chemical ]

          // Step1 处理数据
          let chartData = this.processReadingData(data, month)
          // this.threshold 不同化学物质的阈值
          // Step2绘图
          this.$nextTick(() => {
            let chart = null
            if (!this.barChartMap[selector]) {
              chart = new BarChart(selector)
              chart.on({ updateThreshold: this.updateT })
              chart.on({ updateCurrent: this.updateC })
              this.barChartMap[selector] = chart
            }
            chart = this.barChartMap[selector]
            // new
            this.barCharts[selector] = chart
            chart.clearHighlight()
            chart.draw(chartData, this.threshold[ chemical ], month)
          })
        }
      },
      openDialog () {
        this.$refs.menu.show()
      },
      closeDialog () {
        this.$refs.menu.close()
      },
      closeBar (index, bar) {
        this.removeSCTChart(index)
      }
    },
    created () {
      chemicalOpts.forEach((chemical) => {
        this.addSCTCharts({ chemical, month: this.selectedMonth })
      })
      return this
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  @bottom: 60px;
  @middle: 100px;
  @reading-view-height: 80px;
  .panel {
    border: 1px solid #ddd;
  }
  i {
    color: @color-main;
  }
  .top {
    height: calc(~"100% - 20px - " @bottom ~"-" @middle);
    overflow-y: scroll;
    .content {
      /*height: 300px;*/
      i {
        cursor: pointer;
        color: @color-main;
      }
      .bar-container {
        height: @reading-view-height;
        border-bottom: 1px solid #ddd;
      }
    }
  }
  .middle {
    height: @middle;
    border-top: 1px solid deepskyblue;
    border-bottom: 1px solid deepskyblue;
  }
  .bottom {
    height: @bottom;
  }
  .bar-item {
    height: calc(~"100% - 20px");
    /*border: 1px solid #ddd;*/
  }
  .full-height {
    height: 100%;
  }
</style>
