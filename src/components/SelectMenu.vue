<template>
  <div class="uk-width-1-1 top">
    <div class="uk-width-1-1">
      <p class="p-title">Month</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button class="uk-button" v-for="op in monthOpts">{{op}}</button>
      </div>
    </div>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Chemical</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button class="uk-button" v-for="op in chemicalOpts"> {{op}}</button>
      </div>
    </div>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Sensor</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button class="uk-button" v-for="op in sensorOpts"> {{op}}</button>
      </div>
    </div>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Factory</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button class="uk-button" v-for="op in factoryOpts"> {{op}}</button>
      </div>
    </div>
  </div>
  <div class="uk-width-1-1 bottom">
    <p class="p-title">Correlation</p>
    <button class="uk-button" v-for="op in correlationOpts">{{op}}</button>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        monthOpts: [ 'M4', 'M8', 'M12' ],
        factoryOpts: [ 'F1', 'F2', 'F3', 'F4' ],
        chemicalOpts: [ 'C1', 'C2', 'C3', 'C4' ],
        sensorOpts: [ 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9' ],
        correlationOpts: ['Pearson', 'Spearman']
      }
    }
  }
</script>
<style lang="less" scoped>
  .p-title {
    padding-left: 6px;
    border-left: 3px solid #1fa2d6;
    font-weight: bold;
  }
  .top {
    padding: 10px;
    button {
      margin-left: 2px;
    }
  }
  .bottom {
    margin-top: 10px;
    padding: 10px;
    border-top: 2px solid #ddd;
  }
</style>
