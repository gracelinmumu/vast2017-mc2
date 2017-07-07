<template>
  <div class="uk-width-1-1 container">
    <div class="uk-panel-title">分布直方图<span
      v-if="selectedBar">{{selectedBar.sensor}} - {{selectedBar.chemical}} - {{selectedBar.month}}</span></div>
    <div class="uk-width-1-1 chart" v-el:chart></div>
  </div>
</template>
<script>
  import {selectedBar, threshold} from '../vuex/getters'
  import {updateThreshold} from '../vuex/actions'
  import storage from '../commons/storage'
  import Histogram from '../charts/Histogram'

  export default {
    vuex: {
      getters: { selectedBar, threshold },
      actions: { updateThreshold }
    },
    watch: {
      selectedBar: {
        deep: true,
        handler () {
          this.update()
        }
      }
    },
    methods: {
      update () {
        let { month, dataToken } = this.selectedBar
        let input = storage.get(dataToken)
        console.log(input)
        // 绘图数据是data
        // todo 处理数据，绘图
        let data = this.processData(input, month)
        this.chartIns.draw(data, this.threshold[ this.selectedBar.chemical ])
      },
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
      updateT (t) {
        this.updateThreshold(this.selectedBar.chemical, t)
      }
    },
    ready () {
      this.chartIns = new Histogram(this.$els.chart)
      this.chartIns.on({ updateThreshold: this.updateT })
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
    .chart {
      height: calc(~"100% - 40px");
    }
    .brush .extent {
      stroke: #fff;
      fill-opacity: 0.125;
      shape-rendering: crispEdges;
    }
  }
</style>