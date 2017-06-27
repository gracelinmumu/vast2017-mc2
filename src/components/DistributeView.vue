<template>
  <div class="uk-width-1-1 container">
    <div class="uk-panel-title">分布直方图</div>
    <span v-if="selectedBar">{{selectedBar.sensor}} - {{selectedBar.chemical}} - {{selectedBar.month}}</span>
    <div class="uk-width-1-1" v-el:chart></div>
  </div>
</template>
<script>
  import {selectedBar} from '../vuex/getters'
  import {updateThreshold} from '../vuex/actions'
  import storage from '../commons/storage'
  import Histogram from '../charts/Histogram'

  export default {
    vuex: {
      getters: { selectedBar },
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
        let data = storage.get(dataToken).data
        // 绘图数据是data
        // todo 处理数据，绘图
        this.processData(data, month)

        let chart = new Histogram(this.$els.chart)
        chart.draw()
      },
      processData (data, month) {
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
  }
</style>