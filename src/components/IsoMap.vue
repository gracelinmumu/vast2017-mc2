<template>
  <div class="uk-text-bold">等高线</div>
  <div class="chart" v-el:chart></div>
</template>
<script>
  import {month, chemical, sensor, factory} from '../vuex/getters'
  import ISOMap from '../charts/ISOMap'
  export default {
    vuex: {
      getters: { month, chemical, sensor, factory }
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
