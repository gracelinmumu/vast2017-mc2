<template>
  <div class="uk-width-1-1 top panel">
    <div class="content">
      <p>sensor readingggggggggggggggg</p>
      <p>sensor readingggggggggggggggg</p>
      <p>sensor readingggggggggggggggg</p>
      <p>sensor readingggggggggggggggg</p>
    </div>
  </div>
  <div class="uk-width-1-1 middle panel">
    Diff
  </div>
  <div class="uk-width-1-1 bottom panel">
    wind
  </div>
</template>
<script>
  import sensorData from '../data/sensor.json'
  import {month, chemical, sensor, factory} from '../vuex/getters'
  export default {
    vuex: {
      getters: { month, chemical, sensor, factory }
    },
    created () {
      console.log(sensorData[ 0 ])
    },
    methods: {
      clickChart () {},
      drawWind () {},
      drawDirectionDiff () {}
    }
  }
</script>
<style lang="less" scoped>
  @bottom: 60px;
  @middle: 80px;
  .panel {
    border: 1px solid #ddd;
  }
  .top {
    height: calc(~"100% - " @bottom ~"-" @middle);
    overflow-y: scroll;
    .content {
      height: 300px;
    }
  }
  .middle {
    height: @middle;
  }
  .bottom {
    height: @bottom;
  }
</style>
