<template>
  <div class="uk-panel-title">日历图</div>
  <template v-if="selectedBar">{{selectedBar.sensor}} {{selectedBar.chemical}} {{threshold[ selectedBar.chemical ]}}
  </template>
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
  import storage from '../commons/storage'
  import Calendar from '../charts/Calendar'
  import {selectedBar, threshold} from '../vuex/getters'

  let sensorData = null
  export default {
    vuex: {
      getters: { selectedBar, threshold }
    },
    watch: {
      selectedBar: {
        deep: true,
        handler () {
          if (this.selectedBar) this.update()
        }
      }
    },
    methods: {
      update () {
        if (this.selectedBar) {
          let { dataToken } = this.selectedBar

          let data = storage.get(dataToken).data
          // todo 1.处理数据； 2.绘图
          let dataFormat = this.processData(data)
          let chartApril = new Calendar(this.$els.april)
          chartApril.draw(dataFormat.april)

          let chartAugust = new Calendar(this.$els.august)
          chartAugust.draw(dataFormat.august)

          let chartDecember = new Calendar(this.$els.december)
          chartDecember.draw(dataFormat.december)
        }
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