<template>
  <div class="uk-text-bold">等高线</div>
  <span v-if="selectedBar">{{selectedBar.chemical}} - {{factory}}</span>
  <div class="chart" v-el:chart></div>
</template>
<script>
  import {selectedBar, factory, windToken, chemicalToken} from '../vuex/getters'
  import storage from '../commons/storage'
  import ISOMap from '../charts/ISOMap'

  let windData = null
  let sensorData = null
  export default {
    vuex: {
      getters: { selectedBar, factory, windToken, chemicalToken }
    },
    watch: {
      windToken () {
        if (this.windToken) windData = storage.get(this.windToken).data
      },
      chemicalToken () {
        if (this.chemicalToken) sensorData = storage.get(this.chemicalToken).data
      },
      selectedBar: {
        deep: true,
        handler () {
          this.update()
        }
      }
    },
    methods: {
      update () {
        let { chemical } = this.selectedBar
        chemical
        console.log(sensorData, windData)
        // todo 处理数据 画图
        this.processData()
        let chart = new ISOMap(this.$els.chart)
        chart.draw()
      },
      processData () {}
    }
  }
</script>
<style lang="less" scoped>
  .chart {
    height: 100%;
  }
</style>
