<template>
  <div class="uk-panel-title">日历图</div>
  <div class="uk-width-1-1 uk-flex container">
    <div class="left">
      <div class="uk-width-1-1 chart" v-el:april></div>
      <div class="uk-width-1-1 chart" v-el:august></div>
      <div class="uk-width-1-1 chart" v-el:december></div>
    </div>
    <div class="right">xxxxx</div>
  </div>

</template>
<script>
  import sensorData from '../data/sensor.json'
  import Calendar from '../charts/Calendar'
  import {month, sensor, chemical} from '../vuex/getters'
  sensorData
  export default {
    vuex: {
      getters: { month, sensor, chemical }
    },
    watch: {
      month () {
        this.update()
      },
      sensor () {
        this.update()
      },
      chemical () {
        this.update()
      }
    },
    methods: {
      update () {
        // todo 1.处理数据； 2.绘图
        let data = this.processData()

        let chartApril = new Calendar(this.$els.april)
        chartApril.draw(data.april)

        let chartAugust = new Calendar(this.$els.august)
        chartAugust.draw(data.august)

        let chartDecember = new Calendar(this.$els.december)
        chartDecember.draw(data.december)
      },
      processData () {
        let res = {}
        this.preData
        return res
      },
      preProcess () {
        this.preData = sensorData
      }
    },
    ready () {
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
      border: 1px solid #ddd;
    }
    .chart {
      height: 30%;
      border: 1px solid #ddd;
      margin-top: 4px;
    }
  }
</style>