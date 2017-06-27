<template>
  <div class="uk-text-bold">等高线</div>
  <span v-if="selectedBar">{{selectedBar.chemical}} - {{factory}}</span>
  <div class="chart" v-el:chart></div>
</template>
<script>
  import {selectedBar, factory} from '../vuex/getters'
  import ISOMap from '../charts/ISOMap'

  export default {
    vuex: {
      getters: { selectedBar, factory }
    },
    watch: {
      selectedBar: {
        deep: true,
        handler () {

        }
      }
    },
    methods: {
      update () {
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
