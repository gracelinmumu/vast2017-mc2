<template>
  <div class="uk-width-1-1 container">
    <div class="uk-panel-title">分布直方图</div>
    <div class="uk-width-1-1" v-el:chart></div>
  </div>
</template>
<script>
  import {month, sensor, chemical} from '../vuex/getters'
  import Histogram from '../charts/Histogram'
  export default {
    vuex: {
      getters: { month, sensor, chemical }
    },
    computed: {
      updateOpts () {
        return this.month + this.sensor + this.chemical
      }
    },
    watch: {
      updateOpts () {
        this.update()
      }
    },
    methods: {
      update () {
        this.processData()

        let chart = new Histogram(this.$els.chart)
        chart.draw()
      },
      processData () {
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
  }
</style>