<template>
  <div class="uk-width-1-1">
    Correlation
    <select v-model="chemicalSelected">
      <option v-for="op in chemicalOpts">{{op}}</option>
    </select>
  </div>
  <div class="uk-width-1-1 uk-flex container" v-el:chart>
  </div>

</template>
<script>
  import Correlation from '../charts/Correlation'
  import storage from '../commons/storage'
  import {correlationToken} from '../vuex/getters'
  import config from '../commons/config'
  let chemicalOpts = config.chemicalOpts
  let correlationData = null
  export default {
    vuex: {
      getters: { correlationToken }
    },
    watch: {
      correlationToken () {
        correlationData = storage.get(this.correlationToken)
        this.draw()
      },
      chemicalSelected () {
        this.update()
      }
    },
    data () {
      return {
        chemicalOpts,
        chemicalSelected: 'Appluimonia'
      }
    },
    methods: {
      update () {
        this.chartIns.update(this.chemicalSelected)
      },
      draw () {
        this.chartIns.draw(correlationData, this.chemicalSelected)
      }
    },
    processData (data) {
    },
    ready () {
      this.chartIns = new Correlation(this.$els.chart)
      correlationData && this.draw(correlationData, this.chemicalSelected)
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: calc(~"100% - 20px");
  }
</style>