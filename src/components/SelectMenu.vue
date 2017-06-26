<template>
  <div class="uk-width-1-1 top">
    <div class="uk-width-1-1">
      <p class="p-title">Month</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button :class="{'uk-button-primary': op === month}"
                class="uk-button"
                v-for="op in monthOpts"
                @click="switchMonth(op)">{{op}}
        </button>
      </div>
    </div>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Chemical</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button :class="{'uk-button-primary': op === chemical}"
                class="uk-button"
                v-for="op in chemicalOpts"
                @click="switchChemical(op)"> {{op}}
        </button>
      </div>
    </div>
    <hr>
    <div class="uk-width-1-1">
      <p class="p-title">Sensor</p>
      <div class="uk-width-1-1 uk-flex uk-flex-wrap">
        <button v-for="op in sensorOpts"
                class="uk-button"
                :class="{'uk-button-primary': op === sensor}"
                @click="switchSensor(op)"> {{op}}
        </button>
      </div>
    </div>
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
        correlationOpts: [ 'Pearson', 'Spearman' ],
        month: 'M12',
        chemical: 'C2',
        factory: 'F4',
        sensor: 'S3'
      }
    },
    methods: {
      switchMonth (m) {
        this.month = m
      },
      switchChemical (c) {
        this.chemical = c
      },
      switchSensor (s) {
        this.sensor = s
      },
      switchFactory (f) {
        this.factory = f
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
