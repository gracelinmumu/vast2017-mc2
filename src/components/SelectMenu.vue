<template>
  <div class="uk-width-1-1 top">
    <!--<div class="uk-width-1-1">-->
      <!--<p class="p-title">Month</p>-->
      <!--<div class="uk-width-1-1 uk-flex uk-flex-wrap">-->
        <!--<button :class="{'uk-button-primary': op === month}"-->
                <!--class="uk-button"-->
                <!--v-for="op in monthOpts"-->
                <!--@click="switchMonth(op)">M{{op}}-->
        <!--</button>-->
      <!--</div>-->
    <!--</div>-->
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Chemical</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button :class="{'uk-button-primary': chemical.indexOf(op) !== -1}"
                class="uk-button"
                v-for="op in chemicalOpts"
                @click="switchChemical(op)"> {{op}}
        </button>
      </div>
    </div>
    <hr>
    <!--<div class="uk-width-1-1">-->
      <!--<p class="p-title">Sensor</p>-->
      <!--<div class="uk-width-1-1 uk-flex uk-flex-wrap">-->
        <!--<button v-for="op in sensorOpts"-->
                <!--class="uk-button"-->
                <!--:class="{'uk-button-primary': sensor.indexOf(op) !== -1}"-->
                <!--@click="switchSensor(op)"> {{op}}-->
        <!--</button>-->
      <!--</div>-->
    <!--</div>-->

    <button class="uk-button uk-button-success uk-align-right" @click="addBar"> Add Reading Bars </button>
    <br>
    <br>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Factory</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button v-for="op in factoryOpts"
                class="uk-button"
                :class="{'uk-button-primary': op === factory}"
                @click="switchFactory(op)"> {{op}}
        </button>
      </div>
      <button class="uk-button uk-button-success uk-align-right" @click="addDiff"> Add Diff </button>
      <br>
      <br>
    </div>
  </div>
  <!--<div class="uk-width-1-1 bottom">-->
    <!--<p class="p-title">Correlation</p>-->
    <!--<button class="uk-button" v-for="op in correlationOpts">{{op}}</button>-->
  <!--</div>-->

</template>
<script>
  import {month, sensor, chemical, factory} from '../vuex/getters'
  import {switchMonth, switchChemical, switchFactory, switchSensor, addSCTChart, addDiffChart, addSCTCharts} from '../vuex/actions'
  import config from '../commons/config'
  export default {
    vuex: {
      getters: { month, sensor, chemical, factory },
      actions: { switchMonth, switchChemical, switchFactory, switchSensor, addSCTChart, addDiffChart, addSCTCharts }
    },
    data () {
      return {
        monthOpts: config.monthOpts,
        factoryOpts: config.factoryOpts,
        chemicalOpts: config.chemicalOpts,
        sensorOpts: config.sensorOpts,
        correlationOpts: [ 'Pearson', 'Spearman' ]
      }
    },
    methods: {
      addBar () {
        if (this.chemical && this.month) {
//          this.addSCTChart({ sensor: this.sensor, chemical: this.chemical, month: this.month })
          this.addSCTCharts({ chemical: this.chemical, month: this.month })
          this.$dispatch('close-dialog')
        }
      },
      addDiff () {
        if (this.sensor && this.factory) this.addDiffChart({ sensor: this.sensor, factory: this.factory, month: this.month })
        this.$dispatch('close-dialog')
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
