<template>
  <div class="uk-width-1-1 top panel">
    <div class="content">
      <div v-for="(index,bar) in sctBarChart"
           class="uk-width-1-1 bar-container"
           @click="clickBar(bar)">
        <i class="uk-icon-close uk-align-right" @click="closeBar(index,bar)"></i>
        <span class="uk-badge uk-badge-primary"
              @click="drawBar(bar)">{{bar.sensor}} - {{bar.chemical}} - {{bar.month}}</span>
        <div class="uk-width-1-1" :id="'Bar-'+index"></div>
      </div>
    </div>
  </div>
  <div class="uk-width-1-1 middle panel">
    <direction-diff></direction-diff>
  </div>
  <div class="uk-width-1-1 bottom panel">
    <wind></wind>
  </div>
</template>
<script>
  import DirectionDiff from './DirectionDiff.vue'
  import Wind from './Wind.vue'
  import storage from '../commons/storage'
  import {month, chemical, sensor, factory, threshold, sctDataToken, sctBarChart} from '../vuex/getters'
  import {removeSCTChart, updateSelectedBar} from '../vuex/actions'
  let allData = null
  export default {
    vuex: {
      getters: { month, chemical, sensor, factory, threshold, sctDataToken, sctBarChart },
      actions: { removeSCTChart, updateSelectedBar }
    },
    watch: {
      sctDataToken () {
        allData = storage.get(this.sctDataToken).data
      }
    },
    components: { Wind, DirectionDiff },
    methods: {
      clickBar (bar) {
        let data = allData[ bar.sensor ][ bar.chemical ]
        let dataToken = storage.set(data)
        this.updateSelectedBar(Object.assign({ dataToken }, bar))
      },
      drawWind () {},
      drawDirectionDiff () {},
      closeBar (index, bar) {
        console.log(index, bar)
        this.removeSCTChart(index)
      },
      drawBar (bar) {
        let { chemical, month, sensor } = bar
        if (allData && allData[ sensor ] && allData[ sensor ][ chemical ]) {
          let chartData = allData[ sensor ][ chemical ]
          // todo 根据chartData threshold month绘图
          chartData
          month
        }
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
    height: calc(~"100% - " @bottom ~"-" @middle);
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
</style>
