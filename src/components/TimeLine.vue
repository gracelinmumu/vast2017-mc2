<template>
  <div class="uk-width-1-1">
    <span class="comps-title"><b>Reading View</b></span>
    <button class="uk-button uk-button-primary uk-align-right" @click="openDialog"> Config  <i class="uk-icon-cog"></i>
    </button>
  </div>
  <div class="uk-width-1-1 top panel">
    <div class="content">
      <div v-for="(index,bar) in sctBarChart"
           class="uk-width-1-1 bar-container"
           @click="clickBar(bar, index)">
        <i class="uk-icon-close uk-align-right" @click="closeBar(index,bar)"></i>
        <span class="uk-badge uk-badge-primary"
              @click="drawBar(bar)">{{bar.sensor}} - {{bar.chemical}} - {{bar.month}}
        </span>
        <div class="uk-width-1-1 full-height uk-grid">
          <div class="uk-width-5-6 bar-item" :id="'Bar-'+index"></div>
          <div class="uk-width-1-6 bar-item" :id="'BarDistribute-'+index"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="uk-width-1-1 middle panel">
    <direction-diff></direction-diff>
  </div>
  <div class="uk-width-1-1 bottom panel">
    <wind></wind>
  </div>
  <dialog v-ref:menu>
    <div slot="title">Config Panel</div>
    <div slot="body">
      <select-menu @close-dialog="closeDialog"></select-menu>
    </div>
  </dialog>
</template>
<script>
  import Dialog from './Dialog.vue'
  import DirectionDiff from './DirectionDiff.vue'
  import Wind from './Wind.vue'
  import SelectMenu from './SelectMenu.vue'
  import storage from '../commons/storage'

  import {
    month,
    chemical,
    sensor,
    factory,
    threshold,
    sctDataToken,
    sctBarChart,
    isPlay,
    selectedBar
  } from '../vuex/getters'
  import {removeSCTChart, updateSelectedBar, switchPlay} from '../vuex/actions'

  let allData = null

  export default {
    vuex: {
      getters: { month, chemical, sensor, factory, threshold, sctDataToken, sctBarChart, isPlay, selectedBar },
      actions: { removeSCTChart, updateSelectedBar, switchPlay }
    },
    watch: {
      sctDataToken () {
        allData = storage.get(this.sctDataToken)
      }
    },
    components: { Wind, DirectionDiff, Dialog, SelectMenu },
    methods: {
      openDialog () {
        this.$refs.menu.show()
      },
      closeDialog () {
        this.$refs.menu.close()
      },
      clickBar (bar, index) {
        let data = allData[ bar.sensor ][ bar.chemical ]
        let dataToken = storage.set(data)
//        this.selectedBar && this.selectedBar.isPlay = false
        this.updateSelectedBar(Object.assign({ dataToken, index }, bar))
        this.closeDialog()
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
    height: calc(~"100% - 20px - " @bottom ~"-" @middle);
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
  .bar-item {
    height: calc(~"100% - 20px");
    border: 1px solid #ddd;
  }
  .full-height {
    height: 100%;
  }
</style>
