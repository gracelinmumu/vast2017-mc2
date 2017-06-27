<template>
  <div class="container uk-width-1-1">
      <div class="uk-width-1-1" v-for="ch in diffChart">
        <i class="uk-icon-close uk-align-right"></i>
        <span class="uk-badge uk-badge-primary">{{ch.factory}} - {{ch.sensor}}</span>
        <div class="uk-width-1-1 chart"></div>
      </div>
  </div>
</template>
<script>
  import {sctBarChart, diffChart} from '../vuex/getters'
  import config from '../commons/config'
  export default {
    vuex: {
      getters: { sctBarChart, diffChart }
    },
    data () {
      return {
        sensorOpts: config.sensorOpts,
        factoryOpts: config.factoryOpts,
        sensor: null,
        factory: null
      }
    },
    methods: {
    }
  }
</script>
<style lang="less" scoped>
  @chart-height: 50px;
  .container {
    height: 100%;
    overflow-y: scroll;
    i {
      cursor: pointer;
      color: red;
    }
    .chart {
      height: @chart-height;
      border-bottom: 1px solid #ddd;
    }
  }
</style>
