<template>
  <div class="uk-width-1-1 container"></div>
</template>
<script>
  import storage from '../commons/storage'
  import meteorological from '../data/meteorological.json'
  import {setWindToken} from '../vuex/actions'
  export default {
    vuex: {
      actions: { setWindToken }
    },
    created () {
      let dataToken = storage.set(meteorological)
      this.setWindToken(dataToken)
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
  }
</style>
