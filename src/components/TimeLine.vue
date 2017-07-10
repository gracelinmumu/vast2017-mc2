<template>
  <div class="uk-width-1-1">
    <span class="comps-title"><b>Reading View</b></span>
    <div class="uk-align-right"> Month<button v-for="month in monthOpts"
                       class="uk-button"
                       :class="{'uk-button-primary': selectedMonth===month}"
                       @click="switchMonth(month)">M{{month}}
    </button></div>
    <button class="uk-button uk-button-primary uk-align-right" @click="openDialog"> Config  <i class="uk-icon-cog"></i>
    </button>
  </div>
  <div class="uk-width-1-1 top panel">
    <div class="content">
      <div v-for="(index,bar) in sctBarChart"
           class="uk-width-1-1 bar-container">
        <i class="uk-icon-close uk-align-right" @click="closeBar(index,bar)"></i>
        <span class="uk-badge uk-badge-primary"
              @click="drawBar(bar)">{{bar.sensor}} - {{bar.chemical}} - {{bar.month}}
        </span>
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
  <div class="uk-width-1-1 bottom panel">
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
    selectedBar
  } from '../vuex/getters'
  import {switchMonth, removeSCTChart, updateSelectedBar, switchPlay, updateThreshold} from '../vuex/actions'

  let allData = null
  let monthOpts = config.monthOpts
  export default {
    vuex: {
      getters: { selectedMonth: month, chemical, sensor, factory, threshold, sctDataToken, sctBarChart, selectedBar },
      actions: { switchMonth, removeSCTChart, updateSelectedBar, switchPlay, updateThreshold }
    },
    data () {
      return {
        bar: null,
        histCharts: {},
        barCharts: {},
        monthOpts
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
      }
    },
    components: { Wind, DirectionDiff, Dialog, SelectMenu },
    methods: {
      // todo 处理数据，绘制一个分布图
      calcAndDrawDistribute (bar, selector) {
        // 柱状图相关数据
        console.log(bar)
        let { month, chemical } = bar
        console.log(month, chemical)

        // 容器选择器
        console.log(selector)

        // 绘图数据是data
        let data = allData[ bar.sensor ][ bar.chemical ]
        console.log(data)

        // Step1 处理数据
        let chartData = this.processData(data, month)
        // this.threshold 不同化学物质的阈值
        // Step2绘图
        this.$nextTick(() => {
          let chart = new Histogram(selector)
          // new
          this.histCharts[selector] = chart
          this.barChemical = bar.chemical
          chart.on({ updateThreshold: this.updateT })
          chart.draw(chartData, this.threshold[ chemical ], chemical)
        })
      },
      updateT (t, chemical) {
        this.updateThreshold(chemical, t)
      },
      update () {
        for (let index = 0; index < this.sctBarChart.length; index++) {
          let selector = '#BarDistribute-' + index
          this.histCharts[selector].update(this.threshold[this.barChemical])
        }
        for (let index = 0; index < this.sctBarChart.length; index++) {
          let selector = '#Bar-' + index
          this.barCharts[selector].update(this.threshold[this.barChemical])
        }
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
              dataValues.push(0)
            }
          }

          if (m === month) {
            dataValues.push(data[ d ])
          }

          ii = (ii + 1) % 24
        })
        return dataValues
      },
      // todo 绘制一个读数图
      calcAndDrawReading (bar, selector) {
        // 柱状图相关数据
        console.log(bar)
        let { month, chemical } = bar
        console.log('calcAndDrawReading', month, chemical)

        // 容器选择器
        console.log(selector)

        // 绘图数据是data
        let data = allData[ bar.sensor ][ bar.chemical ]
        console.log(data)

        // Step1 处理数据
        let chartData = this.processReadingData(data, month)
        // this.threshold 不同化学物质的阈值
        // Step2绘图
        this.$nextTick(() => {
          let chart = new BarChart(selector)
          // new
          this.barCharts[selector] = chart
          chart.on({ updateThreshold: this.updateT })
          chart.on({ updateCurrent: this.updateC })
          chart.draw(chartData, this.threshold[ chemical ], month)
        })

        // todo @ruike 处理数据，绘图
        // let data = allData[ bar.sensor ][ bar.chemical ]
        // console.log(data)
        // 绘图类可以参考Histogram的写法
        // tip1 记得暴露updateThreshold()方法，这样分布图中的threshold更新时，读数图也同步更新
        // 你可以试一下，threshold更新时，日历图已经更新了
        // Tip2 记得暴露updateCurrent()更新当前时间
      },
      drawWind () {
        // @ruike
      },
      drawDirectionDiff () {
        // @ruike
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
    }
  }
</script>
<style lang="less" scoped>
  @bottom: 60px;
  @middle: 100px;
  .panel {
    border: 1px solid #ddd;
  }
  .top {
    height: calc(~"100% - 20px - " @bottom ~"-" @middle);
    overflow-y: scroll;
    .content {
      /*height: 300px;*/
      i {
        cursor: pointer;
        color: red;
      }
      .bar-container {
        height: 100px;
        border-bottom: 1px solid #ddd;
      }
    }
  }
  .middle {
    height: @middle;
  }
  .bottom {
    height: @bottom;
  }
  .bar-item {
    height: calc(~"100% - 20px");
    border: 1px solid #ddd;
  }
  .full-height {
    height: 100%;
  }
</style>
