<template>
  <div class="uk-width-1-1 container" v-el:wind></div>
</template>
<script>
  import storage from '../commons/storage'
  import meteorological from '../data/meteorological.json'
  import {setWindToken} from '../vuex/actions'
  import {month, selectedHour} from '../vuex/getters'
  import WindChart from '../charts/WindChart'
  import WindProcessWK from './windProcess.worker'
  let monthWindMap = {}
  export default {
    vuex: {
      actions: { setWindToken },
      getters: {month, selectedHour}
    },
    watch: {
      month () {
        this.update()
      },
      selectedHour () {
        this.updateCurrent()
      }
    },
    methods: {
      update () {
        this.chartIns && this.month && monthWindMap[this.month] && this.chartIns.draw(monthWindMap[this.month], this.month)
      },
      updateCurrent () {
        this.chartIns && this.selectedHour && this.chartIns.highlight(new Date(this.selectedHour))
      }
    },
    created () {
      let dataToken = storage.set(meteorological)
      this.setWindToken(dataToken)
    },
    ready () {
      let worker = new WindProcessWK()

      worker.postMessage({data: meteorological})
      worker.onmessage = (evt) => {
        let evtData = evt.data
        monthWindMap = evtData.monthWindMap
        this.update()
      }
      this.chartIns = new WindChart(this.$els.wind)
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
  }
</style>
